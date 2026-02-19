import { NextResponse } from "next/server";
import { signupWithInviteSchema } from "@/lib/validation";
import { AppError, toMessage } from "@/lib/errors";
import { createUserFromInvite } from "@/lib/repositories/invites";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const input = signupWithInviteSchema.parse(body);
    await createUserFromInvite({
      token: input.token,
      email: input.email,
      name: input.name,
      password: input.password
    });

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    return NextResponse.json({ error: toMessage(error, "Unable to create account") }, { status: 400 });
  }
}
