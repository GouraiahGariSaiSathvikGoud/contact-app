import type { ComponentProps } from "react";
import { cn } from "../lib/cn";

export function Card({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("rounded-2xl border border-border bg-surface p-5", className)} {...props} />;
}

export function CardHeader({ className, ...props }: ComponentProps<"h3">) {
  return <h3 className={cn("font-display text-lg font-bold text-text", className)} {...props} />;
}

export function CardBody({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("text-sm text-text-muted", className)} {...props} />;
}