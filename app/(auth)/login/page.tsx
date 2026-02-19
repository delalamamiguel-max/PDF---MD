import Link from "next/link";
import { LoginForm } from "@/components/auth/login-form";
import { Card } from "@/components/ui/card";

export default function LoginPage() {
  return (
    <main className="studio-container py-16">
      <Card className="mx-auto max-w-md space-y-4">
        <h1 className="text-2xl font-semibold">Welcome back</h1>
        <p className="text-sm text-[var(--muted-foreground)]">Sign in to your knowledge vault.</p>
        <p className="rounded-md bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)]">This platform is invite-only.</p>
        <LoginForm />
        <p className="text-sm text-[var(--muted-foreground)]">
          Need access? <Link className="text-[var(--primary)]" href="/request-invite">Request an invite</Link>
        </p>
        <p className="text-sm text-[var(--muted-foreground)]">
          <Link className="text-[var(--primary)]" href="/">Back to Main Landing Page</Link>
        </p>
      </Card>
    </main>
  );
}
