import assert from "node:assert/strict";
import test from "node:test";
import { runArchive, KEYCHAIN_SERVICE, KEYCHAIN_ACCOUNT } from "../scripts/rfq-archive-run.mjs";

test("keychain credential travels only through child environment, never arguments or report", async () => {
  const calls = [];
  const report = await runArchive({ platform: "darwin", executeCommand: async (command, args, options) => {
    calls.push({ command, args });
    if (command === "/usr/bin/security") {
      assert.deepEqual(args, ["find-generic-password", "-s", KEYCHAIN_SERVICE, "-a", KEYCHAIN_ACCOUNT, "-w"]);
      return { stdout: "re_TEST_ONLY\n" };
    }
    assert.equal(options.env.RESEND_API_KEY, "re_TEST_ONLY");
    assert.equal(args.at(-1), "--resend");
    return { stdout: JSON.stringify({ results: [], retention: { deletionEnabled: false } }) };
  } });
  assert.ok(!JSON.stringify(calls).includes("re_TEST_ONLY"));
  assert.ok(!JSON.stringify(report).includes("re_TEST_ONLY"));
});

test("missing or invalid credentials prevent any archive child process", async () => {
  for (const stdout of [null, "invalid-key"]) {
    let count = 0;
    await assert.rejects(runArchive({ platform: "darwin", executeCommand: async () => {
      count++;
      if (stdout === null) throw new Error("secret provider detail");
      return { stdout };
    } }), /ARCHIVE_KEYCHAIN_ACCESS_REQUIRED|INVALID_ARCHIVE_CREDENTIAL/);
    assert.equal(count, 1);
  }
});

test("child failures hide raw credential and provider details", async () => {
  let count = 0;
  await assert.rejects(runArchive({ platform: "darwin", executeCommand: async () => {
    if (count++ === 0) return { stdout: "re_TEST_ONLY" };
    throw new Error("re_TEST_ONLY sensitive provider data");
  } }), (error) => error.message === "ARCHIVE_RUN_FAILED");
});
