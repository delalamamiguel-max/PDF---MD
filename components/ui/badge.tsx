import { cn } from "@/lib/utils";

export function Badge({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-[var(--muted)] bg-[var(--background)] px-2.5 py-1 text-xs text-[var(--muted-foreground)]",
        className
      )}
      {...props}
    />
  );
}
