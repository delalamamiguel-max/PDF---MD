import bcrypt from "bcryptjs";
import { sql } from "@/lib/db";
import { AppError } from "@/lib/errors";
import { isInviteConsumable } from "@/lib/invite-token";
import { generateOpaqueToken, hashToken } from "@/lib/security";

export type InviteRecord = {
  id: string;
  invited_email: string | null;
  expires_at: string;
  used_at: string | null;
  revoked_at: string | null;
  created_at: string;
  created_by_user_id: string | null;
  used_by_email: string | null;
};

export type InviteRequestRecord = {
  id: string;
  full_name: string;
  email: string;
  heard_about: string | null;
  status: string;
  reviewed_at: string | null;
  created_at: string;
};

export async function createInviteToken(input: {
  invitedEmail?: string;
  expiresInHours?: number;
  createdByUserId: string;
}) {
  const rawToken = generateOpaqueToken(32);
  const tokenHash = hashToken(rawToken);
  const expiresInHours = input.expiresInHours ?? 72;

  const rows = (await sql`
    INSERT INTO invite_tokens (token_hash, invited_email, expires_at, created_by_user_id)
    VALUES (
      ${tokenHash},
      ${input.invitedEmail?.trim().toLowerCase() || null},
      now() + (${expiresInHours}::int * interval '1 hour'),
      ${input.createdByUserId}
    )
    RETURNING id, invited_email, expires_at, used_at, revoked_at, created_at, created_by_user_id, used_by_email
  `) as InviteRecord[];

  const invite = rows[0];

  await sql`
    INSERT INTO invite_events (invite_token_id, actor_user_id, event_type, details)
    VALUES (${invite.id}, ${input.createdByUserId}, 'generated', jsonb_build_object('invited_email', ${invite.invited_email}))
  `;

  return { invite, rawToken };
}

export async function listInvites() {
  const rows = (await sql`
    SELECT id, invited_email, expires_at, used_at, revoked_at, created_at, created_by_user_id, used_by_email
    FROM invite_tokens
    ORDER BY created_at DESC
  `) as InviteRecord[];

  return rows;
}

export async function revokeInvite(inviteId: string, actorUserId: string) {
  const rows = (await sql`
    UPDATE invite_tokens
    SET revoked_at = now()
    WHERE id = ${inviteId} AND used_at IS NULL AND revoked_at IS NULL
    RETURNING id
  `) as { id: string }[];

  const revoked = rows[0];
  if (!revoked) {
    return null;
  }

  await sql`
    INSERT INTO invite_events (invite_token_id, actor_user_id, event_type, details)
    VALUES (${inviteId}, ${actorUserId}, 'revoked', '{}'::jsonb)
  `;

  return revoked;
}

export async function createInviteRequest(input: {
  fullName: string;
  email: string;
  heardAbout?: string;
}) {
  const rows = (await sql`
    INSERT INTO invite_requests (full_name, email, heard_about)
    VALUES (${input.fullName.trim()}, ${input.email.trim().toLowerCase()}, ${input.heardAbout?.trim() || null})
    RETURNING id, full_name, email, heard_about, status, reviewed_at, created_at
  `) as InviteRequestRecord[];

  return rows[0];
}

export async function listInviteRequests() {
  const rows = (await sql`
    SELECT id, full_name, email, heard_about, status, reviewed_at, created_at
    FROM invite_requests
    ORDER BY created_at DESC
  `) as InviteRequestRecord[];

  return rows;
}

export async function updateInviteRequestStatus(input: {
  requestId: string;
  status: "pending" | "reviewed" | "approved" | "rejected";
  reviewedByUserId: string;
}) {
  const rows = (await sql`
    UPDATE invite_requests
    SET status = ${input.status},
        reviewed_at = now(),
        reviewed_by_user_id = ${input.reviewedByUserId}
    WHERE id = ${input.requestId}
    RETURNING id
  `) as { id: string }[];

  return rows[0] ?? null;
}

export async function createUserFromInvite(input: {
  token: string;
  email: string;
  name: string;
  password: string;
}) {
  const tokenHash = hashToken(input.token);
  const normalizedEmail = input.email.trim().toLowerCase();
  const passwordHash = await bcrypt.hash(input.password, 10);

  const result = (await sql`
    WITH consume AS (
      UPDATE invite_tokens
      SET used_at = now(),
          used_by_email = ${normalizedEmail}
      WHERE token_hash = ${tokenHash}
        AND used_at IS NULL
        AND revoked_at IS NULL
        AND expires_at > now()
        AND (invited_email IS NULL OR invited_email = ${normalizedEmail})
        AND NOT EXISTS (
          SELECT 1 FROM users u WHERE lower(u.email) = ${normalizedEmail}
        )
      RETURNING id
    ), inserted AS (
      INSERT INTO users (email, name, password_hash)
      SELECT ${normalizedEmail}, ${input.name.trim()}, ${passwordHash}
      FROM consume
      RETURNING id, email, name, password_hash, created_at
    ), mark_used AS (
      UPDATE invite_tokens t
      SET used_by_user_id = i.id
      FROM inserted i
      WHERE t.token_hash = ${tokenHash}
      RETURNING t.id
    )
    SELECT i.id, i.email, i.name, i.password_hash, i.created_at
    FROM inserted i
  `) as Array<{ id: string; email: string; name: string | null; password_hash: string; created_at: string }>;

  if (!result[0]) {
    throw new AppError("This invite is invalid, expired, already used, or does not match this email.", "INVITE_INVALID", 400);
  }

  const inviteRows = (await sql`SELECT id FROM invite_tokens WHERE token_hash = ${tokenHash} LIMIT 1`) as Array<{ id: string }>;
  if (inviteRows[0]) {
    await sql`
      INSERT INTO invite_events (invite_token_id, actor_user_id, event_type, details)
      VALUES (${inviteRows[0].id}, ${result[0].id}, 'used', jsonb_build_object('email', ${normalizedEmail}))
    `;
  }

  return result[0];
}

export async function validateInviteToken(token: string) {
  const tokenHash = hashToken(token);
  const rows = (await sql`
    SELECT id, invited_email, expires_at, used_at, revoked_at
    FROM invite_tokens
    WHERE token_hash = ${tokenHash}
    LIMIT 1
  `) as Array<{
    id: string;
    invited_email: string | null;
    expires_at: string;
    used_at: string | null;
    revoked_at: string | null;
  }>;

  const record = rows[0];
  if (!record) {
    return { valid: false as const, reason: "invalid" };
  }

  const valid = isInviteConsumable({
    invitedEmail: record.invited_email,
    emailAttempt: record.invited_email ?? "open",
    expiresAt: record.expires_at,
    usedAt: record.used_at,
    revokedAt: record.revoked_at
  });
  if (!valid) {
    if (record.revoked_at) return { valid: false as const, reason: "revoked" };
    if (record.used_at) return { valid: false as const, reason: "used" };
    return { valid: false as const, reason: "expired" };
  }

  return { valid: true as const, invitedEmail: record.invited_email };
}
