"use client";

/**
 * Shared dashboard UI primitives — faithful ports of the design prototype's
 * DashBtn / DashBadge / DashCard / DashSection / DashPageHeader / DashProgress /
 * DashSparkline. Used across every dashboard screen.
 */
import Link from "next/link";

const cardBase =
  "rounded-[10px] border border-line bg-white dark:border-white/10 dark:bg-[#191f2e]";

/* ── Button ──────────────────────────────────────────────────────────────── */
type BtnVariant = "primary" | "secondary" | "danger" | "ghost" | "navy";
const btnVariants: Record<BtnVariant, string> = {
  primary: "bg-gold text-white shadow-[0_2px_8px_rgba(201,168,76,0.3)] hover:bg-[#b8972f]",
  secondary: "bg-white text-ink border border-line hover:bg-panel dark:bg-white/5 dark:text-cream dark:border-white/10",
  danger: "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100",
  ghost: "bg-transparent text-muted hover:bg-panel dark:hover:bg-white/5",
  navy: "bg-navy text-white hover:bg-navyHover",
};

export function DashBtn({
  children,
  onClick,
  href,
  variant = "primary",
  size,
  icon,
  disabled,
  full,
  type = "button",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  variant?: BtnVariant;
  size?: "sm";
  icon?: React.ReactNode;
  disabled?: boolean;
  full?: boolean;
  type?: "button" | "submit";
}) {
  const cls = `inline-flex items-center justify-center gap-1.5 rounded-md font-semibold transition ${
    size === "sm" ? "px-3 py-1.5 text-xs" : "px-[18px] py-[9px] text-[13px]"
  } ${btnVariants[variant]} ${full ? "w-full" : ""} ${disabled ? "cursor-not-allowed opacity-50" : ""}`;
  if (href && !disabled) {
    return (
      <Link href={href} className={cls}>
        {icon && <span className="text-sm">{icon}</span>}
        {children}
      </Link>
    );
  }
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={cls}>
      {icon && <span className="text-sm">{icon}</span>}
      {children}
    </button>
  );
}

/* ── Badge ───────────────────────────────────────────────────────────────── */
type BadgeStatus =
  | "published" | "active" | "approved"
  | "draft" | "pending" | "scheduled"
  | "archived" | "deleted" | "error" | "info";
const badgeStyles: Record<BadgeStatus, string> = {
  published: "bg-green-100 text-green-700",
  active: "bg-green-100 text-green-700",
  approved: "bg-green-100 text-green-700",
  draft: "bg-amber-100 text-amber-700",
  pending: "bg-amber-100 text-amber-700",
  scheduled: "bg-blue-100 text-blue-700",
  archived: "bg-gray-100 text-gray-500",
  deleted: "bg-red-100 text-red-600",
  error: "bg-red-100 text-red-600",
  info: "bg-blue-100 text-blue-700",
};
export function DashBadge({ status = "draft", label }: { status?: BadgeStatus; label?: string }) {
  return (
    <span className={`inline-block rounded-full px-2.5 py-[3px] text-[11px] font-medium ${badgeStyles[status] ?? badgeStyles.draft}`}>
      {label ?? status}
    </span>
  );
}

/* ── Stat card ───────────────────────────────────────────────────────────── */
export function DashCard({
  label,
  value,
  change,
  icon,
  tint = "bg-gold/15",
  href,
  onClick,
}: {
  label: string;
  value: React.ReactNode;
  change?: number;
  icon?: React.ReactNode;
  tint?: string;
  href?: string;
  onClick?: () => void;
}) {
  const inner = (
    <>
      <div>
        <div className="text-xs text-muted">{label}</div>
        <div className="mt-1.5 font-heading text-[28px] font-bold leading-none text-charcoal dark:text-cream">{value}</div>
        {change != null && (
          <div className={`mt-1 flex items-center gap-1 text-[11px] ${change > 0 ? "text-green-600" : "text-red-500"}`}>
            {change > 0 ? "↑" : "↓"} {Math.abs(change)}% vs last month
          </div>
        )}
      </div>
      {icon && <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-[10px] text-lg ${tint}`}>{icon}</div>}
    </>
  );
  const cls = `${cardBase} flex items-start justify-between p-5 transition ${href || onClick ? "cursor-pointer hover:-translate-y-px hover:shadow-card" : ""}`;
  if (href) return <Link href={href} className={cls}>{inner}</Link>;
  return <div onClick={onClick} className={cls}>{inner}</div>;
}

/* ── Section card ────────────────────────────────────────────────────────── */
export function DashSection({
  title,
  subtitle,
  children,
  actions,
  noPad,
  className = "",
}: {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  noPad?: boolean;
  className?: string;
}) {
  return (
    <div className={`${cardBase} ${className}`}>
      {title && (
        <div className="flex items-center justify-between border-b border-line px-5 py-4 dark:border-white/10">
          <div>
            <div className="text-[15px] font-semibold text-charcoal dark:text-cream">{title}</div>
            {subtitle && <div className="mt-0.5 text-xs text-muted">{subtitle}</div>}
          </div>
          {actions && <div className="flex gap-1.5">{actions}</div>}
        </div>
      )}
      <div className={noPad ? "" : "px-5 py-4"}>{children}</div>
    </div>
  );
}

/* ── Page header ─────────────────────────────────────────────────────────── */
export function DashPageHeader({
  title,
  subtitle,
  breadcrumbs,
  actions,
}: {
  title: string;
  subtitle?: string;
  breadcrumbs?: { label: string; href?: string }[];
  actions?: React.ReactNode;
}) {
  return (
    <div className="mb-6">
      {breadcrumbs && (
        <div className="mb-2 flex items-center gap-1.5 text-xs">
          {breadcrumbs.map((b, i) => (
            <span key={i} className="flex items-center gap-1.5">
              {i > 0 && <span className="text-muted">›</span>}
              {b.href ? (
                <Link href={b.href} className="text-gold hover:underline">{b.label}</Link>
              ) : (
                <span className="text-muted">{b.label}</span>
              )}
            </span>
          ))}
        </div>
      )}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="m-0 font-heading text-[26px] font-semibold text-charcoal dark:text-cream">{title}</h1>
          {subtitle && <p className="mt-1 text-[13px] text-muted">{subtitle}</p>}
        </div>
        {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
      </div>
    </div>
  );
}

/* ── Progress bar ────────────────────────────────────────────────────────── */
export function DashProgress({ value, max = 100, label, color = "#C9A84C" }: { value: number; max?: number; label?: string; color?: string }) {
  const pct = Math.round((value / (max || 100)) * 100);
  return (
    <div className="mb-3">
      {label && (
        <div className="mb-1 flex justify-between text-xs">
          <span className="text-ink dark:text-cream">{label}</span>
          <span className="text-muted">{pct}%</span>
        </div>
      )}
      <div className="h-1.5 rounded-full bg-panel dark:bg-white/10">
        <div className="h-1.5 rounded-full transition-[width] duration-500" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}

/* ── Sparkline ───────────────────────────────────────────────────────────── */
export function DashSparkline({ data, color = "#C9A84C", height = 40 }: { data: number[]; color?: string; height?: number }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 120;
  const points = data.map((v, i) => `${(i / (data.length - 1)) * w},${height - ((v - min) / range) * (height - 4)}`).join(" ");
  return (
    <svg width={w} height={height} className="block">
      <polyline points={points} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
