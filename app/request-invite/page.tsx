import Link from "next/link";
import { RequestInviteForm } from "@/components/invite/request-invite-form";
import { Card } from "@/components/ui/card";

export default function RequestInvitePage() {
  return (
    <main className="studio-container py-16">
      <Card className="mx-auto max-w-md space-y-4">
        <h1 className="text-2xl font-semibold">Request an invite</h1>
        <p className="text-sm text-[var(--muted-foreground)]">Share your details and we&apos;ll review your request.</p>
        <RequestInviteForm />
        <p className="text-sm text-[var(--muted-foreground)]">
          Already invited? <Link className="text-[var(--primary)]" href="/login">Sign in</Link>
        </p>
      </Card>
    </main>
  );
}
