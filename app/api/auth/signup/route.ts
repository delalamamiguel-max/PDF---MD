import { NextResponse } from "next/server";
import { z } from "zod";
import { createUser } from "@/lib/repositories/users";
import { AppError, toMessage } from "@/lib/errors";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1).max(120).optional()
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const input = schema.parse(body);
    await createUser(input);
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    return NextResponse.json({ error: toMessage(error, "Unable to create account") }, { status: 400 });
  }
}
