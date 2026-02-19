const protectedPaths = [
  "/dashboard",
  "/upload",
  "/docs",
  "/search",
  "/settings",
  "/admin",
  "/api/upload",
  "/api/ingest",
  "/api/documents",
  "/api/folders",
  "/api/admin"
];

export function isProtectedPath(pathname: string) {
  return protectedPaths.some((path) => pathname.startsWith(path));
}
