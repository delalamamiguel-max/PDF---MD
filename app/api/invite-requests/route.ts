import { NextResponse } from "next/server";
import { inviteRequestSchema } from "@/lib/validation";
import { createInviteRequest } from "@/lib/repositories/invites";
import { checkRateLimit } from "@/lib/rate-limit";
import { getRequestIp } from "@/lib/public-access";

export async function POST(request: Request) {
  const ip = getRequestIp(request);
  const limit = checkRateLimit(`invite-request:${ip}`, 8, 60_000);
  if (!limit.ok) {
    return NextResponse.json({ error: "Too many requests. Please wait and try again." }, { status: 429 });
  }

  const body = await request.json();
  const input = inviteRequestSchema.parse(body);

  await createInviteRequest({
    fullName: input.fullName,
    email: input.email,
    heardAbout: input.heardAbout
  });

  return NextResponse.json({ ok: true }, { status: 201 });
}
