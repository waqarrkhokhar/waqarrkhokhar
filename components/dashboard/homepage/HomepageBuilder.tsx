"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Field, Input, Textarea, Select } from "@/components/ui/Field";
import { useToast } from "@/components/ui/Toast";
import { apiGet, apiSend } from "@/lib/api/client";
import ProductPinPicker from "./ProductPinPicker";

type Slide = { image: string; subtitle: string; title: string; desc: string; cta: string; link: string };
type Client = { name: string; href: string; type: string };
type WhyItem = { icon: string; title: string; desc: string };
type HowStep = { step: string; title: string; desc: string };

type Config = {
  section_order: string[];
  hero_slides: Slide[];
  trusted_by: Client[];
  trending_mode: "auto" | "manual";
  pinned_trending: string[];
  offers_mode: "auto" | "manual";
  pinned_offers: string[];
  why_items: WhyItem[];
  how_steps: HowStep[];
};

const ALL_SECTIONS: { key: string; label: string }[] = [
  { key: "hero", label: "Hero Slider" },
  { key: "trusted_by", label: "Trusted By" },
  { key: "categories", label: "Shop by Category" },
  { key: "trending", label: "Trending Now" },
  { key: "offers", label: "Limited-Time Offers" },
  { key: "why", label: "Why ComfyClub" },
  { key: "how_it_works", label: "How It Works" },
  { key: "cta", label: "Need Help CTA" },
];

const DEFAULT: Config = {
  section_order: ALL_SECTIONS.map((s) => s.key),
  hero_slides: [],
  trusted_by: [],
  trending_mode: "auto",
  pinned_trending: [],
  offers_mode: "auto",
  pinned_offers: [],
  why_items: [],
  how_steps: [],
};

function move<T>(arr: T[], i: number, dir: -1 | 1): T[] {
  const j = i + dir;
  if (j < 0 || j >= arr.length) return arr;
  const next = [...arr];
  [next[i], next[j]] = [next[j], next[i]];
  return next;
}

/** Generic editor for an array of flat objects. */
function ListEditor<T extends Record<string, string>>({
  items,
  fields,
  blank,
  onChange,
  addLabel,
}: {
  items: T[];
  fields: { key: keyof T; label: string; textarea?: boolean }[];
  blank: T;
  onChange: (items: T[]) => void;
  addLabel: string;
}) {
  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={i} className="rounded-xl border border-line p-3 dark:border-white/10">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs text-charcoal/50 dark:text-cream/50">#{i + 1}</span>
            <div className="flex gap-2 text-xs">
              <button onClick={() => onChange(move(items, i, -1))}>▲</button>
              <button onClick={() => onChange(move(items, i, 1))}>▼</button>
              <button
                onClick={() => onChange(items.filter((_, x) => x !== i))}
                className="text-red-500"
              >
                Remove
              </button>
            </div>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {fields.map((f) => (
              <Field key={String(f.key)} label={f.label}>
                {f.textarea ? (
                  <Textarea
                    value={item[f.key]}
                    onChange={(e) =>
                      onChange(items.map((it, x) => (x === i ? { ...it, [f.key]: e.target.value } : it)))
                    }
                  />
                ) : (
                  <Input
                    value={item[f.key]}
                    onChange={(e) =>
                      onChange(items.map((it, x) => (x === i ? { ...it, [f.key]: e.target.value } : it)))
                    }
                  />
                )}
              </Field>
            ))}
          </div>
        </div>
      ))}
      <Button size="sm" variant="secondary" onClick={() => onChange([...items, { ...blank }])}>
        + {addLabel}
      </Button>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-line bg-white shadow-card p-5 dark:border-white/10 dark:bg-white/5">
      <h3 className="mb-3 font-heading text-lg font-semibold">{title}</h3>
      {children}
    </section>
  );
}

export default function HomepageBuilder() {
  const toast = useToast();
  const [cfg, setCfg] = useState<Config>(DEFAULT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    apiGet<{ data: Record<string, unknown> }>("/api/settings").then((r) => {
      setLoading(false);
      if (!r.ok) return toast.error(r.error);
      const hc = (r.data.data.homepage_config ?? {}) as Partial<Config>;
      setCfg({ ...DEFAULT, ...hc });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const upd = <K extends keyof Config>(k: K, v: Config[K]) => setCfg((c) => ({ ...c, [k]: v }));

  const visible = cfg.section_order.filter((k) => ALL_SECTIONS.some((s) => s.key === k));
  const hidden = ALL_SECTIONS.filter((s) => !visible.includes(s.key));
  const label = (key: string) => ALL_SECTIONS.find((s) => s.key === key)?.label ?? key;

  async function save() {
    setSaving(true);
    const res = await apiSend("/api/settings", "PATCH", { key: "homepage_config", value: cfg });
    setSaving(false);
    if (!res.ok) return toast.error(res.error);
    toast.success("Homepage saved");
  }

  if (loading) return <p className="text-sm text-charcoal/60 dark:text-cream/60">Loading…</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-2xl font-semibold">Homepage Builder</h2>
        <Button size="sm" loading={saving} onClick={save}>Save changes</Button>
      </div>

      <Section title="Sections (order & visibility)">
        <ul className="space-y-2">
          {visible.map((key, i) => (
            <li key={key} className="flex items-center justify-between rounded-lg border border-line px-3 py-2 text-sm dark:border-white/10">
              <span>{label(key)}</span>
              <div className="flex gap-2 text-xs">
                <button onClick={() => upd("section_order", move(visible, i, -1))}>▲</button>
                <button onClick={() => upd("section_order", move(visible, i, 1))}>▼</button>
                <button onClick={() => upd("section_order", visible.filter((k) => k !== key))} className="text-red-500">
                  Hide
                </button>
              </div>
            </li>
          ))}
        </ul>
        {hidden.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {hidden.map((s) => (
              <button
                key={s.key}
                onClick={() => upd("section_order", [...visible, s.key])}
                className="rounded-full border border-dashed border-black/20 px-3 py-1 text-xs text-charcoal/60 hover:border-gold dark:border-white/20 dark:text-cream/60"
              >
                + Show {s.label}
              </button>
            ))}
          </div>
        )}
      </Section>

      <Section title="Hero Slides">
        <ListEditor
          items={cfg.hero_slides}
          onChange={(v) => upd("hero_slides", v)}
          addLabel="Add slide"
          blank={{ image: "", subtitle: "", title: "", desc: "", cta: "", link: "" }}
          fields={[
            { key: "image", label: "Image URL" },
            { key: "link", label: "Link (e.g. /sofas/sofa-chair/)" },
            { key: "subtitle", label: "Subtitle" },
            { key: "title", label: "Title" },
            { key: "desc", label: "Description", textarea: true },
            { key: "cta", label: "Button text" },
          ]}
        />
      </Section>

      <Section title="Trusted By">
        <ListEditor
          items={cfg.trusted_by}
          onChange={(v) => upd("trusted_by", v)}
          addLabel="Add client"
          blank={{ name: "", href: "", type: "" }}
          fields={[
            { key: "name", label: "Name" },
            { key: "href", label: "Link" },
            { key: "type", label: "Type (e.g. Real Estate)" },
          ]}
        />
      </Section>

      <Section title="Trending Now">
        <Field label="Mode">
          <Select value={cfg.trending_mode} onChange={(e) => upd("trending_mode", e.target.value as "auto" | "manual")}>
            <option value="auto">Automatic (random featured)</option>
            <option value="manual">Manual (pin specific products)</option>
          </Select>
        </Field>
        {cfg.trending_mode === "manual" && (
          <div className="mt-3">
            <ProductPinPicker ids={cfg.pinned_trending} onChange={(v) => upd("pinned_trending", v)} />
          </div>
        )}
      </Section>

      <Section title="Limited-Time Offers">
        <Field label="Mode">
          <Select value={cfg.offers_mode} onChange={(e) => upd("offers_mode", e.target.value as "auto" | "manual")}>
            <option value="auto">Automatic (highest discounts)</option>
            <option value="manual">Manual (pin specific products)</option>
          </Select>
        </Field>
        {cfg.offers_mode === "manual" && (
          <div className="mt-3">
            <ProductPinPicker ids={cfg.pinned_offers} onChange={(v) => upd("pinned_offers", v)} />
          </div>
        )}
      </Section>

      <Section title="Why ComfyClub">
        <ListEditor
          items={cfg.why_items}
          onChange={(v) => upd("why_items", v)}
          addLabel="Add item"
          blank={{ icon: "", title: "", desc: "" }}
          fields={[
            { key: "icon", label: "Icon name" },
            { key: "title", label: "Title" },
            { key: "desc", label: "Description", textarea: true },
          ]}
        />
      </Section>

      <Section title="How It Works">
        <ListEditor
          items={cfg.how_steps}
          onChange={(v) => upd("how_steps", v)}
          addLabel="Add step"
          blank={{ step: "", title: "", desc: "" }}
          fields={[
            { key: "step", label: "Step number" },
            { key: "title", label: "Title" },
            { key: "desc", label: "Description", textarea: true },
          ]}
        />
      </Section>
    </div>
  );
}
