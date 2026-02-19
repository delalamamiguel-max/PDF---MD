import { Card } from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <section className="space-y-4">
      <h1 className="text-3xl font-semibold">Settings</h1>
      <Card>
        <p className="text-sm text-[var(--muted-foreground)]">Profile and data retention controls are ready for expansion in V1.</p>
      </Card>
    </section>
  );
}
