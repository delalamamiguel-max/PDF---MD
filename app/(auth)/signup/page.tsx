import Link from "next/link";
import { SignupForm } from "@/components/auth/signup-form";
import { Card } from "@/components/ui/card";

export default function SignupPage() {
  return (
    <main className="studio-container py-16">
      <Card className="mx-auto max-w-md space-y-4">
        <h1 className="text-2xl font-semibold">Create your vault</h1>
        <p className="text-sm text-[var(--muted-foreground)]">Start with one PDF and build from there.</p>
        <SignupForm />
        <p className="text-sm text-[var(--muted-foreground)]">
          Already have an account? <Link className="text-[var(--primary)]" href="/login">Sign in</Link>
        </p>
      </Card>
    </main>
  );
}
