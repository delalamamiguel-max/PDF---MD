import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { requireAdminRequest } from "@/lib/admin";
import { createInviteSchema } from "@/lib/validation";
import { createInviteToken, listInvites } from "@/lib/repositories/invites";
import { AppError } from "@/lib/errors";

export async function GET() {
  const admin = await requireAdminRequest();
  if (!admin.ok) {
    return NextResponse.json({ error: admin.error }, { status: admin.status });
  }

  const invites = await listInvites();
  return NextResponse.json({ items: invites });
}

export async function POST(request: Request) {
  try {
    const admin = await requireAdminRequest();
    if (!admin.ok) {
      return NextResponse.json({ error: admin.error }, { status: admin.status });
    }

    const body = await request.json();
    const invitedEmail = typeof body?.invitedEmail === "string" ? body.invitedEmail.trim().toLowerCase() : undefined;
    const input = createInviteSchema.parse({
      invitedEmail: invitedEmail || undefined,
      expiresInHours: body?.expiresInHours
    });

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
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
    }

    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    const message = error instanceof Error ? error.message : "Unable to generate invite";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
