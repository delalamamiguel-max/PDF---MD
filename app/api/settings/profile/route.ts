import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { updateUserName } from "@/lib/repositories/users";

const schema = z.object({
  name: z.string().trim().min(1).max(120)
});

export async function PATCH(request: Request) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const input = schema.parse(body);

  const updated = await updateUserName({ userId, name: input.name });
  if (!updated) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({
    item: {
      id: updated.id,
      name: updated.name,
      email: updated.email
    }
  });
}
