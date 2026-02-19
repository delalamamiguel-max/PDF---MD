import { NextResponse } from "next/server";
import { validateInviteToken } from "@/lib/repositories/invites";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token") ?? "";

  if (!token) {
    return NextResponse.json({ valid: false, reason: "missing" }, { status: 400 });
  }

  const result = await validateInviteToken(token);
  return NextResponse.json(result);
}
