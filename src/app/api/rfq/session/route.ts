import { createRfqSession, readRfqJson, rfqSecurityResponse } from "@/lib/rfq-security";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await readRfqJson(request) as { files?: unknown };
    if (!body || typeof body !== "object") return Response.json({ error: "Invalid request." }, { status: 400 });
    const session = await createRfqSession(request, body.files);
    return Response.json(session, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    if (error instanceof SyntaxError) return Response.json({ error: "Invalid request." }, { status: 400 });
    return rfqSecurityResponse(error);
  }
}
