import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DocToMD Vault",
  description: "Calm PDF to Markdown knowledge vault"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
