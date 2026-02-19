import { describe, expect, it } from "vitest";
import { isInviteConsumable } from "@/lib/invite-token";

describe("invite token consumable rules", () => {
  it("accepts an unused, unrevoked, unexpired token", () => {
    const ok = isInviteConsumable({
      invitedEmail: null,
      emailAttempt: "a@b.com",
      expiresAt: new Date(Date.now() + 60_000).toISOString(),
      usedAt: null,
      revokedAt: null
    });

    expect(ok).toBe(true);
  });

  it("rejects reused tokens", () => {
    const ok = isInviteConsumable({
      invitedEmail: null,
      emailAttempt: "a@b.com",
      expiresAt: new Date(Date.now() + 60_000).toISOString(),
      usedAt: new Date().toISOString(),
      revokedAt: null
    });

    expect(ok).toBe(false);
  });

  it("rejects email mismatch when invite is email-bound", () => {
    const ok = isInviteConsumable({
      invitedEmail: "owner@example.com",
      emailAttempt: "other@example.com",
      expiresAt: new Date(Date.now() + 60_000).toISOString(),
      usedAt: null,
      revokedAt: null
    });

    expect(ok).toBe(false);
  });
});
