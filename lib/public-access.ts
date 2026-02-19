import type { FolderVisibility } from "@/lib/repositories/folders";

export function canAccessFolder(input: {
  visibility: FolderVisibility;
  ownerId: string;
  viewerUserId?: string | null;
  hasAccessToken: boolean;
}) {
  if (input.viewerUserId && input.viewerUserId === input.ownerId) {
    return true;
  }

  if (input.visibility === "private") {
    return false;
  }

  return input.hasAccessToken;
}

export function corsHeaders(origin = "*") {
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    Vary: "Origin"
  };
}

export function getRequestIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() ?? "unknown";
  }
  return request.headers.get("x-real-ip") ?? "unknown";
}
