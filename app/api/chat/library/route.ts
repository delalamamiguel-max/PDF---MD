import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({
    message: "Global Ask your library chat is scaffolded for V1.",
    citations: []
  });
}
