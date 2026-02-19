import { NextResponse } from "next/server";
import { requireAdminRequest } from "@/lib/admin";
import { listInviteRequests } from "@/lib/repositories/invites";

export async function GET() {
  const admin = await requireAdminRequest();
  if (!admin.ok) {
    return NextResponse.json({ error: admin.error }, { status: admin.status });
  }

  const requests = await listInviteRequests();
  return NextResponse.json({ items: requests });
}
