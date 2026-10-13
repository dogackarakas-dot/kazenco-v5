import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const loadPackage = createRequire(import.meta.url);

// Execute the actual route with isolated SDK doubles: never call mail or storage services.
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const cache = new Map();
const sent = [];
const mocks = {
  "@/lib/rfq-security": {
    RfqSecurityError: class extends Error {},
    readRfqJson: (request) => request.json(),
    admitRfqSubmission: async () => "KZ-RFQ-20261013-MOCK01",
    rfqSecurityConfigured: () => true,
    rfqSecurityResponse: () => Response.json({ error: "mock protection failure" }, { status: 503 }),
  },
  resend: { Resend: class {
    emails = { send: async (message) => {
      sent.push(message);
      return { data: { id: "mock-delivery" }, error: null };
    } };
  } },
  "@vercel/blob": {
    issueSignedToken: async () => { throw new Error("Unexpected storage access"); },
    presignUrl: async () => { throw new Error("Unexpected storage access"); },
  },
};

function load(filename) {
  if (cache.has(filename)) return cache.get(filename).exports;
  const sandboxModule = { exports: {} };
  cache.set(filename, sandboxModule);
  const output = ts.transpileModule(fs.readFileSync(filename, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const localRequire = (specifier) => {
    if (mocks[specifier]) return mocks[specifier];
    if (specifier.startsWith("@/")) return load(path.join(root, "src", `${specifier.slice(2)}.ts`));
    return loadPackage(specifier);
  };
  new Function("require", "module", "exports", output)(localRequire, sandboxModule, sandboxModule.exports);
  return sandboxModule.exports;
}

const { POST } = load(path.join(root, "src/app/api/rfq/route.ts"));
const { RFQ_MAX_FILE_SIZE, RFQ_MAX_TOTAL_SIZE } = load(path.join(root, "src/lib/rfq.ts"));
const security = load(path.join(root, "src/lib/rfq-security.ts"));
const { isValidRfqPayload } = load(path.join(root, "src/lib/rfq-validation.ts"));
test("Vercel Redis variables are accepted without mixing credential pairs", () => {
  const names = ["RFQ_REDIS_REST_URL", "RFQ_REDIS_REST_TOKEN", "KV_REST_API_URL", "KV_REST_API_TOKEN"];
  const saved = names.map((name) => process.env[name]);
  const { rfqSecurityStore } = load(path.join(root, "src/lib/rfq-security-store.ts"));
  try {
    names.forEach((name) => { delete process.env[name]; });
    assert.equal(rfqSecurityStore.configured(), false);
    process.env.KV_REST_API_URL = "https://example.invalid";
    process.env.KV_REST_API_TOKEN = "dummy-test-token";
    assert.equal(rfqSecurityStore.configured(), true);
    process.env.RFQ_REDIS_REST_URL = "https://override.invalid";
    assert.equal(rfqSecurityStore.configured(), false);
    process.env.RFQ_REDIS_REST_TOKEN = "dummy-override-token";
    assert.equal(rfqSecurityStore.configured(), true);
    process.env.RFQ_REDIS_REST_URL = "http://override.invalid";
    assert.equal(rfqSecurityStore.configured(), false);
  } finally {
    names.forEach((name, index) => {
      if (saved[index] === undefined) delete process.env[name];
      else process.env[name] = saved[index];
    });
  }
});
const valid = () => ({
  name: "Test Customer", email: "customer@example.invalid", company: "Test Company",
  projectName: "Test Project", requestType: "Supply", location: "Atyrau",
  message: "Please review the requirement.", consent: true, locale: "en", files: [],
});

// This double exercises the shared-store contract, not the optional Redis service.
function makeStore() {
  const entries = new Map();
  let now = 0;
  const read = (key) => {
    const item = entries.get(key);
    return item && item.until > now ? item.value : null;
  };
  return {
    configured: () => true,
    advance: (seconds) => { now += seconds; },
    async get(key) { return read(key); },
    async setOnce(key, value, seconds) {
      if (read(key) !== null) return false;
      entries.set(key, { value, until: now + seconds });
      return true;
    },
    async consume(budgets) {
      if (budgets.some((budget) => Number(read(budget.name) ?? 0) + budget.amount > budget.limit)) return false;
      for (const budget of budgets) {
        const current = read(budget.name);
        entries.set(budget.name, {
          value: Number(current ?? 0) + budget.amount,
          until: budget.seconds === 0 ? Infinity : current === null ? now + budget.seconds : entries.get(budget.name).until,
        });
      }
      return true;
    },
  };
}
const status = (code) => (error) => error instanceof security.RfqSecurityError && error.status === code;
const sessionRequest = () => new Request("https://example.invalid/api/rfq/session");
const plan = (size = 1) => ({ name: "drawing.pdf", size });

test("shared admission and upload plans prevent repeated resource use", async (t) => {
  await t.test("daily byte reservation rejects excess atomically, fails closed as 503 (not a misleading 429 retry), and reopens after 24 hours", async () => {
    const store = makeStore();
    const manifest = [plan(RFQ_MAX_FILE_SIZE), plan(RFQ_MAX_FILE_SIZE), plan(10 * 1024 * 1024)];
    for (let i = 0; i < 3; i++) await security.createRfqSession(sessionRequest(), manifest, store);
    await security.createRfqSession(sessionRequest(), [plan(8 * 1024 * 1024)], store);
    await assert.rejects(security.createRfqSession(sessionRequest(), [plan(1)], store), (error) => {
      assert.ok(status(503)(error));
      assert.equal(security.rfqSecurityResponse(error).headers.get("Retry-After"), null);
      return true;
    });
    // The daily ceiling is a capacity concern, not a per-client rate limit: a
    // file-free session must still be admitted while it is exhausted.
    await security.createRfqSession(sessionRequest(), [], store);
    assert.equal(Number(await store.get("kazenco:rfq:shared:uploads:bytes:store")), 128 * 1024 * 1024);
    store.advance(86401);
    await security.createRfqSession(sessionRequest(), manifest, store);
  });
  await t.test("shared total byte budget survives time and environment changes; file-free requests remain accepted", async () => {
    const store = makeStore();
    const original = process.env.VERCEL_ENV;
    const manifest = [plan(RFQ_MAX_FILE_SIZE), plan(RFQ_MAX_FILE_SIZE), plan(10 * 1024 * 1024)];
    try {
      for (let i = 0; i < 18; i++) {
        process.env.VERCEL_ENV = i % 2 ? "production" : "preview";
        await security.createRfqSession(sessionRequest(), manifest, store);
        store.advance(86401);
      }
      await security.createRfqSession(sessionRequest(), [plan(RFQ_MAX_FILE_SIZE), plan(RFQ_MAX_FILE_SIZE)], store);
      store.advance(100 * 86400);
      await assert.rejects(security.createRfqSession(sessionRequest(), [plan(1)], store), (error) => {
        assert.ok(status(503)(error));
        assert.equal(security.rfqSecurityResponse(error).headers.get("Retry-After"), null);
        return true;
      });
      assert.equal(Number(await store.get("kazenco:rfq:shared:uploads:bytes:store")), 750 * 1024 * 1024);
      await security.createRfqSession(sessionRequest(), [], store);
    } finally {
      if (original === undefined) delete process.env.VERCEL_ENV;
      else process.env.VERCEL_ENV = original;
    }
  });
  await t.test("rejects ninth file, per-file excess and aggregate excess before creating a grant", async () => {
    const store = makeStore();
    for (const files of [Array.from({ length: 9 }, () => plan()), [plan(RFQ_MAX_FILE_SIZE + 1)],
      [plan(RFQ_MAX_FILE_SIZE), plan(RFQ_MAX_FILE_SIZE), plan(RFQ_MAX_FILE_SIZE)], [plan(-1)], [plan(1.5)]]) {
      await assert.rejects(security.createRfqSession(sessionRequest(), files, store), status(400));
    }
  });
  await t.test("normal 40 MB manifest gets exact, unique paths and a single grant per path", async () => {
    const store = makeStore();
    const files = [plan(RFQ_MAX_FILE_SIZE), plan(RFQ_MAX_FILE_SIZE), plan(10 * 1024 * 1024)];
    const session = await security.createRfqSession(sessionRequest(), files, store);
    assert.equal(new Set(session.uploads.map((file) => file.pathname)).size, 3);
    for (const file of session.uploads) {
      const payload = JSON.stringify({ sessionToken: session.sessionToken });
      assert.equal((await security.authorizeRfqUpload(file.pathname, payload, store)).size, file.size);
      await assert.rejects(security.authorizeRfqUpload(file.pathname, payload, store), status(429));
    }
  });
  await t.test("foreign session, invented path, claimed size and duplicated attachment cannot be accepted", async () => {
    const store = makeStore();
    const first = await security.createRfqSession(sessionRequest(), [plan()], store);
    const second = await security.createRfqSession(sessionRequest(), [plan()], store);
    const file = first.uploads[0];
    await assert.rejects(security.authorizeRfqUpload(file.pathname,
      JSON.stringify({ sessionToken: second.sessionToken }), store), status(400));
    for (const files of [[{ ...file, size: 2 }], [file, file], [{ ...file, pathname: "rfq/invented.pdf" }]]) {
      await assert.rejects(security.admitRfqSubmission(sessionRequest(), first.sessionToken, "a@example.invalid", files, store), status(400));
    }
    assert.match(await security.admitRfqSubmission(sessionRequest(), first.sessionToken, "a@example.invalid", [file], store), /^KZ-RFQ-/);
  });
  await t.test("concurrent duplicate submissions permit one dispatch reservation", async () => {
    const store = makeStore();
    const session = await security.createRfqSession(sessionRequest(), [], store);
    const attempts = await Promise.allSettled(Array.from({ length: 4 }, () =>
      security.admitRfqSubmission(sessionRequest(), session.sessionToken, "a@example.invalid", [], store)));
    assert.equal(attempts.filter((result) => result.status === "fulfilled").length, 1);
  });
  await t.test("recipient budget normalizes case and cannot be bypassed with fresh sessions", async () => {
    const store = makeStore();
    for (let index = 0; index < 4; index++) {
      const session = await security.createRfqSession(sessionRequest(), [], store);
      const attempt = security.admitRfqSubmission(sessionRequest(), session.sessionToken,
        index % 2 ? "CUSTOMER@example.invalid" : "customer@example.invalid", [], store);
      if (index < 3) await attempt;
      else await assert.rejects(attempt, status(429));
    }
  });
  await t.test("global submission budget admits 40, rejects the 41st and resets after 24 hours", async () => {
    const store = makeStore();
    for (let index = 0; index < 40; index++) {
      const session = await security.createRfqSession(sessionRequest(), [], store);
      await security.admitRfqSubmission(sessionRequest(), session.sessionToken,
        `customer-${index}@example.invalid`, [], store);
      store.advance(610);
    }
    const blocked = await security.createRfqSession(sessionRequest(), [], store);
    await assert.rejects(security.admitRfqSubmission(sessionRequest(), blocked.sessionToken,
      "customer-40@example.invalid", [], store), status(429));
    store.advance(86400 - 40 * 610);
    const renewed = await security.createRfqSession(sessionRequest(), [], store);
    assert.match(await security.admitRfqSubmission(sessionRequest(), renewed.sessionToken,
      "customer-41@example.invalid", [], store), /^KZ-RFQ-/);
  });
  await t.test("session expires and caller-supplied forwarding headers do not create new local buckets", async () => {
    const original = process.env.VERCEL;
    delete process.env.VERCEL;
    try {
      const store = makeStore();
      const session = await security.createRfqSession(sessionRequest(), [], store);
      store.advance(1801);
      await assert.rejects(security.admitRfqSubmission(sessionRequest(), session.sessionToken, "a@example.invalid", [], store), status(400));
      for (let index = 0; index < 10; index++) {
        const req = new Request("https://example.invalid/api/rfq/session", { headers: { "x-vercel-forwarded-for": `192.0.2.${index}` } });
        const attempt = security.createRfqSession(req, [], store);
        if (index < 9) await attempt;
        else await assert.rejects(attempt, status(429));
      }
    } finally {
      if (original === undefined) delete process.env.VERCEL;
      else process.env.VERCEL = original;
    }
  });
  await t.test("oversized body with no Content-Length is rejected before JSON parsing", async () => {
    const req = new Request("https://example.invalid/api/rfq", { method: "POST", body: "x".repeat(65537) });
    await assert.rejects(security.readRfqJson(req), status(413));
    assert.deepEqual(await security.readRfqJson(request({ files: [] })), { files: [] });
  });
  await t.test("unavailable store produces a sanitized 503, never an unprotected fallback", async () => {
    const store = { ...makeStore(), consume: async () => { throw new Error("private backend detail"); } };
    try {
      await security.createRfqSession(sessionRequest(), [], store);
      assert.fail("Must fail closed");
    } catch (error) {
      const response = security.rfqSecurityResponse(error);
      assert.equal(response.status, 503);
      assert.ok(!JSON.stringify(await response.json()).includes("private backend detail"));
    }
  });
});

test("actual upload SDK and mail route enforce the admission contract", async (t) => {
  const store = makeStore();
  const guardMock = mocks["@/lib/rfq-security"];
  const originalGuard = { ...guardMock };
  const envNames = ["BLOB_READ_WRITE_TOKEN", "VERCEL_BLOB_CALLBACK_URL", "RESEND_API_KEY", "RFQ_FROM_EMAIL"];
  const savedEnv = Object.fromEntries(envNames.map((name) => [name, process.env[name]]));
  // Deliberately invalid service credentials; signing is local and no external call is made.
  process.env.BLOB_READ_WRITE_TOKEN = "vercel_blob_rw_localtest_dummy-not-a-real-secret";
  process.env.VERCEL_BLOB_CALLBACK_URL = "https://example.invalid/api/rfq/upload";
  process.env.RESEND_API_KEY = "mock-only";
  process.env.RFQ_FROM_EMAIL = "mock@example.invalid";
  Object.assign(guardMock, {
    RfqSecurityError: security.RfqSecurityError,
    readRfqJson: security.readRfqJson,
    rfqSecurityResponse: security.rfqSecurityResponse,
    authorizeRfqUpload: (pathname, payload) => security.authorizeRfqUpload(pathname, payload, store),
    admitRfqSubmission: (req, token, email, files) => security.admitRfqSubmission(req, token, email, files, store),
  });
  t.after(() => {
    for (const name of Object.keys(guardMock)) delete guardMock[name];
    Object.assign(guardMock, originalGuard);
    for (const name of envNames) {
      if (savedEnv[name] === undefined) delete process.env[name];
      else process.env[name] = savedEnv[name];
    }
  });
  const uploadRoute = load(path.join(root, "src/app/api/rfq/upload/route.ts"));
  const { getPayloadFromClientToken } = loadPackage("@vercel/blob/client");
  const uploadRequest = (pathname, sessionToken, multipart = false) => request({
    type: "blob.generate-client-token", payload: { pathname, multipart,
      clientPayload: JSON.stringify({ sessionToken }) },
  });

  await t.test("SDK grant fixes path and size and prohibits random paths and overwrite", async () => {
    const session = await security.createRfqSession(sessionRequest(), [plan(1234)], store);
    const response = await uploadRoute.POST(uploadRequest(session.uploads[0].pathname, session.sessionToken));
    assert.equal(response.status, 200);
    const payload = getPayloadFromClientToken((await response.json()).clientToken);
    assert.equal(payload.pathname, session.uploads[0].pathname);
    assert.equal(payload.maximumSizeInBytes, 1234);
    assert.equal(payload.addRandomSuffix, false);
    assert.equal(payload.allowOverwrite, false);
    const repeated = await uploadRoute.POST(uploadRequest(session.uploads[0].pathname, session.sessionToken));
    assert.equal(repeated.status, 429);
    assert.ok(repeated.headers.has("Retry-After"));
  });
  await t.test("unplanned and multipart upload paths are rejected", async () => {
    const session = await security.createRfqSession(sessionRequest(), [plan()], store);
    assert.equal((await uploadRoute.POST(uploadRequest("rfq/unplanned.pdf", session.sessionToken))).status, 400);
    assert.equal((await uploadRoute.POST(uploadRequest(session.uploads[0].pathname, session.sessionToken, true))).status, 400);
  });
  await t.test("legacy direct mail request has no session and cannot dispatch", async () => {
    sent.length = 0;
    assert.equal((await POST(request(valid()))).status, 400);
    assert.equal(sent.length, 0);
  });
  await t.test("normal mail submission works once; duplicate gets 429 with zero new emails", async () => {
    const session = await security.createRfqSession(sessionRequest(), [], store);
    const payload = { ...valid(), sessionToken: session.sessionToken };
    sent.length = 0;
    assert.equal((await POST(request(payload))).status, 200);
    assert.equal(sent.length, 2);
    sent.length = 0;
    assert.equal((await POST(request(payload))).status, 429);
    assert.equal(sent.length, 0);
  });
});
const file = (size = 1) => ({
  name: "drawing.pdf", kind: "drawings", size, pathname: "rfq/drawing.pdf",
  url: "https://test.private.blob.vercel-storage.com/rfq/drawing.pdf",
});
const request = (payload) => new Request("https://example.invalid/api/rfq", {
  method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
});

test("RFQ rejects malformed values before signing or mail dispatch", async (t) => {
  const originalKey = process.env.RESEND_API_KEY;
  const originalSender = process.env.RFQ_FROM_EMAIL;
  process.env.RESEND_API_KEY = "mock-only";
  process.env.RFQ_FROM_EMAIL = "mock@example.invalid";
  t.after(() => {
    if (originalKey === undefined) delete process.env.RESEND_API_KEY;
    else process.env.RESEND_API_KEY = originalKey;
    if (originalSender === undefined) delete process.env.RFQ_FROM_EMAIL;
    else process.env.RFQ_FROM_EMAIL = originalSender;
  });

  for (const [field, max] of [["phone", 80], ["requiredBy", 80], ["specification", 5000], ["website", 200]]) {
    for (const value of [42, {}, [], true, null, "x".repeat(max + 1)]) {
      await t.test(`${field} rejects ${typeof value}, length ${value?.length ?? "n/a"}`, async () => {
        sent.length = 0;
        const response = await POST(request({ ...valid(), [field]: value }));
        assert.equal(response.status, 400);
        assert.equal(sent.length, 0);
      });
    }
  }

  const invalidFiles = [
    [null], [42], [{}], [file(0)], [file(-1)], [file(0.5)], [file(RFQ_MAX_FILE_SIZE + 1)],
    [file(1), file(RFQ_MAX_FILE_SIZE), file(RFQ_MAX_FILE_SIZE), file(RFQ_MAX_TOTAL_SIZE - 2 * RFQ_MAX_FILE_SIZE)],
    Array.from({ length: 9 }, () => file()),
    [{ ...file(), url: "https://attacker.invalid/blob.vercel-storage.com/rfq/drawing.pdf" }],
    [{ ...file(), url: "https://store.blob.vercel-storage.com@attacker.invalid/rfq/drawing.pdf" }],
  ];
  for (const [index, files] of invalidFiles.entries()) {
    await t.test(`malformed attachment set ${index} returns 400`, async () => {
      sent.length = 0;
      const response = await POST(request({ ...valid(), files }));
      assert.equal(response.status, 400);
      assert.equal(sent.length, 0);
    });
  }
  await t.test("raw padded input cannot bypass the text limit", async () => {
    sent.length = 0;
    assert.equal((await POST(request({ ...valid(), message: " ".repeat(5000) + "x" }))).status, 400);
    assert.equal(sent.length, 0);
  });
  await t.test("private Blob host and valid 40 MB attachment set remain accepted", () => {
    assert.equal(isValidRfqPayload({ ...valid(), files: [file(RFQ_MAX_FILE_SIZE), file(RFQ_MAX_FILE_SIZE), file(10 * 1024 * 1024)] }), true);
  });
  await t.test("valid optional fields, empty values and all locales still reach mocked delivery", async () => {
    for (const locale of ["en", "ru", "tr", "kz"]) {
      for (const optional of [{}, { phone: "", requiredBy: "", specification: "" },
        { phone: "x".repeat(80), requiredBy: "x".repeat(80), specification: "x".repeat(5000) }]) {
        sent.length = 0;
        const response = await POST(request({ ...valid(), locale, ...optional }));
        assert.equal(response.status, 200);
        assert.match((await response.json()).reference, /^KZ-RFQ-/);
        assert.equal(sent.length, 2);
        assert.equal(sent[0].to, "info@kazenco.com");
        assert.equal(sent[1].to, "customer@example.invalid");
      }
    }
  });
  await t.test("HTML escapes remain intact", async () => {
    sent.length = 0;
    assert.equal((await POST(request({ ...valid(), phone: "<script>&", specification: "<script>" }))).status, 200);
    assert.ok(sent[0].html.includes("&lt;script&gt;&amp;"));
    assert.ok(!sent[0].html.includes("<script>"));
  });
});
