import { NextResponse } from "next/server";
import { requireAdminRequest } from "@/lib/admin";
import { revokeInvite } from "@/lib/repositories/invites";

export async function POST(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdminRequest();
  if (!admin.ok) {
    return NextResponse.json({ error: admin.error }, { status: admin.status });
  }

  const { id } = await params;
  const revoked = await revokeInvite(id, admin.userId);

  if (!revoked) {
    return NextResponse.json({ error: "Invite not revocable" }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
