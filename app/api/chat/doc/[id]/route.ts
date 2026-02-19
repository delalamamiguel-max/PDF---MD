import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({
    message: "Doc-scoped chat is scaffolded for V1.",
    citations: []
  });
}
