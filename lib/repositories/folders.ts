import { sql } from "@/lib/db";
import { AppError } from "@/lib/errors";
import { generateOpaqueToken } from "@/lib/security";

export type FolderVisibility = "private" | "unlisted" | "public";

export type FolderRecord = {
  id: string;
  user_id: string;
  name: string;
  visibility: FolderVisibility;
  access_token: string | null;
  created_at: string;
  updated_at: string;
};

export async function listFoldersForUser(userId: string) {
  const rows = (await sql`
    SELECT f.id,
           f.user_id,
           f.name,
           p.visibility,
           t.access_token,
           f.created_at,
           f.updated_at
    FROM folders f
    JOIN folder_permissions p ON p.folder_id = f.id
    LEFT JOIN folder_public_access_tokens t ON t.folder_id = f.id AND t.revoked_at IS NULL
    WHERE f.user_id = ${userId}
    ORDER BY f.created_at DESC
  `) as FolderRecord[];

  return rows;
}

export async function createFolder(input: { userId: string; name: string; visibility?: FolderVisibility }) {
  const rows = (await sql`
    WITH created AS (
      INSERT INTO folders (user_id, name)
      VALUES (${input.userId}, ${input.name.trim()})
      RETURNING id, user_id, name, created_at, updated_at
    ), perms AS (
      INSERT INTO folder_permissions (folder_id, visibility)
      SELECT id, ${input.visibility ?? "private"}::folder_visibility FROM created
      RETURNING folder_id, visibility
    )
    SELECT c.id, c.user_id, c.name, p.visibility, NULL::text AS access_token, c.created_at, c.updated_at
    FROM created c
    JOIN perms p ON p.folder_id = c.id
  `) as FolderRecord[];

  const folder = rows[0];
  if (!folder) {
    throw new AppError("Unable to create folder", "FOLDER_CREATE_FAILED", 500);
  }

  if (folder.visibility !== "private") {
    await ensureFolderAccessToken(folder.id, input.userId);
  }

  return folder;
}

export async function renameFolder(input: { folderId: string; userId: string; name: string }) {
  const rows = (await sql`
    UPDATE folders
    SET name = ${input.name.trim()}, updated_at = now()
    WHERE id = ${input.folderId} AND user_id = ${input.userId}
    RETURNING id
  `) as { id: string }[];

  return rows[0] ?? null;
}

export async function deleteFolder(input: { folderId: string; userId: string }) {
  const rows = (await sql`
    DELETE FROM folders
    WHERE id = ${input.folderId}
      AND user_id = ${input.userId}
      AND NOT EXISTS (
        SELECT 1 FROM document_folders df WHERE df.folder_id = ${input.folderId}
      )
    RETURNING id
  `) as { id: string }[];

  return rows[0] ?? null;
}

export async function setFolderVisibility(input: { folderId: string; userId: string; visibility: FolderVisibility }) {
  const rows = (await sql`
    UPDATE folder_permissions p
    SET visibility = ${input.visibility}::folder_visibility,
        updated_at = now()
    FROM folders f
    WHERE p.folder_id = f.id
      AND f.id = ${input.folderId}
      AND f.user_id = ${input.userId}
    RETURNING p.folder_id
  `) as { folder_id: string }[];

  if (!rows[0]) {
    return null;
  }

  if (input.visibility === "private") {
    await sql`
      UPDATE folder_public_access_tokens
      SET revoked_at = now()
      WHERE folder_id = ${input.folderId} AND revoked_at IS NULL
    `;
  } else {
    await ensureFolderAccessToken(input.folderId, input.userId);
  }

  return rows[0];
}

export async function ensureFolderAccessToken(folderId: string, userId: string) {
  const rows = (await sql`
    SELECT t.access_token
    FROM folder_public_access_tokens t
    JOIN folders f ON f.id = t.folder_id
    WHERE t.folder_id = ${folderId}
      AND t.revoked_at IS NULL
      AND f.user_id = ${userId}
    LIMIT 1
  `) as Array<{ access_token: string }>;

  if (rows[0]) {
    return rows[0].access_token;
  }

  const token = generateOpaqueToken(24);
  const inserted = (await sql`
    INSERT INTO folder_public_access_tokens (folder_id, access_token)
    SELECT f.id, ${token}
    FROM folders f
    WHERE f.id = ${folderId} AND f.user_id = ${userId}
    ON CONFLICT (folder_id)
    DO UPDATE SET access_token = EXCLUDED.access_token, revoked_at = NULL
    RETURNING access_token
  `) as Array<{ access_token: string }>;

  if (!inserted[0]) {
    throw new AppError("Unable to generate folder link", "FOLDER_TOKEN_FAILED", 400);
  }

  return inserted[0].access_token;
}

export async function getFolderForUser(input: { folderId: string; userId: string }) {
  const rows = (await sql`
    SELECT f.id,
           f.user_id,
           f.name,
           p.visibility,
           t.access_token,
           f.created_at,
           f.updated_at
    FROM folders f
    JOIN folder_permissions p ON p.folder_id = f.id
    LEFT JOIN folder_public_access_tokens t ON t.folder_id = f.id AND t.revoked_at IS NULL
    WHERE f.id = ${input.folderId} AND f.user_id = ${input.userId}
    LIMIT 1
  `) as FolderRecord[];

  return rows[0] ?? null;
}

export async function getFolderByAccessToken(token: string) {
  const rows = (await sql`
    SELECT f.id,
           f.user_id,
           f.name,
           p.visibility,
           t.access_token,
           f.created_at,
           f.updated_at
    FROM folder_public_access_tokens t
    JOIN folders f ON f.id = t.folder_id
    JOIN folder_permissions p ON p.folder_id = f.id
    WHERE t.access_token = ${token} AND t.revoked_at IS NULL
    LIMIT 1
  `) as FolderRecord[];

  return rows[0] ?? null;
}
