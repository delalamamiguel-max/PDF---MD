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
    return NextResponse.json({ error: "Could not download markdown" }, { status: 502 });
  }

  const markdown = await mdResponse.text();
  const safe = doc.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "document";

  return new NextResponse(markdown, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Content-Disposition": `attachment; filename="${safe}.md"`
    }
  });
}
