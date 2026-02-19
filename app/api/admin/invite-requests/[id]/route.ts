import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminRequest } from "@/lib/admin";
import { updateInviteRequestStatus } from "@/lib/repositories/invites";

const schema = z.object({
  status: z.enum(["pending", "reviewed", "approved", "rejected"])
});

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdminRequest();
  if (!admin.ok) {
    return NextResponse.json({ error: admin.error }, { status: admin.status });
  }

  const body = await request.json();
  const input = schema.parse(body);
  const { id } = await params;

  const updated = await updateInviteRequestStatus({
    requestId: id,
    status: input.status,
    reviewedByUserId: admin.userId
  });

  if (!updated) {
    return NextResponse.json({ error: "Request not found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
