import Link from "next/link";
import { InviteSignupForm } from "@/components/invite/invite-signup-form";
import { Card } from "@/components/ui/card";

export default async function InviteSignupPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;

  return (
    <main className="studio-container py-16">
      <Card className="mx-auto max-w-md space-y-4">
        <h1 className="text-2xl font-semibold">Complete your invite</h1>
        <p className="text-sm text-[var(--muted-foreground)]">This platform is invite-only.</p>
        <InviteSignupForm token={token} />
        <p className="text-sm text-[var(--muted-foreground)]">
          Already have an account? <Link className="text-[var(--primary)]" href="/login">Sign in</Link>
        </p>
      </Card>
    </main>
  );
}
