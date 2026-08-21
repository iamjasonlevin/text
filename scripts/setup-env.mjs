import { execFileSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import path from "node:path";

function run(command: string, args: string[]): string {
  return execFileSync(command, args, { encoding: "utf8" });
}

function pick(text: string, patterns: RegExp[]): string {
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match?.[1]) return match[1].trim();
  }
  return "";
}

try {
  run("sendblue", ["whoami"]);
} catch {
  console.error(
    "Sendblue CLI is not logged in.\n\nRun:\n  sendblue login\n\nEmail: jasonmichaellevin@gmail.com\nThen run this script again.",
  );
  process.exit(1);
}

const keys = run("sendblue", ["show-keys"]);
const lines = run("sendblue", ["lines"]);

let parsed: Record<string, string> = {};
try {
  parsed = JSON.parse(keys) as Record<string, string>;
} catch {
  parsed = {};
}

const apiKey =
  parsed.apiKey ||
  parsed.api_key ||
  parsed.key ||
  pick(keys, [
    /apiKey["']?\s*[:=]\s*["']?([^\s"',]+)/i,
    /API Key["']?\s*[:=]\s*["']?([^\s"',]+)/i,
    /sb-api-key-id["']?\s*[:=]\s*["']?([^\s"',]+)/i,
  ]);

const apiSecret =
  parsed.apiSecret ||
  parsed.api_secret ||
  parsed.secret ||
  pick(keys, [
    /apiSecret["']?\s*[:=]\s*["']?([^\s"',]+)/i,
    /API Secret["']?\s*[:=]\s*["']?([^\s"',]+)/i,
    /sb-api-secret-key["']?\s*[:=]\s*["']?([^\s"',]+)/i,
  ]);

const number =
  parsed.assignedNumber ||
  parsed.number ||
  pick(lines, [/(\+1\d{10})/, /(\+\d{8,15})/]);

const envPath = path.join(process.cwd(), ".env.local");
const body = [
  `SENDBLUE_API_KEY=${apiKey}`,
  `SENDBLUE_API_SECRET=${apiSecret}`,
  `SENDBLUE_NUMBER=${number}`,
  `SENDBLUE_WEBHOOK_SECRET=`,
  `ALLOWED_FROM_NUMBERS=`,
  `NEXT_PUBLIC_CONTACT_NAME=Notes`,
  "",
].join("\n");

writeFileSync(envPath, body);

console.log(`Wrote ${envPath}`);
if (!apiKey || !apiSecret) {
  console.log("Could not parse keys automatically. Output from `sendblue show-keys`:\n");
  console.log(keys);
}
if (!number) {
  console.log("Could not parse phone number. Output from `sendblue lines`:\n");
  console.log(lines);
}
console.log("\nNext:");
console.log("1. Set ALLOWED_FROM_NUMBERS in .env.local to your iPhone number (E.164).");
console.log("2. sendblue add-contact +1YOURNUMBER");
console.log("3. npm run dev");
console.log("4. After you have a public HTTPS URL, run:");
console.log("   sendblue webhooks add https://YOUR-DOMAIN/api/webhook --type receive");
