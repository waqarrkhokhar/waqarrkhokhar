import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getCategoryPage } from "@/lib/storefront/data";
import CollectionGrid from "@/components/storefront/CollectionGrid";

export const dynamic = "force-dynamic";

function toPath(segments: string[]) {
  return "/" + segments.map((s) => decodeURIComponent(s)).join("/") + "/";
}

export async function generateMetadata({ params }: { params: { path: string[] } }): Promise<Metadata> {
  const page = await getCategoryPage(toPath(params.path));
  if (!page) return { title: "Not found" };
  const title = page.meta_title || `${page.name} | ComfyClub`;
  const description = page.meta_description || page.description || `Browse ${page.name} — handcrafted, made to order in Lahore by ComfyClub.`;
  const image = page.banner_image || undefined;
  return { title, description, openGraph: { title, description, images: image ? [image] : undefined } };
}

export default async function CategoryPage({ params }: { params: { path: string[] } }) {
  const page = await getCategoryPage(toPath(params.path));
  if (!page) notFound();

  return (
    <div>
      {/* Banner / header */}
      <div className="relative overflow-hidden bg-navy px-5 py-12 text-center md:px-10 md:py-16">
        {page.banner_image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={page.banner_image}
            alt=""
            referrerPolicy="no-referrer"
            className="absolute inset-0 h-full w-full object-cover"
            style={{ opacity: 0.4 }}
          />
        )}
        <div className="relative">
          <nav className="mb-3 text-[12px] text-white/55" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-gold">Home</Link>
            {page.breadcrumb.map((b, i) => (
              <span key={b.slug}>
                <span className="mx-1.5">/</span>
                {i === page.breadcrumb.length - 1 ? (
                  <span className="text-white/85">{b.name}</span>
                ) : (
                  <Link href={b.slug} className="hover:text-gold">{b.name}</Link>
                )}
              </span>
            ))}
          </nav>
          <h1 className="font-heading text-[30px] font-semibold text-white md:text-[40px]">{page.name}</h1>
          {page.description && (
            <p className="mx-auto mt-2 max-w-2xl text-[14px] leading-relaxed text-white/65">{page.description}</p>
          )}
        </div>
      </div>

      {/* Parent: child collection cards */}
      {page.type === "parent" && page.children.length > 0 && (
        <section className="px-5 py-8 md:px-10">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {page.children.map((c) => (
              <Link key={c.id} href={c.slug} className="group relative aspect-[4/5] overflow-hidden bg-cream">
                {c.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={c.image} alt={c.name} referrerPolicy="no-referrer" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                )}
                <div className="absolute inset-0 flex flex-col justify-end p-3.5" style={{ background: "linear-gradient(transparent 40%, rgba(15,29,53,0.75))" }}>
                  <p className="font-heading text-[16px] font-semibold text-white">{c.name}</p>
                  <p className="text-xs text-white/60">{c.count} designs</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Intro content (collection) */}
      {page.intro_content && (
        <div className="mx-auto max-w-3xl px-5 pt-8 md:px-10">
          <div className="rich-text" dangerouslySetInnerHTML={{ __html: page.intro_content }} />
        </div>
      )}

      {/* Product grid with filters / sort / load-more */}
      {page.products.length > 0 ? (
        <section className="py-5">
          <CollectionGrid products={page.products} />
        </section>
      ) : (
        page.children.length === 0 && (
          <section className="px-5 py-16 text-center text-charcoal/50 md:px-10">
            <p className="font-heading text-lg">No products here yet.</p>
            <p className="mt-1 text-sm">Check back soon — new pieces are added regularly.</p>
          </section>
        )
      )}

      {/* Long-form collection content (below products + pagination) */}
      {page.content_html && (
        <section className="bg-cream px-5 py-12 md:px-10">
          <div
            className="rich-text mx-auto max-w-3xl"
            dangerouslySetInnerHTML={{ __html: page.content_html }}
          />
        </section>
      )}
    </div>
  );
}
