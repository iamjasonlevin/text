import { getPublicMessages } from "@/lib/messages";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const messages = await getPublicMessages();
  return Response.json({ messages });
}
