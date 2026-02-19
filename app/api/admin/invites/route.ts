import { NextResponse } from "next/server";
import { requireAdminRequest } from "@/lib/admin";
import { createInviteSchema } from "@/lib/validation";
import { createInviteToken, listInvites } from "@/lib/repositories/invites";

export async function GET() {
  const admin = await requireAdminRequest();
  if (!admin.ok) {
    return NextResponse.json({ error: admin.error }, { status: admin.status });
  }

  const invites = await listInvites();
  return NextResponse.json({ items: invites });
}

export async function POST(request: Request) {
  const admin = await requireAdminRequest();
  if (!admin.ok) {
    return NextResponse.json({ error: admin.error }, { status: admin.status });
  }

  const body = await request.json();
  const input = createInviteSchema.parse(body);
  const created = await createInviteToken({
    invitedEmail: input.invitedEmail,
    expiresInHours: input.expiresInHours,
    createdByUserId: admin.userId
  });

  const base = process.env.NEXTAUTH_URL ?? process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const inviteLink = `${base}/invite/${created.rawToken}`;

  return NextResponse.json({
    item: created.invite,
    inviteLink
  });
}
