import Link from "next/link";
import { LoginForm } from "@/components/auth/login-form";
import { Card } from "@/components/ui/card";

export default function LoginPage() {
  return (
    <main className="studio-container py-16">
      <Card className="mx-auto max-w-md space-y-4">
        <h1 className="text-2xl font-semibold">Welcome back</h1>
        <p className="text-sm text-[var(--muted-foreground)]">Sign in to your knowledge vault.</p>
        <LoginForm />
        <p className="text-sm text-[var(--muted-foreground)]">
          New here? <Link className="text-[var(--primary)]" href="/signup">Create an account</Link>
        </p>
      </Card>
    </main>
  );
}
