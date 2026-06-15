/**
 * Google API access via a service account — no external SDK.
 * Signs a JWT with Node crypto, exchanges it for an access token, and queries
 * the (free) GA4 Data API and Search Console API. Returns null when not
 * configured so the dashboard degrades gracefully.
 *
 * Env: GOOGLE_SERVICE_ACCOUNT_JSON — the full service-account key JSON.
 */
import crypto from "crypto";

type SA = { client_email: string; private_key: string };

let tokenCache: { token: string; exp: number } | null = null;

function getServiceAccount(): SA | null {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!raw) return null;
  try {
    const j = JSON.parse(raw);
    if (j.client_email && j.private_key) return { client_email: j.client_email, private_key: String(j.private_key).replace(/\\n/g, "\n") };
  } catch {
    /* malformed */
  }
  return null;
}

export function googleConfigured(): boolean {
  return !!getServiceAccount();
}

const b64url = (input: Buffer | string) =>
  Buffer.from(input).toString("base64").replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");

async function getToken(): Promise<string | null> {
  const sa = getServiceAccount();
  if (!sa) return null;
  const now = Math.floor(Date.now() / 1000);
  if (tokenCache && tokenCache.exp - 60 > now) return tokenCache.token;

  const scope = [
    "https://www.googleapis.com/auth/analytics.readonly",
    "https://www.googleapis.com/auth/webmasters.readonly",
  ].join(" ");
  const header = b64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claim = b64url(JSON.stringify({
    iss: sa.client_email, scope, aud: "https://oauth2.googleapis.com/token",
    iat: now, exp: now + 3600,
  }));
  const signature = b64url(crypto.createSign("RSA-SHA256").update(`${header}.${claim}`).sign(sa.private_key));
  const assertion = `${header}.${claim}.${signature}`;

  try {
    const res = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `grant_type=${encodeURIComponent("urn:ietf:params:oauth:grant-type:jwt-bearer")}&assertion=${assertion}`,
    });
    const j = await res.json();
    if (!res.ok || !j.access_token) return null;
    tokenCache = { token: j.access_token, exp: now + (j.expires_in ?? 3600) };
    return j.access_token;
  } catch {
    return null;
  }
}

export type Ga4Report = {
  totals: { pageViews: number; users: number; sessions: number };
  topPages: { path: string; views: number }[];
};

export async function fetchGa4(propertyId: string): Promise<Ga4Report | null> {
  const token = await getToken();
  if (!token || !propertyId) return null;
  const url = `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId.replace(/[^0-9]/g, "")}:runReport`;
  const auth = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
  try {
    const [totalsRes, pagesRes] = await Promise.all([
      fetch(url, { method: "POST", headers: auth, body: JSON.stringify({ dateRanges: [{ startDate: "28daysAgo", endDate: "today" }], metrics: [{ name: "screenPageViews" }, { name: "activeUsers" }, { name: "sessions" }] }) }),
      fetch(url, { method: "POST", headers: auth, body: JSON.stringify({ dateRanges: [{ startDate: "28daysAgo", endDate: "today" }], dimensions: [{ name: "pagePath" }], metrics: [{ name: "screenPageViews" }], orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }], limit: 8 }) }),
    ]);
    if (!totalsRes.ok) return null;
    const t = await totalsRes.json();
    const p = pagesRes.ok ? await pagesRes.json() : { rows: [] };
    const tvals = t.rows?.[0]?.metricValues ?? [];
    return {
      totals: { pageViews: Number(tvals[0]?.value ?? 0), users: Number(tvals[1]?.value ?? 0), sessions: Number(tvals[2]?.value ?? 0) },
      topPages: (p.rows ?? []).map((r: { dimensionValues: { value: string }[]; metricValues: { value: string }[] }) => ({ path: r.dimensionValues[0].value, views: Number(r.metricValues[0].value) })),
    };
  } catch {
    return null;
  }
}

export type GscReport = {
  totals: { clicks: number; impressions: number; ctr: number; position: number };
  topQueries: { query: string; clicks: number; impressions: number; ctr: number; position: number }[];
};

export async function fetchGsc(siteUrl: string): Promise<GscReport | null> {
  const token = await getToken();
  if (!token || !siteUrl) return null;
  // domain properties use "sc-domain:example.com"; URL-prefix uses the full URL
  const site = siteUrl.startsWith("http") || siteUrl.startsWith("sc-domain:") ? siteUrl : `sc-domain:${siteUrl}`;
  const url = `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(site)}/searchAnalytics/query`;
  const auth = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
  const end = new Date().toISOString().slice(0, 10);
  const start = new Date(Date.now() - 28 * 86400000).toISOString().slice(0, 10);
  try {
    const [totalsRes, qRes] = await Promise.all([
      fetch(url, { method: "POST", headers: auth, body: JSON.stringify({ startDate: start, endDate: end }) }),
      fetch(url, { method: "POST", headers: auth, body: JSON.stringify({ startDate: start, endDate: end, dimensions: ["query"], rowLimit: 10 }) }),
    ]);
    if (!totalsRes.ok) return null;
    const t = await totalsRes.json();
    const q = qRes.ok ? await qRes.json() : { rows: [] };
    const row = t.rows?.[0] ?? { clicks: 0, impressions: 0, ctr: 0, position: 0 };
    return {
      totals: { clicks: row.clicks ?? 0, impressions: row.impressions ?? 0, ctr: row.ctr ?? 0, position: row.position ?? 0 },
      topQueries: (q.rows ?? []).map((r: { keys: string[]; clicks: number; impressions: number; ctr: number; position: number }) => ({ query: r.keys[0], clicks: r.clicks, impressions: r.impressions, ctr: r.ctr, position: r.position })),
    };
  } catch {
    return null;
  }
}
