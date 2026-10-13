import { Resend } from "resend";
import { head, issueSignedToken, presignUrl } from "@vercel/blob";
import { createRfqReference } from "@/lib/rfq";
import { isValidRfqPayload } from "@/lib/rfq-validation";
import { type Locale } from "@/lib/i18n";
import { admitRfqSubmission, readRfqJson, RfqSecurityError, rfqSecurityConfigured, rfqSecurityResponse } from "@/lib/rfq-security";

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
      rfqSecurityConfigured() &&
      rfqSender()
    ),
  });
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
    payload = await readRfqJson(request);
  } catch (error) {
    if (error instanceof RfqSecurityError) return rfqSecurityResponse(error);
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  if (!isValidRfqPayload(payload)) {
    return Response.json({ error: "Please review the RFQ details and files." }, { status: 400 });
  }
  if (payload.website) return Response.json({ reference: createRfqReference() });

  let reference: string;
  try {
    reference = await admitRfqSubmission(request, payload.sessionToken, payload.email, payload.files);
    // Read trusted Blob metadata before signing caller-supplied attachment paths.
    for (const file of payload.files) {
      const stored = await head(file.pathname);
      if (stored.pathname !== file.pathname || stored.size !== file.size || stored.url !== file.url) {
        return Response.json({ error: "Please review the RFQ files." }, { status: 400 });
      }
    }
  } catch (error) {
    return rfqSecurityResponse(error);
  }
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
  }, { idempotencyKey: `rfq-internal/${reference}` });
  if (internalError) return Response.json({ error: "RFQ notification could not be delivered." }, { status: 502 });

  const customerCopy = CUSTOMER_ACK_COPY[payload.locale];
  await resend.emails.send({
    from: sender,
    to: payload.email,
    replyTo: "info@kazenco.com",
    subject: customerCopy.subject(reference),
    html: `<h2>${customerCopy.heading}</h2><p>${customerCopy.received(payload.projectName)}</p><p>${customerCopy.reference(reference)}</p><p>KAZENCO · info@kazenco.com</p>`,
  }, { idempotencyKey: `rfq-ack/${reference}` });

  return Response.json({ reference });
}
