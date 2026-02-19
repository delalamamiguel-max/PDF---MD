import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { ensureFolderAccessToken, getFolderForUser } from "@/lib/repositories/folders";

export async function POST(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const folder = await getFolderForUser({ folderId: id, userId });

  if (!folder) {
    return NextResponse.json({ error: "Folder not found" }, { status: 404 });
  }

  if (folder.visibility === "private") {
    return NextResponse.json({ error: "Folder must be public or unlisted to share." }, { status: 400 });
  }

  const token = await ensureFolderAccessToken(id, userId);
  const base = process.env.NEXTAUTH_URL ?? process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  return NextResponse.json({
    shareUrl: `${base}/shared/f/${token}`,
    ragUrl: `${base}/api/public/folders/${token}`
  });
}
