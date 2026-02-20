"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const baseLinks = [
  { href: "/dashboard", label: "Library" },
  { href: "/upload", label: "Upload" },
  { href: "/settings", label: "Settings" }
];

const adminOnlyLinks = [
  { href: "/search", label: "Ask" },
  { href: "/admin/invites", label: "Admin" }
];

export function AppShell({ children, isAdmin }: { children: React.ReactNode; isAdmin: boolean }) {
  const pathname = usePathname();
  const links = isAdmin ? [...baseLinks, ...adminOnlyLinks] : baseLinks;

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
