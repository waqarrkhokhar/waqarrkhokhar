/**
 * Security headers applied to every response (Engineering Blueprint §9).
 * Image hosts: WordPress (A3 — referenced at launch) + Supabase Storage.
 */
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-XSS-Protection", value: "1; mode=block" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains",
  },
  // Disable browser features the site never uses.
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=(), interest-cohort=()",
  },
];

/** The dashboard is private — never index or follow any of its URLs. */
const noIndexHeader = [{ key: "X-Robots-Tag", value: "noindex, nofollow, noarchive, nosnippet" }];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "comfyclub.pk" },
      { protocol: "https", hostname: "www.comfyclub.pk" },
      { protocol: "https", hostname: "*.supabase.co" },
    ],
    formats: ["image/webp"],
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      // Private dashboard (and login/reset/API under it) — block all indexing.
      { source: "/dashboard", headers: noIndexHeader },
      { source: "/dashboard/:path*", headers: noIndexHeader },
    ];
  },
};

export default nextConfig;
