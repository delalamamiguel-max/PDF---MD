import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getDocumentById } from "@/lib/repositories/documents";
import { sql } from "@/lib/db";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const doc = await getDocumentById(id, userId);

  if (!doc) {
    return NextResponse.json({ error: "Document not found" }, { status: 404 });
  }

  const stageRows = (await sql`
    SELECT stage
    FROM document_status_events
    WHERE document_id = ${id}
    ORDER BY created_at DESC
    LIMIT 1
  `) as { stage: string }[];

  return NextResponse.json({
    ...doc,
    current_stage: (stageRows[0]?.stage ?? "upload") as string
  });
}
