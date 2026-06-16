/**
 * Sticky banner shown only when an admin is previewing an unpublished item on
 * the live storefront. Visible to no one else (preview is auth-gated server-side).
 */
export default function PreviewBanner({ editHref }: { editHref?: string }) {
  return (
    <div className="sticky top-0 z-[60] flex items-center justify-center gap-3 bg-gold px-4 py-2 text-center text-[13px] font-semibold text-navy">
      <span>👁 Preview mode — this is how the page will look once published. Not visible to the public.</span>
      {editHref && (
        <a href={editHref} className="rounded bg-navy px-3 py-1 text-[12px] font-semibold text-white">
          Back to editor
        </a>
      )}
    </div>
  );
}
