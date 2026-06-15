"use client";

import { useEffect, useState } from "react";
import { DashPageHeader, DashSection } from "@/components/dashboard/shared/Dash";
import { useToast } from "@/components/ui/Toast";

type Mode = "light" | "dark";
const OPTIONS: { id: Mode; label: string; desc: string; preview: { bg: string; card: string; bar: string } }[] = [
  { id: "light", label: "Light Mode", desc: "Bright, clean interface", preview: { bg: "#f5f6fa", card: "#fff", bar: "#0F1D35" } },
  { id: "dark", label: "Dark Mode", desc: "Easy on the eyes in low light", preview: { bg: "#0e1320", card: "#191f2e", bar: "#0a0f1a" } },
];

export default function ThemeSettings() {
  const toast = useToast();
  const [mode, setMode] = useState<Mode>("light");

  useEffect(() => {
    const stored = (localStorage.getItem("cc-theme") as Mode) || "light";
    setMode(stored);
    document.documentElement.classList.toggle("dark", stored === "dark");
  }, []);

  function pick(m: Mode) {
    setMode(m);
    document.documentElement.classList.toggle("dark", m === "dark");
    localStorage.setItem("cc-theme", m);
    toast.success(`${m === "dark" ? "Dark" : "Light"} mode enabled`);
  }

  return (
    <div>
      <DashPageHeader title="Theme & Display" subtitle="Customize how the dashboard looks on this device"
        breadcrumbs={[{ label: "Appearance" }, { label: "Theme & Display" }]} />
      <DashSection title="Color Mode" subtitle="Your preference is saved on this device">
        <div className="grid max-w-2xl gap-4 sm:grid-cols-2">
          {OPTIONS.map((opt) => (
            <button key={opt.id} onClick={() => pick(opt.id)}
              className={`overflow-hidden rounded-xl border-2 text-left transition ${mode === opt.id ? "border-gold" : "border-line dark:border-white/10"}`}>
              <div className="flex gap-1.5 p-2" style={{ height: 90, background: opt.preview.bg }}>
                <div className="w-7 rounded" style={{ background: opt.preview.bar }} />
                <div className="flex flex-1 flex-col gap-1.5">
                  <div className="h-3.5 rounded" style={{ background: opt.preview.card }} />
                  <div className="h-7 rounded" style={{ background: opt.preview.card }} />
                  <div className="flex gap-1"><div className="h-2 w-5 rounded bg-gold" /><div className="h-2 flex-1 rounded" style={{ background: opt.preview.card }} /></div>
                </div>
              </div>
              <div className="flex items-center justify-between px-3.5 py-3">
                <div>
                  <div className="text-sm font-semibold text-charcoal dark:text-cream">{opt.label}</div>
                  <div className="text-xs text-muted">{opt.desc}</div>
                </div>
                <div className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${mode === opt.id ? "border-gold bg-gold" : "border-line"}`}>
                  {mode === opt.id && <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3"><path d="M20 6L9 17l-5-5" /></svg>}
                </div>
              </div>
            </button>
          ))}
        </div>
      </DashSection>
    </div>
  );
}
