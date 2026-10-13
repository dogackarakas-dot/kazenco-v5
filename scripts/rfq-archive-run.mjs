import { execFile } from "node:child_process";
import path from "node:path";
import { promisify } from "node:util";
import { fileURLToPath, pathToFileURL } from "node:url";

const execute = promisify(execFile);
export const KEYCHAIN_SERVICE = "com.kazenco.rfq-archive.resend";
export const KEYCHAIN_ACCOUNT = "rfq-archive";

export async function runArchive({ platform = process.platform, executeCommand = execute } = {}) {
  if (platform !== "darwin") throw new Error("MAC_REQUIRED");
  let key;
  try {
    const result = await executeCommand("/usr/bin/security", ["find-generic-password", "-s", KEYCHAIN_SERVICE,
      "-a", KEYCHAIN_ACCOUNT, "-w"], { timeout: 15000, maxBuffer: 4096 });
    key = result.stdout.trim();
  } catch { throw new Error("ARCHIVE_KEYCHAIN_ACCESS_REQUIRED"); }
  if (!/^re_[a-zA-Z0-9_-]+$/.test(key)) throw new Error("INVALID_ARCHIVE_CREDENTIAL");
  const script = fileURLToPath(new URL("./rfq-archive.mjs", import.meta.url));
  try {
    const result = await executeCommand(process.execPath, [script, "--resend"], {
      env: { ...process.env, RESEND_API_KEY: key }, timeout: 10 * 60 * 1000, maxBuffer: 16 * 1024 * 1024,
    });
    return JSON.parse(result.stdout);
  } catch {
    // execFile failures can include its environment/command; never print them.
    throw new Error("ARCHIVE_RUN_FAILED");
  } finally { key = undefined; }
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  runArchive().then((report) => process.stdout.write(JSON.stringify(report, null, 2) + "\n"))
    .catch((error) => { process.stderr.write(error.message + "\n"); process.exitCode = 1; });
}
