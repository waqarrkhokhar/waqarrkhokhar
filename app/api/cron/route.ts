import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

/**
 * GET /api/cron — scheduled maintenance (Vercel Cron).
 *  • auto-publish products/blog whose scheduled_at has passed
 *  • auto-expire promotions past their end_date
 * Protected by CRON_SECRET (Vercel sends it as a Bearer token).
 */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  const auth = request.headers.get("authorization");
  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = createAdminClient();
  const now = new Date().toISOString();

  const [products, posts, promos] = await Promise.all([
    db.from("products").update({ status: "published", published_at: now })
      .eq("status", "scheduled").lte("scheduled_at", now).select("id"),
    db.from("blog_posts").update({ status: "published", published_at: now })
      .eq("status", "scheduled").lte("scheduled_at", now).select("id"),
    db.from("promotions").update({ status: "expired", is_active: false })
      .eq("status", "active").not("end_date", "is", null).lte("end_date", now).select("id"),
  ]);

  return NextResponse.json({
    published_products: products.data?.length ?? 0,
    published_posts: posts.data?.length ?? 0,
    expired_promotions: promos.data?.length ?? 0,
  });
}
