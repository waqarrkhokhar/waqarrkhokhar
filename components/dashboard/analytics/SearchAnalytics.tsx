"use client";

import { useEffect, useState } from "react";
import { DashPageHeader, DashCard, DashBadge } from "@/components/dashboard/shared/Dash";
import { DashTable, type Column } from "@/components/dashboard/shared/DashTable";
import { apiGet } from "@/lib/api/client";

type SearchStats = { total: number; top: { query: string; count: number }[]; zero_result: { query: string; count: number }[] };
type Term = { query: string; count: number; noResult: boolean };

export default function SearchAnalytics() {
  const [stats, setStats] = useState<SearchStats | null>(null);

  useEffect(() => {
    apiGet<{ data: SearchStats }>("/api/search/analytics").then((r) => r.ok && setStats(r.data.data));
  }, []);

  const zeroSet = new Set((stats?.zero_result ?? []).map((z) => z.query));
  const terms: Term[] = [
    ...(stats?.top ?? []).map((t) => ({ query: t.query, count: t.count, noResult: zeroSet.has(t.query) })),
    ...(stats?.zero_result ?? []).filter((z) => !(stats?.top ?? []).some((t) => t.query === z.query)).map((z) => ({ query: z.query, count: z.count, noResult: true })),
  ].sort((a, b) => b.count - a.count);

  const uniqueTerms = terms.length;
  const noResultCount = terms.filter((t) => t.noResult).length;
  const noResultPct = uniqueTerms ? Math.round((noResultCount / uniqueTerms) * 100) : 0;

  const columns: Column<Term>[] = [
    { key: "query", header: "Search Term", render: (t) => <span className="font-medium">{t.query}</span> },
    { key: "count", header: "Searches", render: (t) => t.count },
    { key: "status", header: "Status", render: (t) => t.noResult ? <DashBadge status="error" label="No Results" /> : <DashBadge status="active" label="Has Results" /> },
  ];

  return (
    <div>
      <DashPageHeader title="Search Analytics" subtitle="What visitors search for on your storefront"
        breadcrumbs={[{ label: "Analytics" }, { label: "Search Analytics" }]} />

      <div className="mb-5 grid grid-cols-1 gap-3.5 sm:grid-cols-3">
        <DashCard label="Total Searches" value={stats?.total ?? "-"} icon="🔍" tint="bg-gold/15" />
        <DashCard label="Unique Terms" value={uniqueTerms || "-"} icon="📝" tint="bg-blue-100" />
        <DashCard label="No-Result Searches" value={`${noResultPct}%`} icon="⚠️" tint="bg-amber-100" />
      </div>

      <DashTable columns={columns} rows={terms} getId={(t) => t.query}
        emptyTitle="No searches logged yet" emptyDescription="Searches from your storefront's search box will appear here." />
    </div>
  );
}
