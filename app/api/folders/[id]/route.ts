import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { deleteFolder, getFolderForUser, renameFolder, setFolderVisibility } from "@/lib/repositories/folders";
import { updateFolderSchema } from "@/lib/validation";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const input = updateFolderSchema.parse(body);

  if (input.name) {
    const renamed = await renameFolder({ folderId: id, userId, name: input.name });
    if (!renamed) {
      return NextResponse.json({ error: "Folder not found" }, { status: 404 });
    }
  }

  if (input.visibility) {
    const updated = await setFolderVisibility({ folderId: id, userId, visibility: input.visibility });
    if (!updated) {
      return NextResponse.json({ error: "Folder not found" }, { status: 404 });
    }
  }

  const folder = await getFolderForUser({ folderId: id, userId });
  return NextResponse.json({ item: folder });
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const deleted = await deleteFolder({ folderId: id, userId });
  if (!deleted) {
    return NextResponse.json({ error: "Folder not empty or not found" }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
