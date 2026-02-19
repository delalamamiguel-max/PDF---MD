"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { formatDate } from "@/lib/utils";

type Invite = {
  id: string;
  invited_email: string | null;
  expires_at: string;
  used_at: string | null;
  revoked_at: string | null;
  created_at: string;
  used_by_email: string | null;
};

type InviteRequest = {
  id: string;
  full_name: string;
  email: string;
  heard_about: string | null;
  status: string;
  created_at: string;
};

export function InviteAdminPanel({ initialInvites, initialRequests }: { initialInvites: Invite[]; initialRequests: InviteRequest[] }) {
  const [invites, setInvites] = useState(initialInvites);
  const [requests, setRequests] = useState(initialRequests);
  const [inviteLink, setInviteLink] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function createInvite(formData: FormData) {
    setError(null);
    const response = await fetch("/api/admin/invites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        invitedEmail: String(formData.get("invitedEmail") || "") || undefined,
        expiresInHours: Number(formData.get("expiresInHours") || 72)
      })
    });

    if (!response.ok) {
      const payload = (await response.json().catch(() => ({}))) as { error?: string };
      setError(payload.error ?? "Unable to generate invite.");
      return;
    }
    const payload = (await response.json()) as { item: Invite; inviteLink: string };
    setInvites((prev) => [payload.item, ...prev]);
    setInviteLink(payload.inviteLink);
  }

  async function revoke(id: string) {
    const response = await fetch(`/api/admin/invites/${id}/revoke`, { method: "POST" });
    if (!response.ok) return;
    setInvites((prev) => prev.map((item) => (item.id === id ? { ...item, revoked_at: new Date().toISOString() } : item)));
  }

  async function setRequestStatus(id: string, status: "reviewed" | "approved" | "rejected") {
    const response = await fetch(`/api/admin/invite-requests/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    });

    if (!response.ok) return;
    setRequests((prev) => prev.map((item) => (item.id === id ? { ...item, status } : item)));
  }

  return (
    <div className="space-y-6">
      <Card className="space-y-4">
        <h2 className="text-xl font-semibold">Generate invite</h2>
        <form
          className="grid gap-3 md:grid-cols-3"
          action={async (formData) => {
            await createInvite(formData);
          }}
        >
          <Input name="invitedEmail" type="email" placeholder="Email (optional)" />
          <Input name="expiresInHours" type="number" min={1} max={720} defaultValue={72} aria-label="Expires in hours" />
          <Button type="submit">Generate invite</Button>
        </form>
        <p className="text-xs text-[var(--muted-foreground)]">`72` means the invite expires 72 hours after generation. Leave email blank to generate a generic one-time invite.</p>
        {error ? <p className="text-sm text-[var(--error)]">{error}</p> : null}
        {inviteLink ? <p className="text-sm text-[var(--muted-foreground)] break-all">Latest invite: {inviteLink}</p> : null}
      </Card>

      <Card className="space-y-3">
        <h2 className="text-xl font-semibold">Invites</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-[var(--muted-foreground)]">
                <th className="py-2 pr-4">Email</th>
                <th className="py-2 pr-4">Status</th>
                <th className="py-2 pr-4">Created</th>
                <th className="py-2 pr-4">Expires</th>
                <th className="py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {invites.map((invite) => {
                const status = invite.revoked_at ? "Revoked" : invite.used_at ? "Used" : new Date(invite.expires_at).getTime() <= Date.now() ? "Expired" : "Unused";
                return (
                  <tr key={invite.id} className="border-t border-[var(--muted)]">
                    <td className="py-2 pr-4">{invite.invited_email ?? "Any email"}</td>
                    <td className="py-2 pr-4">{status}</td>
                    <td className="py-2 pr-4 whitespace-nowrap">{formatDate(invite.created_at)}</td>
                    <td className="py-2 pr-4 whitespace-nowrap">{formatDate(invite.expires_at)}</td>
                    <td className="py-2">
                      {status === "Unused" ? <Button variant="ghost" onClick={() => revoke(invite.id)}>Revoke</Button> : "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <Card className="space-y-3">
        <h2 className="text-xl font-semibold">Invite requests</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-[var(--muted-foreground)]">
                <th className="py-2 pr-4">Name</th>
                <th className="py-2 pr-4">Email</th>
                <th className="py-2 pr-4">Heard about</th>
                <th className="py-2 pr-4">Status</th>
                <th className="py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req) => (
                <tr key={req.id} className="border-t border-[var(--muted)]">
                  <td className="py-2 pr-4">{req.full_name}</td>
                  <td className="py-2 pr-4">{req.email}</td>
                  <td className="py-2 pr-4">{req.heard_about ?? "—"}</td>
                  <td className="py-2 pr-4">{req.status}</td>
                  <td className="py-2">
                    <div className="flex gap-2">
                      <Button variant="ghost" onClick={() => setRequestStatus(req.id, "reviewed")}>Review</Button>
                      <Button variant="ghost" onClick={() => setRequestStatus(req.id, "approved")}>Approve</Button>
                      <Button variant="ghost" onClick={() => setRequestStatus(req.id, "rejected")}>Reject</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
