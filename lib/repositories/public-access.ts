import { sql } from "@/lib/db";

export async function logPublicAccess(input: {
  folderAccessToken?: string | null;
  documentPublicToken?: string | null;
  path: string;
  ipHash?: string | null;
  userAgent?: string | null;
  statusCode: number;
}) {
  await sql`
    INSERT INTO public_endpoint_access_logs (folder_access_token, document_public_token, path, ip_hash, user_agent, status_code)
    VALUES (
      ${input.folderAccessToken ?? null},
      ${input.documentPublicToken ?? null},
      ${input.path},
      ${input.ipHash ?? null},
      ${input.userAgent ?? null},
      ${input.statusCode}
    )
  `;
}
