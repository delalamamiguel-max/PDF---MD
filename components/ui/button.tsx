import * as React from "react";
import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "secondary" | "ghost" | "danger";
};

const variantMap: Record<NonNullable<ButtonProps["variant"]>, string> = {
  default: "bg-[var(--primary)] text-white hover:opacity-95",
  secondary: "bg-white text-[var(--foreground)] border border-[var(--muted)] hover:bg-[var(--background)]",
  ghost: "bg-transparent text-[var(--foreground)] hover:bg-[var(--muted)]",
  danger: "bg-[var(--error)] text-white hover:opacity-95"
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = "default", ...props },
  ref
) {
  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] disabled:pointer-events-none disabled:opacity-60",
        variantMap[variant],
        className
      )}
      {...props}
    />
  );
});
