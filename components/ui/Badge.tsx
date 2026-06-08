import { cn } from "@/lib/cn";

type Tone = "neutral" | "success" | "warning" | "danger" | "info";

const TONES: Record<Tone, string> = {
  neutral: "bg-black/5 text-charcoal/70 dark:bg-white/10 dark:text-cream/70",
  success: "bg-green-500/15 text-green-700 dark:text-green-300",
  warning: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
  danger: "bg-red-500/15 text-red-700 dark:text-red-300",
  info: "bg-gold/15 text-navy dark:text-gold",
};

export function Badge({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: Tone;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize",
        TONES[tone],
      )}
    >
      {children}
    </span>
  );
}

/** Maps a common status string to a sensible badge tone. */
export function statusTone(status: string): Tone {
  switch (status) {
    case "published":
    case "approved":
    case "active":
    case "converted":
      return "success";
    case "draft":
    case "pending":
    case "new":
    case "scheduled":
      return "warning";
    case "archived":
    case "rejected":
    case "expired":
    case "lost":
    case "suspended":
      return "danger";
    default:
      return "neutral";
  }
}
