"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { BlogCard } from "@/lib/storefront/blog";

const CATS = ["All", "Buying Guides", "Interior Design", "Home Styling", "Furniture Care", "Trends"];

function fmt(d: string | null) {
  return d ? new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "";
}

export default function BlogListView({ posts }: { posts: BlogCard[] }) {
  const [cat, setCat] = useState("All");
  const filtered = useMemo(() => (cat === "All" ? posts : posts.filter((p) => p.category === cat)), [cat, posts]);
  const cats = CATS.filter((c) => c === "All" || posts.some((p) => p.category === c));
  const [featured, ...rest] = filtered;

  return (
    <div>
      {/* Category filter */}
      <div className="no-scrollbar flex gap-2 overflow-x-auto px-5 pb-4 md:px-10">
        {cats.map((c) => (
          <button key={c} onClick={() => setCat(c)}
            className={`whitespace-nowrap rounded-full border px-4 py-1.5 text-[11px] font-medium transition ${cat === c ? "border-navy bg-navy text-white" : "border-[#ddd] text-charcoal hover:border-navy"}`}>
            {c}
          </button>
        ))}
      </div>

      {filtered.length === 0 && <p className="px-5 py-10 text-center text-sm text-[#999] md:px-10">No posts in this category yet.</p>}

      {/* Featured post */}
      {featured && (
        <div className="px-5 pb-6 md:px-10">
          <Link href={`/blog/${featured.slug}/`} className="group mx-auto block max-w-[1260px]">
            <div className="aspect-[1260/660] w-full overflow-hidden bg-cream">
              {featured.featured_image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={featured.featured_image} alt={featured.title} referrerPolicy="no-referrer" className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]" />
              )}
            </div>
            <div className="pt-3.5">
              <div className="mb-1.5 text-[10px] font-semibold uppercase tracking-[1.5px] text-gold">{featured.category}</div>
              <h2 className="m-0 font-heading text-xl font-semibold leading-snug text-charcoal md:text-2xl">{featured.title}</h2>
              {featured.excerpt && <p className="mt-2 max-w-2xl text-[13px] leading-relaxed text-[#888]">{featured.excerpt}</p>}
              <div className="mt-2.5 flex gap-3 text-[11px] text-[#aaa]"><span>{fmt(featured.published_at)}</span><span>·</span><span>{featured.read_minutes} min read</span></div>
            </div>
          </Link>
        </div>
      )}

      {rest.length > 0 && <div className="mx-5 h-px bg-black/[0.06] md:mx-10" />}

      {/* Rest as a grid */}
      {rest.length > 0 && (
        <div className="mx-auto grid max-w-[1260px] gap-6 px-5 py-6 sm:grid-cols-2 md:px-10 lg:grid-cols-3">
          {rest.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}/`} className="group flex flex-col">
              <div className="aspect-[16/10] w-full overflow-hidden bg-cream">
                {post.featured_image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={post.featured_image} alt={post.title} referrerPolicy="no-referrer" className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]" />
                )}
              </div>
              <div className="flex flex-1 flex-col pt-3">
                <div className="mb-1 text-[9px] font-semibold uppercase tracking-[1.5px] text-gold">{post.category}</div>
                <h3 className="m-0 line-clamp-2 font-heading text-[15px] font-semibold leading-snug text-charcoal">{post.title}</h3>
                <div className="mt-1.5 flex gap-2 text-[10px] text-[#aaa]"><span>{fmt(post.published_at)}</span><span>·</span><span>{post.read_minutes} min read</span></div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
