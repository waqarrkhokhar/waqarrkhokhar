import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getBlogPost, getMorePosts } from "@/lib/storefront/blog";
import { markdownToHtml } from "@/lib/markdown";
import { waLink } from "@/lib/whatsapp";
import WhatsAppIcon from "@/components/storefront/WhatsAppIcon";

export const dynamic = "force-dynamic";

function fmt(d: string | null) {
  return d ? new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "";
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const p = await getBlogPost(params.slug);
  if (!p) return { title: "Post not found" };
  const title = p.meta_title || `${p.title} | ComfyClub`;
  const description = p.meta_description || p.excerpt || `${p.title} — ComfyClub Journal.`;
  const noindex = !!p.robots && /noindex/i.test(p.robots);
  return {
    title,
    description,
    robots: noindex ? { index: false, follow: true } : undefined,
    openGraph: { title: p.og_title || title, description: p.og_description || description, images: p.featured_image ? [p.featured_image] : undefined, type: "article" },
  };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const p = await getBlogPost(params.slug);
  if (!p) notFound();
  const more = await getMorePosts(p.slug);
  const bodyHtml = markdownToHtml(p.content);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: p.title,
    image: p.featured_image ? [p.featured_image] : undefined,
    datePublished: p.published_at ?? undefined,
    author: { "@type": "Organization", name: "ComfyClub" },
    publisher: { "@type": "Organization", name: "ComfyClub" },
    description: p.meta_description || p.excerpt || undefined,
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav className="px-5 pb-2 pt-3 text-xs text-charcoal/50 md:px-10" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-gold">Home</Link>
        <span className="mx-1.5">›</span>
        <Link href="/blog/" className="hover:text-gold">Blog</Link>
        <span className="mx-1.5">›</span>
        <span className="text-charcoal/70">{p.title.length > 32 ? p.title.slice(0, 32) + "…" : p.title}</span>
      </nav>

      <header className="px-5 pb-4 md:px-10">
        <div className="mb-2 text-[10px] font-semibold uppercase tracking-[1.5px] text-gold">{p.category}</div>
        <h1 className="m-0 font-heading text-[28px] font-semibold leading-tight text-charcoal md:text-[34px]">{p.title}</h1>
        <div className="mt-3 flex gap-3 text-xs text-[#999]"><span>{fmt(p.published_at)}</span><span>·</span><span>{p.read_minutes} min read</span>{p.author && <><span>·</span><span>{p.author}</span></>}</div>
      </header>

      {p.featured_image && (
        <div className="mx-auto aspect-[1260/660] w-full max-w-[1260px] overflow-hidden bg-cream">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={p.featured_image} alt={p.title} referrerPolicy="no-referrer" className="h-full w-full object-cover" />
        </div>
      )}

      <article className="mx-auto max-w-2xl px-5 py-8 md:px-10">
        <div className="rich-text" dangerouslySetInnerHTML={{ __html: bodyHtml }} />

        {p.faqs.length > 0 && (
          <div className="mt-8">
            <h2 className="mb-3 font-heading text-[22px] font-semibold text-charcoal">FAQs</h2>
            {p.faqs.map((f) => (
              <details key={f.q} className="group border-b border-black/[0.07]">
                <summary className="flex cursor-pointer list-none items-center justify-between py-3.5 font-heading text-[15px] font-semibold text-charcoal">
                  {f.q}<span className="ml-3 text-base text-[#ccc] group-open:rotate-45">+</span>
                </summary>
                <p className="pb-3.5 text-sm leading-relaxed text-[#777]">{f.a}</p>
              </details>
            ))}
          </div>
        )}
      </article>

      {/* WhatsApp CTA */}
      <div className="mx-auto flex max-w-2xl items-center justify-between border-y border-black/[0.06] px-5 py-6 md:px-10">
        <div>
          <div className="text-[11px] text-[#999]">Need advice?</div>
          <div className="font-heading text-[15px] font-semibold text-charcoal">Chat with our experts</div>
        </div>
        <a href={waLink(`Hi, I read "${p.title}" and have a question.`)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded bg-whatsapp px-5 py-2.5 text-[13px] font-semibold text-white">
          <WhatsAppIcon size={15} /> WhatsApp Us
        </a>
      </div>

      {/* More articles */}
      {more.length > 0 && (
        <section className="bg-cream px-5 py-8 md:px-10">
          <h2 className="mb-4 font-heading text-[22px] font-semibold text-charcoal">More Articles</h2>
          <div className="grid gap-5 md:grid-cols-3">
            {more.map((op) => (
              <Link key={op.id} href={`/blog/${op.slug}/`} className="group flex gap-3.5 md:flex-col md:gap-0">
                <div className="h-[90px] w-[90px] flex-shrink-0 overflow-hidden bg-white md:h-auto md:w-full md:aspect-[16/10]">
                  {op.featured_image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={op.featured_image} alt={op.title} referrerPolicy="no-referrer" className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]" />
                  )}
                </div>
                <div className="flex flex-1 flex-col justify-center md:pt-2.5">
                  <div className="mb-1 text-[9px] font-semibold uppercase tracking-[1.5px] text-gold">{op.category}</div>
                  <h3 className="m-0 line-clamp-2 font-heading text-[14px] font-semibold leading-snug text-charcoal">{op.title}</h3>
                  <div className="mt-1 text-[10px] text-[#aaa]">{fmt(op.published_at)}</div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
