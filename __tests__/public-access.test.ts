import { describe, expect, it } from "vitest";
import { canAccessFolder } from "@/lib/public-access";
import { checkRateLimit } from "@/lib/rate-limit";

describe("public folder access", () => {
  it("blocks private folders for non-owners", () => {
    expect(
      canAccessFolder({
        visibility: "private",
        ownerId: "owner",
        viewerUserId: null,
        hasAccessToken: true
      })
    ).toBe(false);
  });

  it("allows unlisted/public only with token", () => {
    expect(
      canAccessFolder({
        visibility: "unlisted",
        ownerId: "owner",
        viewerUserId: null,
        hasAccessToken: false
      })
    ).toBe(false);

    expect(
      canAccessFolder({
        visibility: "public",
        ownerId: "owner",
        viewerUserId: null,
        hasAccessToken: true
      })
    ).toBe(true);
  });
});

describe("public endpoint rate limiter", () => {
  it("blocks when over request threshold", () => {
    const key = `test-rate-${Date.now()}`;
    expect(checkRateLimit(key, 2, 10_000).ok).toBe(true);
    expect(checkRateLimit(key, 2, 10_000).ok).toBe(true);
    expect(checkRateLimit(key, 2, 10_000).ok).toBe(false);
  });
});
