"use client";

import { useState } from "react";
import { DashPageHeader, DashTabs } from "@/components/dashboard/shared/Dash";
import RedirectManager from "./RedirectManager";
import Monitor404 from "./Monitor404";

type Tab = "redirects" | "monitor";

export default function RedirectsPage() {
  const [tab, setTab] = useState<Tab>("redirects");
  return (
    <div>
      <DashPageHeader title="Redirect Manager" subtitle="URL redirects for migration & SEO, plus the 404 monitor"
        breadcrumbs={[{ label: "SEO" }, { label: "Redirects" }]} />
      <DashTabs<Tab>
        tabs={[{ id: "redirects", label: "Redirects" }, { id: "monitor", label: "404 Monitor" }]}
        active={tab}
        onChange={setTab}
      />
      {tab === "redirects" ? <RedirectManager /> : <Monitor404 />}
    </div>
  );
}
