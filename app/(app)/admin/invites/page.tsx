import { InviteAdminPanel } from "@/components/admin/invite-admin-panel";
import { listInviteRequests, listInvites } from "@/lib/repositories/invites";
import { requireAdmin } from "@/lib/session";

export default async function AdminInvitesPage() {
  await requireAdmin();

  const [invites, requests] = await Promise.all([listInvites(), listInviteRequests()]);

  return (
    <section className="space-y-4">
      <h1 className="text-3xl font-semibold">Admin invites</h1>
      <p className="text-sm text-[var(--muted-foreground)]">Generate one-time invites and review incoming invite requests.</p>
      <InviteAdminPanel initialInvites={invites} initialRequests={requests} />
    </section>
  );
}
