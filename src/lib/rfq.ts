export const RFQ_MAX_FILE_SIZE = 15 * 1024 * 1024;
export const RFQ_MAX_TOTAL_SIZE = 40 * 1024 * 1024;
export const RFQ_MAX_FILES = 8;

export const RFQ_ALLOWED_EXTENSIONS = new Set([
  "pdf",
  "dwg",
  "dxf",
  "xls",
  "xlsx",
  "csv",
  "doc",
  "docx",
]);

export const RFQ_ALLOWED_CONTENT_TYPES = [
  "application/pdf",
  "application/acad",
  "application/x-acad",
  "application/autocad_dwg",
  "application/dwg",
  "application/x-dwg",
  "image/vnd.dwg",
  "image/x-dwg",
  "application/dxf",
  "application/x-dxf",
  "image/vnd.dxf",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "text/csv",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/octet-stream",
];

export function fileExtension(filename: string) {
  return filename.split(".").pop()?.toLowerCase() ?? "";
}

export function safeFilename(filename: string) {
  const extension = fileExtension(filename);
  const basename = filename.slice(0, Math.max(0, filename.length - extension.length - 1));
  const safeBase = basename
    .normalize("NFKD")
    .replace(/[^a-zA-Z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "technical-file";
  return `${safeBase}.${extension}`;
}

export function createRfqReference() {
  const date = new Date().toISOString().slice(0, 10).replaceAll("-", "");
  const suffix = crypto.randomUUID().replaceAll("-", "").slice(0, 6).toUpperCase();
  return `KZ-RFQ-${date}-${suffix}`;
}
