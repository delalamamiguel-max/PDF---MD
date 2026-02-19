import { Badge } from "@/components/ui/badge";
import type { DocumentStatus } from "@/lib/repositories/documents";

const classes: Record<DocumentStatus, string> = {
  Processing: "text-[var(--warning)]",
  Ready: "text-[var(--success)]",
  Failed: "text-[var(--error)]"
};

export function StatusBadge({ status }: { status: DocumentStatus }) {
  return <Badge className={classes[status]}>{status}</Badge>;
}
