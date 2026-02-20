"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type SettingsPanelProps = {
  user: {
    name: string;
    email: string;
    createdAt: string;
    role: "admin" | "user";
  };
};

export function SettingsPanel({ user }: SettingsPanelProps) {
  const isAdmin = user.role === "admin";
  const [name, setName] = useState(user.name);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function saveProfile(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setStatus(null);
    setError(null);

    const response = await fetch("/api/settings/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name })
    });

    if (!response.ok) {
      const payload = (await response.json().catch(() => ({}))) as { error?: string };
      setError(payload.error ?? "Unable to update profile");
      setSaving(false);
      return;
    }

    setStatus("Profile updated.");
    setSaving(false);
  }

  return (
    <div className="space-y-4">
      <Card className="space-y-4">
        <CardTitle>Profile</CardTitle>
        <CardDescription>Manage your account details and visibility into role-based access.</CardDescription>
        <form onSubmit={saveProfile} className="space-y-3">
          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-1">
              <label className="text-sm font-medium" htmlFor="name">Full name</label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium" htmlFor="email">Email</label>
              <Input id="email" value={user.email} disabled />
            </div>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
              <p className="text-sm text-[var(--muted-foreground)]">Role: <span className="font-medium text-[var(--foreground)]">{isAdmin ? "Super user / Admin" : "Regular user"}</span></p>
            <p className="text-sm text-[var(--muted-foreground)]">Joined: <span className="font-medium text-[var(--foreground)]">{new Date(user.createdAt).toLocaleString()}</span></p>
          </div>
          {status ? <p className="text-sm text-[var(--success)]">{status}</p> : null}
          {error ? <p className="text-sm text-[var(--error)]">{error}</p> : null}
          <Button type="submit" disabled={saving || name.trim().length === 0}>{saving ? "Saving..." : "Save profile"}</Button>
        </form>
      </Card>

      <Card className="space-y-3">
        <CardTitle>Workspace Access</CardTitle>
        <CardDescription>
          {user.role === "admin"
            ? "You can manage invites and use Ask to query shared knowledge."
            : "Your account has standard library access. Invite and Ask tools are hidden for non-admin users."}
        </CardDescription>
        <div className="flex flex-wrap gap-2">
          <Link href="/dashboard"><Button variant="secondary">Go to Library</Button></Link>
          <Link href="/upload"><Button variant="secondary">Upload PDFs</Button></Link>
          {isAdmin ? <Link href="/admin/invites"><Button variant="secondary">Admin Invites</Button></Link> : null}
          {isAdmin ? <Link href="/search"><Button variant="secondary">Ask</Button></Link> : null}
        </div>
      </Card>

      {isAdmin ? (
        <Card className="space-y-3">
          <CardTitle>Admin Settings</CardTitle>
          <CardDescription>
            Manage invite-only onboarding and privileged search tools.
          </CardDescription>
          <div className="flex flex-wrap gap-2">
            <Link href="/admin/invites"><Button variant="secondary">Manage invites</Button></Link>
            <Link href="/search"><Button variant="secondary">Open Ask</Button></Link>
          </div>
        </Card>
      ) : (
        <Card className="space-y-3">
          <CardTitle>User Settings</CardTitle>
          <CardDescription>
            Your account can upload documents, organize folders, and view your own library data.
          </CardDescription>
          <div className="flex flex-wrap gap-2">
            <Link href="/dashboard"><Button variant="secondary">Open library</Button></Link>
            <Link href="/upload"><Button variant="secondary">Upload a document</Button></Link>
          </div>
        </Card>
      )}

      <Card className="space-y-3">
        <CardTitle>Security</CardTitle>
        <CardDescription>
          Accounts are invite-only. Keep your session secure by signing out when on shared devices.
        </CardDescription>
        <Button variant="ghost" onClick={() => signOut({ callbackUrl: "/login" })}>Sign out now</Button>
      </Card>
    </div>
  );
}
