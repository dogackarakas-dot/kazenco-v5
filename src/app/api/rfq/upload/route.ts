import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
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
    const body = (await request.json()) as HandleUploadBody;
    const result = await handleUpload({
      request,
      body,
      onBeforeGenerateToken: async (pathname) => {
        if (!pathname.startsWith("rfq/")) throw new Error("Invalid upload path.");
        if (!RFQ_ALLOWED_EXTENSIONS.has(fileExtension(pathname))) throw new Error("Unsupported file type.");

        return {
          allowedContentTypes: RFQ_ALLOWED_CONTENT_TYPES,
          maximumSizeInBytes: RFQ_MAX_FILE_SIZE,
          addRandomSuffix: true,
          validUntil: Date.now() + 10 * 60 * 1000,
        };
      },
      onUploadCompleted: async () => undefined,
    });
    return Response.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload authorization failed.";
    return Response.json({ error: message }, { status: 400 });
  }
}
