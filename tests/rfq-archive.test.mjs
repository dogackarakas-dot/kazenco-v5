import assert from "node:assert/strict";
import * as fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { archiveEmail, parseRfqEmail, readResendEmails, retentionReport } from "../scripts/rfq-archive.mjs";

const DAY = 86400000;
const now = Date.parse("2026-10-13T09:00:00Z");
const pathname = "rfq/1f45333a-71a1-40c3-b46b-afb59047e85c/4af740dd-b2a3-4757-a393-dc04f10942b0-test.csv";
const url = `https://bteevzpc3gein6rz.private.blob.vercel-storage.com/${pathname}?vercel-blob-delegation=TEST&vercel-blob-signature=TEST`;
const bytes = Buffer.from("test,data\n1,approved\n");
const email = () => ({ id: "test-email-id", from: "KAZENCO RFQ <rfq@kazenco.com>", to: ["info@kazenco.com"],
  subject: "KZ-RFQ-20261013-CC99F1 · Test", created_at: new Date(now).toISOString(),
  html: `<h3>Technical files</h3><ul><li><a href="${url.replaceAll("&", "&amp;")}">test.csv</a></li></ul>` });
async function sandbox(t) {
  const folder = await fs.mkdtemp(path.join(os.tmpdir(), "kazenco-archive-test-"));
  t.after(() => fs.rm(folder, { recursive: true, force: true }));
  return folder;
}
const copyOptions = { now, fetchFile: async () => new Response(bytes) };
const requestFolder = (root) => path.join(root, "2026", "KZ-RFQ-20261013-CC99F1");

test("ignores customer acknowledgments and third-party messages", () => {
  assert.equal(parseRfqEmail({ ...email(), from: "supplier@example.invalid" }), null);
  assert.equal(parseRfqEmail({ ...email(), to: ["customer@example.invalid"] }), null);
});
test("rejects foreign hosts, credentials, unsigned and encoded paths before downloading", () => {
  for (const bad of [url.replace("bteevzpc3gein6rz.private", "attacker.invalid.private"),
    url.replace("https://", "https://user:pass@"), url.split("?")[0], url.replace("/rfq/", "/rfq%2F")]) {
    const e = email(); e.html = `<h3>Technical files</h3><ul><a href="${bad}">test.csv</a></ul>`;
    assert.throws(() => parseRfqEmail(e));
  }
});
test("requires valid date and complete attachment section", () => {
  assert.throws(() => parseRfqEmail({ ...email(), subject: "KZ-RFQ-20260230-CC99F1 · Test" }));
  assert.throws(() => parseRfqEmail({ ...email(), created_at: "invalid" }));
  assert.throws(() => parseRfqEmail({ ...email(), html: "<p>truncated</p>" }));
});
test("an unrecognized extra attachment cannot be silently omitted", () => {
  const e = email();
  e.html = e.html.replace("</ul>", "<li><a href='unsupported'>extra.csv</a></li></ul>");
  assert.throws(() => parseRfqEmail(e), /UNRECOGNIZED_FILE_LIST/);
});
test("archives, re-reads SHA-256, records no signed URL and reuses verified copy after link expiry", async (t) => {
  const root = await sandbox(t);
  assert.equal((await archiveEmail(email(), root, copyOptions)).status, "archived_verified");
  const recordText = await fs.readFile(path.join(requestFolder(root), "archive-record.json"), "utf8");
  assert.ok(!recordText.includes("vercel-blob-signature"));
  assert.ok(!recordText.includes("https://"));
  assert.equal((await archiveEmail(email(), root, { now: now + 10 * DAY,
    fetchFile: () => assert.fail("Must not re-download verified copy") })).status, "already_verified");
});
test("keeps a changed archive copy protected, never overwrites it", async (t) => {
  const root = await sandbox(t);
  await archiveEmail(email(), root, copyOptions);
  const file = path.join(requestFolder(root), path.posix.basename(pathname));
  await fs.writeFile(file, "changed");
  await assert.rejects(archiveEmail(email(), root, copyOptions), /ARCHIVE_COPY_CHANGED/);
  const report = await retentionReport(root, now + 31 * DAY);
  assert.equal(report.requests[0].status, "unverified_keep_in_storage");
  assert.equal(await fs.readFile(file, "utf8"), "changed");
});
test("30-day boundary lists review candidates but performs no deletion", async (t) => {
  const root = await sandbox(t);
  await archiveEmail(email(), root, copyOptions);
  assert.equal((await retentionReport(root, now + 30 * DAY - 1)).requests[0].status, "retain_under_30_days");
  const report = await retentionReport(root, now + 30 * DAY);
  assert.equal(report.requests[0].status, "review_after_30_days");
  assert.equal(report.deletionEnabled, false);
  assert.equal(report.requests[0].secondBackupVerified, false);
  assert.deepEqual(await fs.readFile(path.join(requestFolder(root), path.posix.basename(pathname))), bytes);
});
test("missing file or missing archive record can never qualify for cleanup", async (t) => {
  const root = await sandbox(t);
  await archiveEmail(email(), root, copyOptions);
  await fs.unlink(path.join(requestFolder(root), path.posix.basename(pathname)));
  assert.equal((await retentionReport(root, now + 31 * DAY)).requests[0].status, "unverified_keep_in_storage");
  await fs.unlink(path.join(requestFolder(root), "archive-record.json"));
  assert.equal((await retentionReport(root, now + 31 * DAY)).requests[0].status, "unverified_keep_in_storage");
});
test("expired link, redirects and oversize downloads never create verified record", async (t) => {
  for (const response of [new Response("denied", { status: 403 }), new Response("redirect", { status: 302 }),
    new Response(Buffer.alloc(15 * 1024 * 1024 + 1))]) {
    const root = await sandbox(t);
    await assert.rejects(archiveEmail(email(), root, { now, fetchFile: async (_url, options) => {
      assert.equal(options.redirect, "error"); return response;
    } }));
    await assert.rejects(fs.stat(path.join(requestFolder(root), "archive-record.json")), { code: "ENOENT" });
  }
});
test("symlinked reference directories cannot redirect writes", async (t) => {
  const root = await sandbox(t);
  const other = await sandbox(t);
  await fs.mkdir(path.join(root, "2026"));
  await fs.symlink(other, requestFolder(root));
  await assert.rejects(archiveEmail(email(), root, copyOptions), /UNSAFE_ARCHIVE_DIRECTORY/);
  assert.deepEqual(await fs.readdir(other), []);
});
test("conflicting pre-existing files are preserved without a verified marker", async (t) => {
  const root = await sandbox(t);
  await fs.mkdir(requestFolder(root), { recursive: true });
  const file = path.join(requestFolder(root), path.posix.basename(pathname));
  await fs.writeFile(file, "user file");
  await assert.rejects(archiveEmail(email(), root, copyOptions), /EXISTING_FILE_CONFLICT/);
  assert.equal(await fs.readFile(file, "utf8"), "user file");
});
test("Resend cursor pagination uses only GET/list and checks provider errors", async () => {
  const seen = [];
  let page = 0;
  const client = { emails: {
    list: async (options) => { seen.push(options); return { data: { data: [{ ...email(), id: `id-${page}` }], has_more: page++ === 0 } }; },
    get: async (id) => ({ data: { ...email(), id } }),
  } };
  assert.equal((await readResendEmails(client, { pause: async () => {} })).length, 2);
  assert.equal(seen[1].after, "id-0");
  await assert.rejects(readResendEmails({ emails: { list: async () => ({ error: { message: "secret provider detail" } }) } },
    { pause: async () => {} }), /RESEND_LIST_FAILED/);
});
