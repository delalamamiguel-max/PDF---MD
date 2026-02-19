import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { isProtectedPath } from "@/lib/authz";

export default auth((req) => {
  const isProtected = isProtectedPath(req.nextUrl.pathname);

  if (isProtected && !req.auth) {
    if (req.nextUrl.pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/upload/:path*",
    "/docs/:path*",
    "/search/:path*",
    "/settings/:path*",
    "/admin/:path*",
    "/api/upload/:path*",
    "/api/ingest/:path*",
    "/api/documents/:path*",
    "/api/folders/:path*",
    "/api/admin/:path*"
  ]
};
