import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getDocumentById } from "@/lib/repositories/documents";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const doc = await getDocumentById(id, userId);

  if (!doc || !doc.blob_md_url) {
    return NextResponse.json({ error: "Markdown not available" }, { status: 404 });
  }

  const mdResponse = await fetch(doc.blob_md_url, {
    headers: {
      Authorization: `Bearer ${process.env.BLOB_READ_WRITE_TOKEN ?? ""}`
    }
  });

  if (!mdResponse.ok) {
    return NextResponse.json({ error: "Could not load markdown" }, { status: 502 });
  }

  const markdown = await mdResponse.text();
  return NextResponse.json({ markdown });
}
