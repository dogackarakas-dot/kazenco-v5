import { Resend } from "resend";
import { issueSignedToken, presignUrl } from "@vercel/blob";
import { createRfqReference, RFQ_MAX_FILES, RFQ_MAX_TOTAL_SIZE } from "@/lib/rfq";
import { isLocale, type Locale } from "@/lib/i18n";

export const runtime = "nodejs";

function rfqSender() {
  if (process.env.RFQ_FROM_EMAIL) return process.env.RFQ_FROM_EMAIL;
  if (process.env.RESEND_EMAIL_DOMAIN) {
    return `KAZENCO RFQ <rfq@${process.env.RESEND_EMAIL_DOMAIN}>`;
  }
  return "";
}

export function GET() {
  return Response.json({
    available: Boolean(
      process.env.BLOB_READ_WRITE_TOKEN &&
      process.env.RESEND_API_KEY &&
      rfqSender()
    ),
  });
}

interface SubmittedFile {
  name: string;
  url: string;
  pathname: string;
  size: number;
  kind: string;
}

interface RfqPayload {
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
  files: SubmittedFile[];
}

function isText(value: unknown, max: number) {
  return typeof value === "string" && value.trim().length > 0 && value.trim().length <= max;
}

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    '"': "&quot;",
  })[character] ?? character);
}

function isValidPayload(value: unknown): value is RfqPayload {
  if (!value || typeof value !== "object") return false;
  const data = value as Partial<RfqPayload>;
  return Boolean(
    isText(data.name, 120) &&
    isText(data.email, 254) &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email ?? "") &&
    isText(data.company, 160) &&
    isText(data.projectName, 200) &&
    isText(data.requestType, 120) &&
    isText(data.location, 160) &&
    isText(data.message, 5000) &&
    data.consent === true &&
    typeof data.locale === "string" &&
    isLocale(data.locale) &&
    Array.isArray(data.files) &&
    data.files.length <= RFQ_MAX_FILES &&
    data.files.every((file) =>
      isText(file.name, 180) &&
      isText(file.kind, 40) &&
      typeof file.size === "number" &&
      file.size > 0 &&
      /^https:\/\/[^\s]+\.blob\.vercel-storage\.com\//.test(file.url) &&
      isText(file.pathname, 300)
    ) &&
    data.files.reduce((sum, file) => sum + file.size, 0) <= RFQ_MAX_TOTAL_SIZE
  );
}

const CUSTOMER_ACK_COPY: Record<Locale, {
  subject: (reference: string) => string;
  heading: string;
  received: (projectName: string) => string;
  reference: (reference: string) => string;
}> = {
  en: {
    subject: (reference) => `KAZENCO received your request · ${reference}`,
    heading: "Thank you for contacting KAZENCO.",
    received: (projectName) => `We received your quotation request for <strong>${escapeHtml(projectName)}</strong>.`,
    reference: (reference) => `Your reference is <strong>${reference}</strong>. Please include it in future correspondence.`,
  },
  ru: {
    subject: (reference) => `KAZENCO получил ваш запрос · ${reference}`,
    heading: "Благодарим за обращение в KAZENCO.",
    received: (projectName) => `Мы получили ваш запрос коммерческого предложения по проекту <strong>${escapeHtml(projectName)}</strong>.`,
    reference: (reference) => `Номер вашего запроса: <strong>${reference}</strong>. Указывайте его в дальнейшей переписке.`,
  },
  tr: {
    subject: (reference) => `KAZENCO talebinizi aldı · ${reference}`,
    heading: "KAZENCO ile iletişime geçtiğiniz için teşekkür ederiz.",
    received: (projectName) => `<strong>${escapeHtml(projectName)}</strong> projesi için teklif talebinizi aldık.`,
    reference: (reference) => `Talep referansınız <strong>${reference}</strong>. Lütfen sonraki yazışmalarınızda bu referansı belirtin.`,
  },
  kz: {
    subject: (reference) => `KAZENCO сұрауыңызды қабылдады · ${reference}`,
    heading: "KAZENCO компаниясына хабарласқаныңыз үшін рақмет.",
    received: (projectName) => `<strong>${escapeHtml(projectName)}</strong> жобасы бойынша баға ұсынысына сұрауыңызды алдық.`,
    reference: (reference) => `Сұрау нөмірі: <strong>${reference}</strong>. Кейінгі хат алмасуда осы нөмірді көрсетіңіз.`,
  },
};

export async function POST(request: Request) {
  const sender = rfqSender();
  if (!process.env.RESEND_API_KEY || !sender) {
    return Response.json({ error: "RFQ delivery is not configured." }, { status: 503 });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  if (!isValidPayload(payload)) {
    return Response.json({ error: "Please review the RFQ details and files." }, { status: 400 });
  }
  if (payload.website) return Response.json({ reference: createRfqReference() });

  const reference = createRfqReference();
  const linkExpiry = Date.now() + 7 * 24 * 60 * 60 * 1000;
  const linkedFiles = await Promise.all(payload.files.map(async (file) => {
    const signedToken = await issueSignedToken({
      pathname: file.pathname,
      operations: ["get"],
      validUntil: linkExpiry,
    });
    const { presignedUrl } = await presignUrl(signedToken, {
      operation: "get",
      pathname: file.pathname,
      access: "private",
      validUntil: linkExpiry,
    });
    return { ...file, presignedUrl };
  }));
  const fileRows = linkedFiles.length
    ? linkedFiles.map((file) => `<li><a href="${escapeHtml(file.presignedUrl)}">${escapeHtml(file.name)}</a> (${Math.ceil(file.size / 1024)} KB) · link valid for 7 days</li>`).join("")
    : "<li>No files submitted</li>";
  const resend = new Resend(process.env.RESEND_API_KEY);

  const internalHtml = `
    <h2>New quotation request · ${reference}</h2>
    <p><strong>Project:</strong> ${escapeHtml(payload.projectName)}<br>
    <strong>Company:</strong> ${escapeHtml(payload.company)}<br>
    <strong>Contact:</strong> ${escapeHtml(payload.name)} · ${escapeHtml(payload.email)} · ${escapeHtml(payload.phone || "Not specified")}<br>
    <strong>Service:</strong> ${escapeHtml(payload.requestType)}<br>
    <strong>Location:</strong> ${escapeHtml(payload.location)}<br>
    <strong>Required by:</strong> ${escapeHtml(payload.requiredBy || "Not specified")}</p>
    <h3>Requirement</h3><p>${escapeHtml(payload.message).replaceAll("\n", "<br>")}</p>
    <h3>Specifications</h3><p>${escapeHtml(payload.specification || "Not specified").replaceAll("\n", "<br>")}</p>
    <h3>Technical files</h3><ul>${fileRows}</ul>`;

  const { error: internalError } = await resend.emails.send({
    from: sender,
    to: "info@kazenco.com",
    replyTo: payload.email,
    subject: `${reference} · ${payload.company} · ${payload.projectName}`,
    html: internalHtml,
  });
  if (internalError) return Response.json({ error: "RFQ notification could not be delivered." }, { status: 502 });

  const customerCopy = CUSTOMER_ACK_COPY[payload.locale];
  await resend.emails.send({
    from: sender,
    to: payload.email,
    replyTo: "info@kazenco.com",
    subject: customerCopy.subject(reference),
    html: `<h2>${customerCopy.heading}</h2><p>${customerCopy.received(payload.projectName)}</p><p>${customerCopy.reference(reference)}</p><p>KAZENCO · info@kazenco.com</p>`,
  });

  return Response.json({ reference });
}
