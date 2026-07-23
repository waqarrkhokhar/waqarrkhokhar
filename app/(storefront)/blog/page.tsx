import type { Metadata } from "next";
import Link from "next/link";
import { getBlogList } from "@/lib/storefront/blog";
import BlogListView from "@/components/storefront/blog/BlogListView";
import { waLink } from "@/lib/whatsapp";
import WhatsAppIcon from "@/components/storefront/WhatsAppIcon";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Journal | ComfyClub Blog",
  description: "Furniture guides, interior inspiration and styling tips for Pakistani homes from the ComfyClub workshop.",
};

export default async function BlogPage() {
  const posts = await getBlogList();

  return (
    <div>
      <div className="mx-auto max-w-6xl px-5 pb-2 pt-6 md:px-10">
        <nav className="mb-2 text-[13px] text-charcoal/50" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-gold">Home</Link>
          <span className="mx-1.5">›</span>
          <span className="text-charcoal/70">Blog</span>
        </nav>
        <h1 className="m-0 font-heading text-[34px] font-semibold text-charcoal md:text-[42px]">Journal</h1>
        <p className="mt-2 text-[16px] text-[#777]">Furniture guides, interior inspiration &amp; styling tips</p>
      </div>

      {posts.length === 0 ? (
        <p className="px-5 py-16 text-center text-[16px] text-[#999] md:px-10">No articles published yet.</p>
      ) : (
        <BlogListView posts={posts} />
      )}

      <section className="bg-cream px-6 py-12 text-center">
        <h2 className="mb-2 font-heading text-[28px] font-semibold text-charcoal md:text-[32px]">Get Furniture Tips &amp; Offers</h2>
        <p className="mb-5 text-[16px] text-[#777]">Join our WhatsApp list for exclusive deals and design inspiration</p>
        <a href={waLink("Hi, I'd like to join your WhatsApp list for tips and offers.")} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-md bg-whatsapp px-7 py-3.5 text-[15px] font-semibold text-white transition hover:brightness-110">
          <WhatsAppIcon size={16} /> Join on WhatsApp
        </a>
      </section>
    </div>
  );
}
