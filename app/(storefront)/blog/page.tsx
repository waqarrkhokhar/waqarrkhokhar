import type { Metadata } from "next";
import Link from "next/link";
import { getBlogList } from "@/lib/storefront/blog";
import BlogListView from "@/components/storefront/blog/BlogListView";
import { waLink } from "@/lib/whatsapp";
import WhatsAppIcon from "@/components/storefront/WhatsAppIcon";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Journal | ComfyClub Blog",
  description: "Furniture guides, interior inspiration and styling tips for Pakistani homes from the ComfyClub workshop.",
};

export default async function BlogPage() {
  const posts = await getBlogList();

  return (
    <div>
      <div className="px-5 pb-2 pt-6 md:px-10">
        <nav className="mb-1 text-xs text-charcoal/50" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-gold">Home</Link>
          <span className="mx-1.5">›</span>
          <span className="text-charcoal/70">Blog</span>
        </nav>
        <h1 className="m-0 font-heading text-[28px] font-semibold text-charcoal">Journal</h1>
        <p className="mt-1 text-[13px] text-[#888]">Furniture guides, interior inspiration &amp; styling tips</p>
      </div>

      {posts.length === 0 ? (
        <p className="px-5 py-16 text-center text-sm text-[#999] md:px-10">No articles published yet.</p>
      ) : (
        <BlogListView posts={posts} />
      )}

      <section className="bg-cream px-6 py-9 text-center">
        <h2 className="mb-1.5 font-heading text-[22px] font-semibold text-charcoal">Get Furniture Tips &amp; Offers</h2>
        <p className="mb-4 text-[13px] text-[#888]">Join our WhatsApp list for exclusive deals and design inspiration</p>
        <a href={waLink("Hi, I'd like to join your WhatsApp list for tips and offers.")} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded bg-whatsapp px-7 py-3.5 text-[13px] font-semibold text-white">
          <WhatsAppIcon size={16} /> Join on WhatsApp
        </a>
      </section>
    </div>
  );
}
