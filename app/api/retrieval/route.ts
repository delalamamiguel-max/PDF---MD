import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { retrieveCitations } from "@/lib/repositories/chunks";

const schema = z.object({
  query: z.string().min(2),
  documentId: z.string().uuid().optional(),
  limit: z.number().int().min(1).max(20).optional()
});

export async function POST(request: Request) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const input = schema.parse(body);
  const citations = await retrieveCitations({ userId, query: input.query, documentId: input.documentId, limit: input.limit });

  return NextResponse.json({ citations });
}
