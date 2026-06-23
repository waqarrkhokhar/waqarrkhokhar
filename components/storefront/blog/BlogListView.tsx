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

      {/* Uniform grid */}
      {filtered.length > 0 && (
        <div className="mx-auto grid max-w-[1260px] gap-x-6 gap-y-8 px-5 py-6 sm:grid-cols-2 md:px-10 lg:grid-cols-3">
          {filtered.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}/`} className="group flex flex-col">
              <div className="aspect-[16/10] w-full overflow-hidden bg-cream">
                {post.featured_image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={post.featured_image} alt={post.title} referrerPolicy="no-referrer" loading="lazy" decoding="async" className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]" />
                )}
              </div>
              <div className="flex flex-1 flex-col pt-3">
                <div className="mb-1 text-[9px] font-semibold uppercase tracking-[1.5px] text-gold">{post.category}</div>
                <h3 className="m-0 line-clamp-2 font-heading text-[16px] font-semibold leading-snug text-charcoal">{post.title}</h3>
                {post.excerpt && <p className="mt-1.5 line-clamp-2 text-[12.5px] leading-relaxed text-[#888]">{post.excerpt}</p>}
                <div className="mt-2 flex gap-2 text-[10px] text-[#aaa]"><span>{fmt(post.published_at)}</span><span>·</span><span>{post.read_minutes} min read</span></div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
