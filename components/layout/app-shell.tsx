"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const links = [
  { href: "/dashboard", label: "Library" },
  { href: "/upload", label: "Upload" },
  { href: "/search", label: "Ask" },
  { href: "/settings", label: "Settings" }
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen">
      <header className="border-b border-[var(--muted)] bg-white">
        <div className="studio-container flex h-16 items-center justify-between">
          <Link href="/dashboard" className="font-semibold">DocToMD Vault</Link>
          <nav className="flex items-center gap-2">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-md px-3 py-2 text-sm text-[var(--muted-foreground)]",
                  pathname.startsWith(link.href) && "bg-[var(--muted)] text-[var(--foreground)]"
                )}
              >
                {link.label}
              </Link>
            ))}
            <Button variant="ghost" onClick={() => signOut({ callbackUrl: "/login" })}>Sign out</Button>
          </nav>
        </div>
      </header>
      <main className="studio-container py-8">{children}</main>
    </div>
  );
}
