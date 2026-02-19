import { NextResponse } from "next/server";
import { corsHeaders, getRequestIp } from "@/lib/public-access";
import { checkRateLimit } from "@/lib/rate-limit";
import { hashIp } from "@/lib/security";
import { getFolderByAccessToken } from "@/lib/repositories/folders";
import { listPublicFolderDocuments } from "@/lib/repositories/documents";
import { logPublicAccess } from "@/lib/repositories/public-access";

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders()
  });
}

export async function GET(request: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const ip = getRequestIp(request);
  const limiter = checkRateLimit(`public-folder:${token}:${ip}`, 120, 60_000);
  const headers = corsHeaders();

  if (!limiter.ok) {
    await logPublicAccess({
      folderAccessToken: token,
      path: new URL(request.url).pathname,
      ipHash: hashIp(ip),
      userAgent: request.headers.get("user-agent"),
      statusCode: 429
    });

    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429, headers });
  }

  const folder = await getFolderByAccessToken(token);
  if (!folder || folder.visibility === "private") {
    await logPublicAccess({
      folderAccessToken: token,
      path: new URL(request.url).pathname,
      ipHash: hashIp(ip),
      userAgent: request.headers.get("user-agent"),
      statusCode: 404
    });

    return NextResponse.json({ error: "Folder not found" }, { status: 404, headers });
  }

  const docs = await listPublicFolderDocuments(folder.id);

  await logPublicAccess({
    folderAccessToken: token,
    path: new URL(request.url).pathname,
    ipHash: hashIp(ip),
    userAgent: request.headers.get("user-agent"),
    statusCode: 200
  });

  return NextResponse.json(
    {
      folder: {
        name: folder.name,
        visibility: folder.visibility,
        access_token: token
      },
      documents: docs.map((doc) => ({
        document_token: doc.public_token,
        title: doc.title,
        uploaded_at: doc.created_at,
        status: doc.status,
        summary: doc.summary,
        topics: doc.topics,
        tags: doc.tags,
        file_url: doc.blob_pdf_url,
        markdown_url: doc.blob_md_url
      }))
    },
    { headers }
  );
}
