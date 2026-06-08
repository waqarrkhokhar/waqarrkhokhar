import { cn } from "@/lib/cn";

/** Shimmering placeholder block for loading states. */
export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-black/10 dark:bg-white/10",
        className,
      )}
    />
  );
}
