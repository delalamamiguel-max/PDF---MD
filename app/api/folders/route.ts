import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createFolderSchema } from "@/lib/validation";
import { createFolder, listFoldersForUser } from "@/lib/repositories/folders";

export async function GET() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const folders = await listFoldersForUser(userId);
  return NextResponse.json({ items: folders });
}

export async function POST(request: Request) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const input = createFolderSchema.parse(body);
  const folder = await createFolder({ userId, name: input.name, visibility: input.visibility });

  return NextResponse.json({ item: folder }, { status: 201 });
}
