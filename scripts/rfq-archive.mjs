import { createHash } from "node:crypto";
import { constants } from "node:fs";
import * as fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";

const DAY = 86400000;
const MAX_FILE = 15 * 1024 * 1024;
const REFERENCE = /^KZ-RFQ-(\d{8})-[A-F0-9]{6}$/;
const DEFAULT_HOST = "bteevzpc3gein6rz.private.blob.vercel-storage.com";
const FILE_PATH = /^rfq\/[a-f0-9-]{36}\/[a-f0-9-]{36}-[a-zA-Z0-9_-]+\.(pdf|dwg|dxf|xls|xlsx|csv|doc|docx)$/;
const digest = (bytes) => createHash("sha256").update(bytes).digest("hex");
const fail = (code) => { throw new Error(code); };

function timestamp(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}[T ]/.test(value)) return NaN;
  return Date.parse(value);
}

function decodeHtml(value) {
  return value.replace(/&(?:amp|quot|apos|lt|gt|#39);/g, (entity) => ({
    "&amp;": "&", "&quot;": '"', "&apos;": "'", "&#39;": "'", "&lt;": "<", "&gt;": ">",
  })[entity]);
}

export function isInternalRfq(email) {
  return /^KAZENCO RFQ <rfq@kazenco\.com>$/i.test(email?.from ?? "") &&
    Array.isArray(email?.to) && email.to.length === 1 && typeof email.to[0] === "string" && email.to[0].toLowerCase() === "info@kazenco.com" &&
    /^KZ-RFQ-\d{8}-[A-F0-9]{6} · /.test(email?.subject ?? "");
}

export function parseRfqEmail(email, storeHost = DEFAULT_HOST) {
  if (!/^[a-z0-9]+\.private\.blob\.vercel-storage\.com$/.test(storeHost)) fail("INVALID_STORE_HOST");
  if (!isInternalRfq(email)) return null;
  const reference = email.subject.split(" · ")[0];
  const date = REFERENCE.exec(reference)?.[1];
  const calendarDate = `${date?.slice(0, 4)}-${date?.slice(4, 6)}-${date?.slice(6, 8)}`;
  if (!date || !Number.isFinite(Date.parse(calendarDate)) ||
      new Date(calendarDate).toISOString().slice(0, 10) !== calendarDate ||
      !Number.isFinite(timestamp(email.created_at)) || typeof email.id !== "string") fail("INVALID_RFQ_METADATA");
  if (typeof email.html !== "string" || email.html.length > 1024 * 1024) fail("INVALID_RFQ_BODY");
  const section = /<h3>Technical files<\/h3><ul>([\s\S]*?)<\/ul>/i.exec(email.html)?.[1];
  if (section === undefined) fail("MISSING_RFQ_FILE_SECTION");
  const links = [...section.matchAll(/<a\s+href="([^"]+)"[^>]*>([^<]*)<\/a>/gi)];
  if ((section.match(/<a\b/gi) ?? []).length !== links.length) fail("UNRECOGNIZED_FILE_LIST");
  const files = links.map((match) => {
    let url;
    try { url = new URL(decodeHtml(match[1])); } catch { fail("INVALID_FILE_LINK"); }
    if (url.protocol !== "https:" || url.hostname !== storeHost || url.port || url.username || url.password || url.hash ||
        !url.searchParams.get("vercel-blob-delegation") || !url.searchParams.get("vercel-blob-signature")) fail("UNTRUSTED_FILE_LINK");
    let pathname;
    try { pathname = decodeURIComponent(url.pathname.slice(1)); } catch { fail("INVALID_FILE_PATH"); }
    if (url.pathname !== `/${pathname}` || !FILE_PATH.test(pathname)) fail("INVALID_FILE_PATH");
    return { url: url.href, pathname, filename: path.posix.basename(pathname) };
  });
  if (files.length > 8 || new Set(files.map((file) => file.pathname)).size !== files.length) fail("INVALID_FILE_LIST");
  if (!files.length && section.trim() !== "<li>No files submitted</li>") fail("UNRECOGNIZED_FILE_LIST");
  return { reference, sourceEmailId: email.id, submittedAt: email.created_at, files };
}

// Refuse symlinked directories/files rather than writing outside the selected archive.
async function directory(folder) {
  try { await fs.mkdir(folder, { mode: 0o700 }); } catch (error) { if (error.code !== "EEXIST") throw error; }
  const entry = await fs.lstat(folder);
  if (!entry.isDirectory() || entry.isSymbolicLink()) fail("UNSAFE_ARCHIVE_DIRECTORY");
}

async function readRegular(filename, maximum = MAX_FILE) {
  const handle = await fs.open(filename, constants.O_RDONLY | constants.O_NOFOLLOW);
  try {
    const entry = await handle.stat();
    if (!entry.isFile() || entry.size > maximum) fail("UNSAFE_ARCHIVE_FILE");
    const bytes = await handle.readFile();
    if (bytes.length > maximum) fail("UNSAFE_ARCHIVE_FILE");
    return bytes;
  } finally { await handle.close(); }
}

async function download(url, fetchFile) {
  const response = await fetchFile(url, { redirect: "error", signal: AbortSignal.timeout(30000) });
  if (!response.ok) fail(response.status === 403 ? "LINK_EXPIRED_OR_DENIED" : "DOWNLOAD_FAILED");
  const reader = response.body?.getReader();
  if (!reader) fail("EMPTY_DOWNLOAD");
  const chunks = [];
  let size = 0;
  try {
    for (;;) {
      const { value, done } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_FILE) { await reader.cancel(); fail("FILE_TOO_LARGE"); }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  if (!size) fail("EMPTY_DOWNLOAD");
  return Buffer.concat(chunks);
}

export async function archiveEmail(email, root, { storeHost = DEFAULT_HOST, fetchFile = fetch, now = Date.now() } = {}) {
  const rfq = parseRfqEmail(email, storeHost);
  if (!rfq) return { status: "ignored" };
  if (timestamp(rfq.submittedAt) > now) fail("FUTURE_RFQ_DATE");
  // The selected root must already exist; never create arbitrary parent directories.
  const base = await fs.realpath(root);
  const year = path.join(base, rfq.reference.slice(7, 11));
  await directory(year);
  const folder = path.join(year, rfq.reference);
  await directory(folder);
  const marker = path.join(folder, "archive-record.json");
  let existing;
  try { existing = JSON.parse((await readRegular(marker, 1024 * 1024)).toString("utf8")); }
  catch (error) { if (error.code !== "ENOENT") fail("INVALID_ARCHIVE_RECORD"); }
  if (existing) {
    if (existing.schemaVersion !== 1 || existing.reference !== rfq.reference || existing.sourceEmailId !== rfq.sourceEmailId ||
        !Array.isArray(existing.files) || existing.files.length !== rfq.files.length) fail("ARCHIVE_RECORD_CONFLICT");
    for (const file of rfq.files) {
      const saved = existing.files.find((item) => item.pathname === file.pathname && item.filename === file.filename);
      if (!saved) fail("ARCHIVE_RECORD_CONFLICT");
      const bytes = await readRegular(path.join(folder, file.filename));
      if (bytes.length !== saved.size || digest(bytes) !== saved.sha256) fail("ARCHIVE_COPY_CHANGED");
    }
    return { reference: rfq.reference, status: "already_verified", files: existing.files.length };
  }
  const records = [];
  let total = 0;
  for (const file of rfq.files) {
    const bytes = await download(file.url, fetchFile);
    total += bytes.length;
    if (total > 40 * 1024 * 1024) fail("RFQ_FILES_TOO_LARGE");
    const filename = path.join(folder, file.filename);
    try { await fs.writeFile(filename, bytes, { flag: "wx", mode: 0o600 }); }
    catch (error) { if (error.code !== "EEXIST") throw error; }
    const stored = await readRegular(filename);
    if (stored.length !== bytes.length || digest(stored) !== digest(bytes)) fail("EXISTING_FILE_CONFLICT");
    records.push({ pathname: file.pathname, filename: file.filename, size: bytes.length, sha256: digest(stored) });
  }
  // A record is written only after every file has been copied and re-read successfully.
  await fs.writeFile(marker, JSON.stringify({ schemaVersion: 1, reference: rfq.reference, sourceEmailId: rfq.sourceEmailId,
    submittedAt: rfq.submittedAt, archiveVerifiedAt: new Date(now).toISOString(), files: records,
    secondBackupVerified: false, cloudDeleted: false }, null, 2) + "\n", { flag: "wx", mode: 0o600 });
  return { reference: rfq.reference, status: "archived_verified", files: records.length };
}

export async function retentionReport(root, now = Date.now()) {
  const report = { generatedAt: new Date(now).toISOString(), deletionEnabled: false, requests: [] };
  const base = await fs.realpath(root);
  for (const year of await fs.readdir(base, { withFileTypes: true })) {
    if (!year.isDirectory() || !/^\d{4}$/.test(year.name)) continue;
    for (const entry of await fs.readdir(path.join(base, year.name), { withFileTypes: true })) {
      if (!entry.isDirectory() || !REFERENCE.test(entry.name)) continue;
      const folder = path.join(base, year.name, entry.name);
      const result = { reference: entry.name, status: "unverified", files: [] };
      try {
        const record = JSON.parse((await readRegular(path.join(folder, "archive-record.json"), 1024 * 1024)).toString("utf8"));
        const submitted = timestamp(record.submittedAt);
        const verified = timestamp(record.archiveVerifiedAt);
        if (record.schemaVersion !== 1 || record.reference !== entry.name || !Number.isFinite(submitted) ||
            !Number.isFinite(verified) || submitted > verified || verified > now || !Array.isArray(record.files) ||
            record.files.length > 8 || record.cloudDeleted !== false) fail("INVALID_ARCHIVE_RECORD");
        const names = new Set();
        for (const file of record.files) {
          if (typeof file.filename !== "string" || path.basename(file.filename) !== file.filename ||
              !/^[a-zA-Z0-9_.-]+$/.test(file.filename) || names.has(file.filename) ||
              typeof file.pathname !== "string" || !FILE_PATH.test(file.pathname) || path.posix.basename(file.pathname) !== file.filename ||
              !Number.isSafeInteger(file.size) || file.size <= 0 || !/^[a-f0-9]{64}$/.test(file.sha256)) fail("INVALID_ARCHIVE_RECORD");
          names.add(file.filename);
          const bytes = await readRegular(path.join(folder, file.filename));
          if (bytes.length !== file.size || digest(bytes) !== file.sha256) fail("ARCHIVE_COPY_CHANGED");
          result.files.push({ pathname: file.pathname, filename: file.filename, size: file.size });
        }
        result.status = now - submitted >= 30 * DAY ? "review_after_30_days" : "retain_under_30_days";
        result.secondBackupVerified = record.secondBackupVerified === true;
      } catch { result.status = "unverified_keep_in_storage"; result.files = []; }
      report.requests.push(result);
    }
  }
  return report;
}

export async function readResendEmails(client, { pause = () => new Promise((resolve) => setTimeout(resolve, 550)) } = {}) {
  const emails = [];
  const cursors = new Set();
  let after;
  for (let page = 0; page < 100; page++) {
    await pause();
    const { data, error } = await client.emails.list({ limit: 100, ...(after ? { after } : {}) });
    if (error || !Array.isArray(data?.data)) fail("RESEND_LIST_FAILED");
    for (const item of data.data) {
      if (!isInternalRfq(item)) continue;
      await pause();
      const detail = await client.emails.get(item.id);
      if (detail.error || !detail.data || detail.data.id !== item.id) fail("RESEND_READ_FAILED");
      emails.push(detail.data);
    }
    if (!data.has_more) return emails;
    after = data.data.at(-1)?.id;
    if (!after || cursors.has(after)) fail("RESEND_PAGINATION_FAILED");
    cursors.add(after);
  }
  fail("RESEND_PAGINATION_LIMIT");
}

async function main() {
  const flags = process.argv.slice(2);
  const allowed = new Set(["--root", "--emails", "--resend", "--report-only", "--store-host"]);
  const args = {};
  for (let i = 0; i < flags.length; i++) {
    const flag = flags[i];
    if (!allowed.has(flag) || flag in args) fail("INVALID_ARGUMENT");
    args[flag] = ["--resend", "--report-only"].includes(flag) ? true : flags[++i];
    if (!args[flag] || typeof args[flag] === "string" && args[flag].startsWith("--")) fail("INVALID_ARGUMENT");
  }
  if ([args["--emails"], args["--resend"], args["--report-only"]].filter(Boolean).length !== 1) fail("CHOOSE_EMAIL_FILE_RESEND_OR_REPORT_ONLY");
  const root = args["--root"] ?? path.join(os.homedir(), "Documents", "KAZENCO", "RFQ Arşivi");
  let emails = [];
  if (args["--emails"]) emails = JSON.parse((await readRegular(args["--emails"], 16 * 1024 * 1024)).toString("utf8"));
  if (args["--resend"]) {
    if (!process.env.RESEND_API_KEY) fail("RESEND_API_KEY_REQUIRED");
    const { Resend } = await import("resend");
    emails = await readResendEmails(new Resend(process.env.RESEND_API_KEY));
  }
  if (!Array.isArray(emails)) fail("EMAIL_ARRAY_REQUIRED");
  const results = [];
  let failures = 0;
  for (const email of emails) {
    try { results.push(await archiveEmail(email, root, { storeHost: args["--store-host"] ?? DEFAULT_HOST })); }
    catch (error) {
      failures++;
      // Provider errors and signed URLs must never reach console logs.
      const code = /^[A-Z_]+$/.test(error.message) ? error.message : "ARCHIVE_FAILED";
      results.push({ status: "failed_kept_in_storage", code });
    }
  }
  process.stdout.write(JSON.stringify({ results, retention: await retentionReport(root) }, null, 2) + "\n");
  if (failures) process.exitCode = 1;
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  main().catch((error) => {
    process.stderr.write((/^[A-Z_]+$/.test(error.message) ? error.message : "ARCHIVE_CHECK_FAILED") + "\n");
    process.exitCode = 1;
  });
}
