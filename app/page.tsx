/**
 * Phase 1 foundation landing page.
 * This is a temporary placeholder that confirms the scaffold, brand tokens,
 * and fonts are working. The real homepage is built in Phase 7 / Phase 13.
 */
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-navy px-6 text-center text-cream">
      <p className="font-body text-sm uppercase tracking-[0.3em] text-gold">
        Handcrafted in Lahore
      </p>
      <h1 className="font-heading text-5xl font-semibold sm:text-7xl">
        ComfyClub
      </h1>
      <p className="max-w-md font-body text-base text-cream/80">
        Foundation deployed successfully. The storefront and CMS are under
        construction.
      </p>
      <span className="rounded-full border border-gold/40 px-4 py-1 font-body text-xs uppercase tracking-widest text-gold">
        Phase 1 · Foundation
      </span>
    </main>
  );
}
