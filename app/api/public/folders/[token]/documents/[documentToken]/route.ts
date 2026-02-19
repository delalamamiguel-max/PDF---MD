import { NextResponse } from "next/server";
import { corsHeaders, getRequestIp } from "@/lib/public-access";
import { checkRateLimit } from "@/lib/rate-limit";
import { hashIp } from "@/lib/security";
import { getFolderByAccessToken } from "@/lib/repositories/folders";
import { getPublicFolderDocument } from "@/lib/repositories/documents";
import { logPublicAccess } from "@/lib/repositories/public-access";

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders()
  });
}

export async function GET(request: Request, { params }: { params: Promise<{ token: string; documentToken: string }> }) {
  const { token, documentToken } = await params;
  const ip = getRequestIp(request);
  const headers = corsHeaders();
  const limiter = checkRateLimit(`public-doc:${token}:${documentToken}:${ip}`, 120, 60_000);

  if (!limiter.ok) {
    await logPublicAccess({
      folderAccessToken: token,
      documentPublicToken: documentToken,
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
      documentPublicToken: documentToken,
      path: new URL(request.url).pathname,
      ipHash: hashIp(ip),
      userAgent: request.headers.get("user-agent"),
      statusCode: 404
    });
    return NextResponse.json({ error: "Document not found" }, { status: 404, headers });
  }

  const doc = await getPublicFolderDocument({ folderId: folder.id, documentPublicToken: documentToken });
  if (!doc) {
    await logPublicAccess({
      folderAccessToken: token,
      documentPublicToken: documentToken,
      path: new URL(request.url).pathname,
      ipHash: hashIp(ip),
      userAgent: request.headers.get("user-agent"),
      statusCode: 404
    });
    return NextResponse.json({ error: "Document not found" }, { status: 404, headers });
  }

  await logPublicAccess({
    folderAccessToken: token,
    documentPublicToken: documentToken,
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
      document: {
        document_token: doc.public_token,
        title: doc.title,
        uploaded_at: doc.created_at,
        status: doc.status,
        summary: doc.summary,
        topics: doc.topics,
        tags: doc.tags,
        file_url: doc.blob_pdf_url,
        markdown_url: doc.blob_md_url
      }
    },
    { headers }
  );
}
