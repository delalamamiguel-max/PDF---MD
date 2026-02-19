"use client";

import { FormEvent, useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type ValidationResponse = {
  valid: boolean;
  reason?: string;
  invitedEmail?: string | null;
};

export function InviteSignupForm({ token }: { token: string }) {
  const [loading, setLoading] = useState(false);
  const [validation, setValidation] = useState<ValidationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function validate() {
      const response = await fetch(`/api/invites/validate?token=${encodeURIComponent(token)}`);
      const payload = (await response.json()) as ValidationResponse;
      setValidation(payload);
    }

    void validate();
  }, [token]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const body = {
      token,
      name: String(formData.get("name") || ""),
      email: String(formData.get("email") || ""),
      password: String(formData.get("password") || "")
    };

    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const payload = (await response.json().catch(() => ({}))) as { error?: string };
      setError(payload.error ?? "Unable to complete signup.");
      setLoading(false);
      return;
    }

    await signIn("credentials", {
      email: body.email,
      password: body.password,
      callbackUrl: "/dashboard"
    });
  }

  if (!validation) {
    return <p className="text-sm text-[var(--muted-foreground)]">Checking invite…</p>;
  }

  if (!validation.valid) {
    return (
      <p className="text-sm text-[var(--error)]">
        This invite is no longer valid ({validation.reason ?? "invalid"}).
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium">Full name</label>
        <Input id="name" name="name" required />
      </div>
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium">Email</label>
        <Input id="email" name="email" type="email" required defaultValue={validation.invitedEmail ?? ""} />
      </div>
      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium">Password</label>
        <Input id="password" name="password" type="password" minLength={8} required />
      </div>
      {error ? <p className="text-sm text-[var(--error)]">{error}</p> : null}
      <Button type="submit" disabled={loading} className="w-full">{loading ? "Creating account..." : "Create account"}</Button>
    </form>
  );
}
