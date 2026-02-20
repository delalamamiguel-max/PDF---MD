import { SettingsPanel } from "@/components/settings/settings-panel";
import { notFound } from "next/navigation";
import { findUserById, isUserAdmin } from "@/lib/repositories/users";
import { requireUser } from "@/lib/session";

export default async function SettingsPage() {
  const { session, userId } = await requireUser();
  const user = await findUserById(userId);

  if (!user) {
    notFound();
  }

  const admin = await isUserAdmin({
    userId,
    email: session?.user?.email
  });

  return (
    <section className="space-y-4">
      <h1 className="text-3xl font-semibold">Settings</h1>
      <p className="text-sm text-[var(--muted-foreground)]">Manage your profile, access level, and workspace controls.</p>
      <SettingsPanel
        user={{
          name: user.name ?? "",
          email: user.email,
          createdAt: user.created_at,
          role: admin ? "admin" : "user"
        }}
      />
    </section>
  );
}
