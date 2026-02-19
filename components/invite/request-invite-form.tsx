"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function RequestInviteForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData(event.currentTarget);
    const response = await fetch("/api/invite-requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName: String(formData.get("fullName") || ""),
        email: String(formData.get("email") || ""),
        heardAbout: String(formData.get("heardAbout") || "")
      })
    });

    if (!response.ok) {
      const payload = (await response.json().catch(() => ({}))) as { error?: string };
      setError(payload.error ?? "Unable to send request.");
      setLoading(false);
      return;
    }

    setSuccess("Request sent. An admin will review your request.");
    setLoading(false);
    event.currentTarget.reset();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="fullName" className="text-sm font-medium">Full name</label>
        <Input id="fullName" name="fullName" required />
      </div>
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium">Email</label>
        <Input id="email" name="email" type="email" required />
      </div>
      <div className="space-y-2">
        <label htmlFor="heardAbout" className="text-sm font-medium">How did you hear about this product? (optional)</label>
        <Input id="heardAbout" name="heardAbout" />
      </div>
      {error ? <p className="text-sm text-[var(--error)]">{error}</p> : null}
      {success ? <p className="text-sm text-[var(--success)]">{success}</p> : null}
      <Button type="submit" disabled={loading} className="w-full">{loading ? "Submitting..." : "Request invite"}</Button>
    </form>
  );
}
