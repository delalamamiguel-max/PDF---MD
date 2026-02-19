import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { listDocumentsSchema } from "@/lib/validation";
import { listDocuments } from "@/lib/repositories/documents";

export async function GET(request: Request) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const parsed = listDocumentsSchema.parse({
    status: searchParams.get("status") ?? undefined,
    q: searchParams.get("q") ?? undefined,
    tag: searchParams.get("tag") ?? undefined,
    folderId: searchParams.get("folderId") ?? undefined,
    from: searchParams.get("from") ?? undefined,
    to: searchParams.get("to") ?? undefined
  });

  const docs = await listDocuments({ userId, ...parsed });

  return NextResponse.json({ items: docs });
}
