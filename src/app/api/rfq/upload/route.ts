import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { authorizeRfqUpload, readRfqJson, RfqSecurityError, rfqSecurityResponse } from "@/lib/rfq-security";
import {
  RFQ_ALLOWED_CONTENT_TYPES,
  RFQ_ALLOWED_EXTENSIONS,
  RFQ_MAX_FILE_SIZE,
  fileExtension,
} from "@/lib/rfq";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return Response.json({ error: "Secure file upload is not configured." }, { status: 503 });
  }

  try {
    const body = (await readRfqJson(request)) as HandleUploadBody;
    const result = await handleUpload({
      request,
      body,
      onBeforeGenerateToken: async (pathname, clientPayload, multipart) => {
        if (multipart) throw new RfqSecurityError(400, "Multipart RFQ uploads are not supported.");
        if (!pathname.startsWith("rfq/")) throw new Error("Invalid upload path.");
        if (!RFQ_ALLOWED_EXTENSIONS.has(fileExtension(pathname))) throw new Error("Unsupported file type.");

        const plan = await authorizeRfqUpload(pathname, clientPayload);
        return {
          allowedContentTypes: RFQ_ALLOWED_CONTENT_TYPES,
          maximumSizeInBytes: Math.min(plan.size, RFQ_MAX_FILE_SIZE),
          addRandomSuffix: false,
          allowOverwrite: false,
          validUntil: Date.now() + 10 * 60 * 1000,
        };
      },
      onUploadCompleted: async () => undefined,
    });
    return Response.json(result);
  } catch (error) {
    if (error instanceof RfqSecurityError) return rfqSecurityResponse(error);
    const message = error instanceof Error ? error.message : "Upload authorization failed.";
    return Response.json({ error: message }, { status: 400 });
  }
}
