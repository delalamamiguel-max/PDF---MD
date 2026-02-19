const protectedPaths = ["/dashboard", "/upload", "/docs", "/search", "/settings", "/api/upload", "/api/ingest", "/api/documents"];

export function isProtectedPath(pathname: string) {
  return protectedPaths.some((path) => pathname.startsWith(path));
}
