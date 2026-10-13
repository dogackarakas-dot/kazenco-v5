import { createHash, randomBytes, randomUUID } from "node:crypto";
import { isIP } from "node:net";
import { createRfqReference, fileExtension, RFQ_ALLOWED_EXTENSIONS, RFQ_MAX_FILES, RFQ_MAX_FILE_SIZE, RFQ_MAX_TOTAL_SIZE, safeFilename } from "@/lib/rfq";
import { rfqSecurityStore, type RfqBudget, type RfqSecurityStore } from "@/lib/rfq-security-store";

const SESSION_SECONDS = 30 * 60;
const TOKEN_PATTERN = /^[a-f0-9]{64}$/;
const STORE_UPLOAD_BUDGET = "uploads:bytes:store";

export async function readRfqJson(request: Request): Promise<unknown> {
  const reader = request.body?.getReader();
  if (!reader) throw new RfqSecurityError(400, "Invalid request.");
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 64 * 1024) {
        await reader.cancel();
        throw new RfqSecurityError(413, "RFQ request is too large.");
      }
      chunks.push(value);
    }
    return JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } finally { reader.releaseLock(); }
}

export class RfqSecurityError extends Error {
  constructor(public status: number, message: string) { super(message); }
}

export function rfqSecurityConfigured() {
  return rfqSecurityStore.configured();
}

function key(value: string) {
  // Preview and Production share one physical Blob store: share its reservation
  // ceiling too. Session and mail counters remain isolated by environment.
  if (value === STORE_UPLOAD_BUDGET) return `kazenco:rfq:shared:${value}`;
  const namespace = process.env.VERCEL_ENV ?? process.env.NODE_ENV ?? "development";
  return `kazenco:rfq:${namespace}:${value}`;
}

async function consumeBudgets(budgets: RfqBudget[], store: RfqSecurityStore) {
  if (!await store.consume(budgets.map((budget) => ({ ...budget, name: key(budget.name) })))) {
    for (const budget of budgets) {
      if (!budget.capacity) continue;
      if (Number(await store.get(key(budget.name)) ?? 0) + budget.amount > budget.limit) {
        // A capacity ceiling (daily or shared reserved upload bytes) needs an
        // operator review; a timed retry would be misleading, so this fails
        // as 503, which the existing client already treats as a reason to
        // open its manual email fallback. Request-rate budgets (session/mail
        // counts) are not capacity and fall through to the 429 below.
        throw new RfqSecurityError(503, "Secure attachment capacity is unavailable. Please contact us by email.");
      }
    }
    throw new RfqSecurityError(429, "Too many requests. Please try again later.");
  }
}

function clientKey(request: Request) {
  // Trust Vercel's overwritten header only when running on Vercel. Else use one
  // shared bucket instead of trusting spoofable forwarding headers.
  const value = process.env.VERCEL === "1" ? request.headers.get("x-vercel-forwarded-for")?.trim() : undefined;
  const client = value && isIP(value) ? value : "unidentified-client";
  return createHash("sha256").update(client).digest("hex");
}

export interface RfqUploadPlan { name: string; size: number; pathname: string }
interface RfqSession { reference: string; uploads: RfqUploadPlan[] }

export async function createRfqSession(request: Request, files: unknown, store: RfqSecurityStore = rfqSecurityStore) {
  if (!Array.isArray(files) || files.length > RFQ_MAX_FILES) throw new RfqSecurityError(400, "Invalid attachment list.");
  const uploads: RfqUploadPlan[] = [];
  const sessionId = randomUUID();
  for (const file of files) {
    if (!file || typeof file !== "object" || typeof file.name !== "string" || file.name.length > 180 ||
      !RFQ_ALLOWED_EXTENSIONS.has(fileExtension(file.name)) || !Number.isSafeInteger(file.size) ||
      file.size <= 0 || file.size > RFQ_MAX_FILE_SIZE) throw new RfqSecurityError(400, "Invalid attachment.");
    uploads.push({ name: file.name, size: file.size, pathname: `rfq/${sessionId}/${randomUUID()}-${safeFilename(file.name)}` });
  }
  const bytes = uploads.reduce((total, file) => total + file.size, 0);
  if (bytes > RFQ_MAX_TOTAL_SIZE) throw new RfqSecurityError(400, "Combined attachments exceed the RFQ limit.");
  await consumeBudgets([
    { name: `sessions:client:${clientKey(request)}`, amount: 1, limit: 10, seconds: 3600 },
    { name: "sessions:global", amount: 1, limit: 200, seconds: 86400 },
    { name: "uploads:bytes:global", amount: bytes, limit: 128 * 1024 * 1024, seconds: 86400, capacity: true },
    { name: STORE_UPLOAD_BUDGET, amount: bytes, limit: 750 * 1024 * 1024, seconds: 0, capacity: true },
  ], store);
  const sessionToken = randomBytes(32).toString("hex");
  const session: RfqSession = { reference: createRfqReference(), uploads };
  if (!await store.setOnce(sessionKey(sessionToken), JSON.stringify(session), SESSION_SECONDS)) {
    throw new RfqSecurityError(503, "RFQ session could not be created.");
  }
  return { sessionToken, uploads };
}

function sessionKey(token: string) {
  return key(`session:${createHash("sha256").update(token).digest("hex")}`);
}

async function readSession(token: unknown, store: RfqSecurityStore): Promise<RfqSession> {
  if (typeof token !== "string" || !TOKEN_PATTERN.test(token)) throw new RfqSecurityError(400, "Invalid RFQ session.");
  const raw = await store.get(sessionKey(token));
  if (typeof raw !== "string") throw new RfqSecurityError(400, "RFQ session has expired.");
  return JSON.parse(raw) as RfqSession;
}

export async function authorizeRfqUpload(pathname: string, clientPayload: string | null, store: RfqSecurityStore = rfqSecurityStore) {
  let token: unknown;
  try { token = JSON.parse(clientPayload ?? "{}").sessionToken; }
  catch { throw new RfqSecurityError(400, "Invalid upload request."); }
  const session = await readSession(token, store);
  const plan = session.uploads.find((file) => file.pathname === pathname);
  if (!plan) throw new RfqSecurityError(400, "Attachment does not belong to this RFQ.");
  // One token per planned path. Failed uploads reserve their budget rather than
  // opening an unbounded retry path. The UI retains the manual-email fallback.
  if (!await store.setOnce(key(`upload:${pathname}`), "issued", SESSION_SECONDS)) {
    throw new RfqSecurityError(429, "Upload authorization already used.");
  }
  return plan;
}

export async function admitRfqSubmission(request: Request, token: unknown, email: string,
  files: { name: string; pathname: string; size: number }[], store: RfqSecurityStore = rfqSecurityStore) {
  const session = await readSession(token, store);
  const unique = new Set(files.map((file) => file.pathname));
  if (unique.size !== files.length || files.some((file) => !session.uploads.some((plan) =>
    plan.pathname === file.pathname && plan.name === file.name && plan.size === file.size))) {
    throw new RfqSecurityError(400, "Attachment does not belong to this RFQ.");
  }
  const recipient = createHash("sha256")
    .update(email.trim().toLowerCase()).digest("hex");
  await consumeBudgets([
    { name: `mail:client:${clientKey(request)}`, amount: 1, limit: 5, seconds: 600 },
    { name: `mail:recipient:${recipient}`, amount: 1, limit: 3, seconds: 3600 },
    { name: "mail:global", amount: 1, limit: 40, seconds: 86400 },
  ], store);
  if (!await store.setOnce(key(`submission:${session.reference}`), "claimed", 86400)) {
    throw new RfqSecurityError(429, "RFQ session already submitted.");
  }
  return session.reference;
}

export function rfqSecurityResponse(error: unknown) {
  const status = error instanceof RfqSecurityError ? error.status : 503;
  const message = error instanceof RfqSecurityError ? error.message : "Secure RFQ service is temporarily unavailable.";
  return Response.json({ error: message }, {
    status, headers: { "Cache-Control": "no-store", ...(status === 429 ? { "Retry-After": "600" } : {}) },
  });
}
