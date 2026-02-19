import { describe, expect, it } from "vitest";
import { isProtectedPath } from "@/lib/authz";

describe("auth gating", () => {
  it("marks app and api vault routes as protected", () => {
    expect(isProtectedPath("/dashboard")).toBe(true);
    expect(isProtectedPath("/upload")).toBe(true);
    expect(isProtectedPath("/api/upload")).toBe(true);
    expect(isProtectedPath("/api/documents/abc")).toBe(true);
  });

  it("keeps public routes unprotected", () => {
    expect(isProtectedPath("/")).toBe(false);
    expect(isProtectedPath("/login")).toBe(false);
    expect(isProtectedPath("/signup")).toBe(false);
  });
});
