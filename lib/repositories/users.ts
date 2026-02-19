import bcrypt from "bcryptjs";
import { sql } from "@/lib/db";
import { AppError } from "@/lib/errors";

export type DbUser = {
  id: string;
  email: string;
  name: string | null;
  password_hash: string;
  created_at: string;
};

export async function findUserByEmail(email: string): Promise<DbUser | null> {
  const rows = (await sql`SELECT id, email, name, password_hash, created_at FROM users WHERE email = ${email} LIMIT 1`) as DbUser[];
  return rows[0] ?? null;
}

export async function findUserById(id: string): Promise<DbUser | null> {
  const rows = (await sql`SELECT id, email, name, password_hash, created_at FROM users WHERE id = ${id} LIMIT 1`) as DbUser[];
  return rows[0] ?? null;
}

export async function createUser(input: { email: string; password: string; name?: string }) {
  const existing = await findUserByEmail(input.email);
  if (existing) {
    throw new AppError("An account with this email already exists.", "EMAIL_EXISTS", 409);
  }

  const passwordHash = await bcrypt.hash(input.password, 10);

  const rows = (await sql`
    INSERT INTO users (email, name, password_hash)
    VALUES (${input.email}, ${input.name ?? null}, ${passwordHash})
    RETURNING id, email, name, password_hash, created_at
  `) as DbUser[];

  return rows[0];
}

export async function verifyPassword(email: string, password: string) {
  const user = await findUserByEmail(email);
  if (!user) {
    return null;
  }

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    return null;
  }

  return user;
}
