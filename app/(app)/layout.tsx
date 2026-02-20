import { AppShell } from "@/components/layout/app-shell";
import { requireUser } from "@/lib/session";
import { isUserAdmin } from "@/lib/repositories/users";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const { session, userId } = await requireUser();
  const admin = await isUserAdmin({
    userId,
    email: session?.user?.email
  });

  return <AppShell isAdmin={admin}>{children}</AppShell>;
}
