import { isLocale, type Locale } from "@/lib/i18n";
import { RFQ_MAX_FILES, RFQ_MAX_FILE_SIZE, RFQ_MAX_TOTAL_SIZE } from "@/lib/rfq";

export interface SubmittedRfqFile {
  name: string;
  url: string;
  pathname: string;
  size: number;
  kind: string;
}

export interface RfqPayload {
  sessionToken?: string;
  name: string;
  email: string;
  company: string;
  phone?: string;
  projectName: string;
  requestType: string;
  location: string;
  requiredBy?: string;
  message: string;
  specification?: string;
  consent: boolean;
  website?: string;
  locale: Locale;
  files: SubmittedRfqFile[];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isText(value: unknown, max: number) {
  return typeof value === "string" && value.trim().length > 0 && value.length <= max;
}

function isOptionalText(value: unknown, max: number) {
  return value === undefined || (typeof value === "string" && value.length <= max);
}

function isFile(value: unknown): value is SubmittedRfqFile {
  if (!isRecord(value)) return false;
  return isText(value.name, 180) && isText(value.kind, 40) &&
    typeof value.size === "number" && Number.isSafeInteger(value.size) &&
    value.size > 0 && value.size <= RFQ_MAX_FILE_SIZE &&
    typeof value.url === "string" && value.url.length <= 2048 &&
    /^https:\/\/[a-z0-9-]+(?:\.private)?\.blob\.vercel-storage\.com\//i.test(value.url) &&
    isText(value.pathname, 300);
}

export function isValidRfqPayload(value: unknown): value is RfqPayload {
  if (!isRecord(value)) return false;
  return isText(value.name, 120) && isText(value.email, 254) &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.email as string) &&
    isText(value.company, 160) && isText(value.projectName, 200) &&
    isText(value.requestType, 120) && isText(value.location, 160) &&
    isText(value.message, 5000) && isOptionalText(value.phone, 80) &&
    isOptionalText(value.requiredBy, 80) && isOptionalText(value.specification, 5000) &&
    isOptionalText(value.website, 200) && value.consent === true &&
    isOptionalText(value.sessionToken, 64) &&
    typeof value.locale === "string" && isLocale(value.locale) &&
    Array.isArray(value.files) && value.files.length <= RFQ_MAX_FILES &&
    value.files.every(isFile) &&
    value.files.reduce((sum, file) => sum + file.size, 0) <= RFQ_MAX_TOTAL_SIZE;
}
