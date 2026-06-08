import { getCurrentUser } from "@/lib/auth/session";
import { capabilitiesFor } from "@/lib/auth/permissions";

export default async function DashboardOverview() {
  const user = await getCurrentUser();
  if (!user) return null; // layout already guards; satisfies the type

  const caps = capabilitiesFor(user.role);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-3xl font-semibold">
          Welcome back, {user.name.split(" ")[0]}
        </h2>
        <p className="mt-1 text-sm text-charcoal/70 dark:text-cream/70">
          You are signed in as <span className="font-medium">{user.role}</span>.
          Live metrics (products, reviews, leads, SEO health) appear here once
          those modules ship in later phases.
        </p>
      </div>

      <div className="rounded-xl border border-black/5 bg-white p-5 dark:border-white/10 dark:bg-white/5">
        <h3 className="font-heading text-lg font-semibold">Your access</h3>
        <p className="mb-3 text-sm text-charcoal/70 dark:text-cream/70">
          Based on your role, you can manage:
        </p>
        <div className="flex flex-wrap gap-2">
          {caps.map((c) => (
            <span
              key={c}
              className="rounded-full bg-gold/15 px-3 py-1 text-xs font-medium capitalize text-navy dark:text-gold"
            >
              {c.replace("_", " / ")}
            </span>
          ))}
        </div>
      </div>

      <p className="text-sm text-charcoal/60 dark:text-cream/60">
        Phase 2 (Authentication &amp; Roles) is complete. Menu items marked{" "}
        <span className="font-medium">“Soon”</span> unlock as each phase ships.
      </p>
    </div>
  );
}
