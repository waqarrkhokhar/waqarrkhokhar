import type { ReactNode } from "react";

/** Friendly empty/zero-results state with an optional action. */
export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-black/10 px-6 py-12 text-center dark:border-white/10">
      <p className="font-heading text-lg font-semibold">{title}</p>
      {description && (
        <p className="mt-1 max-w-sm text-sm text-charcoal/60 dark:text-cream/60">
          {description}
        </p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
