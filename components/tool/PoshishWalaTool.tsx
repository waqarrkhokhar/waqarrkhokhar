"use client";

/**
 * Poshish Wala — Business Management Tool
 *
 * A self-contained, client-side tool for the Poshish Wala × Comfy Club
 * upholstery business (Lahore): track clients/jobs, record payments and
 * expenses, and build print-ready quotations and invoices for either brand.
 *
 * Faithful implementation of the Claude Design prototype
 * (`PoshishWala.dc.html`). All data lives in the browser via localStorage —
 * there is no server component to this tool. The prototype's own template
 * runtime (support.js / DCLogic) is replaced with React state; layout,
 * colours, spacing, copy and behaviour are reproduced exactly.
 */

import { useEffect, useMemo, useRef, useState } from "react";

/* ----------------------------- types ----------------------------- */

type Payment = { label: string; amount: number; date?: string };
type Cost = { label: string; amount: number; category?: string; date?: string };
type Brand = "Poshish Wala" | "Comfy Club";
type Client = {
  id: string;
  name: string;
  area?: string;
  phone?: string;
  work?: string;
  total: number | null;
  brand: Brand;
  status?: JobStatus;
  done?: boolean;
  payments: Payment[];
  costs: Cost[];
};
type JobStatus = "pending" | "progress" | "complete";
type Screen =
  | "dashboard"
  | "customers"
  | "detail"
  | "expenses"
  | "reports"
  | "quote"
  | "invoice";
type ModalKind = "new" | "pay" | "cost" | "edit" | null;
type QuoteItem = { desc: string; unitPrice: string; qty: string };
type Quote = {
  brand: Brand;
  number: string;
  to: string;
  for: string;
  client: { name: string; area: string; phone: string };
  items: QuoteItem[];
  terms: { work: string; payment: string; delivery: string };
  valid: string;
};

const CSS = (s: React.CSSProperties) => s; // tiny helper for readability

/* --------------------------- constants --------------------------- */

const KEY = "poshishwala:app";

const SEED: Client[] = [
  {
    id: "uzma",
    name: "Uzma",
    area: "DHA Phase 8",
    phone: "+92 328 3777768",
    work: "5-seater sofa + single chair",
    total: 42300,
    brand: "Poshish Wala",
    status: "complete",
    done: true,
    payments: [
      { label: "Advance", amount: 21000 },
      { label: "Received", amount: 21300 },
    ],
    costs: [
      { label: "Sent for fabric", amount: 10150 },
      { label: "Velvet fabric", amount: 2500 },
      { label: "Raw material", amount: 950 },
      { label: "Yango fare", amount: 550 },
      { label: "Imran team labour", amount: 8200, category: "Labour" },
      { label: "Labour Shoaib", amount: 5000, category: "Labour" },
    ],
  },
  {
    id: "shahzad",
    name: "Shahzad Ali",
    area: "Gulberg, Qaddafi Stadium",
    phone: "+92 321 2657815",
    work: "Sofa reupholstery",
    total: 111500,
    brand: "Poshish Wala",
    status: "pending",
    payments: [{ label: "Received", amount: 60000 }],
    costs: [
      { label: "Wood work", amount: 2100 },
      { label: "Raw material", amount: 39680 },
      { label: "InDrive fare", amount: 2160 },
      { label: "Velvet fabric", amount: 8500 },
      { label: "Leather fabric", amount: 4500 },
      { label: "Kapra, 5 ghaz extra", amount: 2125 },
      { label: "Petrol (Mahboob)", amount: 500 },
      { label: "Seating foam", amount: 1300 },
    ],
  },
  {
    id: "afnan",
    name: "Afnan Naqvi",
    area: "Sabzazar",
    phone: "+92 331 7845121",
    work: "Sofa set",
    total: 30000,
    brand: "Poshish Wala",
    status: "complete",
    done: true,
    payments: [
      { label: "Received", amount: 15000 },
      { label: "Received", amount: 15000 },
    ],
    costs: [
      { label: "Material", amount: 15880, category: "Material" },
      { label: "Labour", amount: 8000, category: "Labour" },
    ],
  },
  {
    id: "tayba",
    name: "Tayba Salon",
    area: "Aitchison Society",
    phone: "0311 6384706",
    work: "Lips shape sofa 2+2",
    total: 65000,
    brand: "Comfy Club",
    status: "progress",
    payments: [{ label: "Received", amount: 25000 }],
    costs: [
      { label: "Sent for wood frame", amount: 12000 },
      { label: "Remaining frame payment", amount: 4500 },
    ],
  },
  {
    id: "waqas",
    name: "Waqas Cheema",
    area: "Valencia",
    phone: "+92 321 6017443",
    work: "Recliner",
    total: 21000,
    brand: "Poshish Wala",
    status: "complete",
    done: true,
    payments: [{ label: "Received", amount: 9000 }],
    costs: [
      { label: "Recliner", amount: 12000 },
      { label: "Labour", amount: 12000, category: "Labour" },
    ],
  },
  {
    id: "ahmed",
    name: "Ahmed Anwaar",
    area: "Faisal Anwaar",
    phone: "03124316456",
    work: "Recliner",
    brand: "Poshish Wala",
    total: 36000,
    status: "pending",
    payments: [{ label: "Received", amount: 18000 }],
    costs: [],
  },
  {
    id: "sana",
    name: "Miss Sana DC",
    area: "DHA Phase 6",
    phone: "03228455440",
    work: "6 seater + 5 seater sofa",
    brand: "Poshish Wala",
    total: 75500,
    status: "pending",
    payments: [],
    costs: [],
  },
  {
    id: "adeel1",
    name: "Adeel Sahab",
    area: "Pak Fazia, Raiwind Road",
    phone: "03143158576",
    work: "Recliner",
    brand: "Poshish Wala",
    total: 21000,
    status: "pending",
    payments: [],
    costs: [],
  },
  {
    id: "adeel2",
    name: "Adeel Sahab",
    area: "Pak Fazia, Raiwind Road",
    phone: "03143158576",
    work: "8 dining table chairs + 6 seater sofa",
    brand: "Poshish Wala",
    total: 38800,
    status: "pending",
    payments: [{ label: "Received", amount: 10000 }],
    costs: [],
  },
  {
    id: "mina",
    name: "Mina",
    area: "DHA Phase 7",
    phone: "03024091643",
    work: "L shape sofa + divaan + 3 seater sofa",
    brand: "Poshish Wala",
    total: 76000,
    status: "pending",
    payments: [],
    costs: [],
  },
];

const STAT: Record<JobStatus, { label: string; css: React.CSSProperties }> = {
  pending: {
    label: "Pending",
    css: { border: "1px solid #cfd4da", background: "#eef0f2", color: "#5a6069" },
  },
  progress: {
    label: "In progress",
    css: { border: "1px solid #d8b95a", background: "#f7efd6", color: "#8a6d1f" },
  },
  complete: {
    label: "Completed",
    css: { border: "1px solid #1f7a6d", background: "#1f7a6d", color: "#fff" },
  },
};

const CATEGORY_OPTS = [
  "Material",
  "Fabric",
  "Wood work",
  "Foam",
  "Labour",
  "Transport",
  "Other",
];
const BRAND_OPTS: Brand[] = ["Poshish Wala", "Comfy Club"];

/* --------------------------- pure helpers --------------------------- */

function todayStr(): string {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, "0");
  return (
    d.getFullYear() +
    "-" +
    p(d.getMonth() + 1) +
    "-" +
    p(d.getDate()) +
    "T" +
    p(d.getHours()) +
    ":" +
    p(d.getMinutes())
  );
}

function dateText(d?: string): string {
  if (!d) return "";
  try {
    const dt = new Date(d.length <= 10 ? d + "T00:00" : d);
    const hasTime = d.length > 10;
    return (
      dt.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }) +
      (hasTime
        ? ", " +
          dt.toLocaleTimeString("en-GB", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          })
        : "")
    );
  } catch {
    return d;
  }
}

const rs = (n: number | null | undefined) =>
  "Rs " + Number(n || 0).toLocaleString("en-PK");
const sum = (a?: { amount: number }[]) =>
  (a || []).reduce((t, x) => t + Number(x.amount || 0), 0);

function fig(j: Client) {
  const received = sum(j.payments);
  const spent = sum(j.costs);
  const due = j.total == null ? null : j.total - received;
  return { received, spent, due, inHand: received - spent };
}

function initials(n?: string) {
  return (n || "?")
    .trim()
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

const jobStatus = (j: Client): JobStatus =>
  j.status || (j.done ? "complete" : "pending");

/* ----------------------------- component ----------------------------- */

export default function PoshishWalaTool() {
  const [clients, setClients] = useState<Client[]>(SEED);
  const [screen, setScreen] = useState<Screen>("dashboard");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [modal, setModal] = useState<ModalKind>(null);
  const [docType, setDocType] = useState<"invoice" | "quote">("invoice");
  const [quote, setQuote] = useState<Quote>({
    brand: "Poshish Wala",
    number: "",
    to: "",
    for: "",
    client: { name: "", area: "", phone: "" },
    items: [{ desc: "", unitPrice: "", qty: "1" }],
    terms: {
      work: "Includes fabric, foam, wood work, labour and finishing as per the selection agreed. Any change in design, size or material may revise the final price.",
      payment:
        "50% advance to begin work, remaining 50% on delivery. Advance is non-refundable once material is purchased.",
      delivery:
        "Estimated 7–10 working days from confirmation of advance. Free delivery within Lahore.",
    },
    valid: "This quotation is valid for 15 days from the date above.",
  });

  const loaded = useRef(false);

  // Load saved data on the client (guards SSR / avoids hydration mismatch).
  useEffect(() => {
    if (loaded.current) return;
    loaded.current = true;
    let saved: Client[] | null = null;
    try {
      const r = localStorage.getItem(KEY);
      if (r) saved = JSON.parse(r);
    } catch {
      /* ignore */
    }
    if (!saved) {
      for (let v = 10; v >= 1; v--) {
        try {
          const r = localStorage.getItem("poshishwala:app:v" + v);
          if (r) {
            saved = JSON.parse(r);
            break;
          }
        } catch {
          /* ignore */
        }
      }
    }
    if (!saved) return;
    const ids = new Set(saved.map((j) => j.id));
    const merged = [...saved, ...SEED.filter((j) => !ids.has(j.id))];
    if (merged.length !== saved.length) persist(merged);
    setClients(merged);
  }, []);

  function persist(c: Client[]) {
    try {
      localStorage.setItem(KEY, JSON.stringify(c));
    } catch {
      /* ignore */
    }
  }
  function mutate(fn: (c: Client[]) => Client[]) {
    setClients((prev) => {
      const next = fn(prev);
      persist(next);
      return next;
    });
  }

  /* ------------------------- navigation ------------------------- */

  function go(s: Screen) {
    setScreen(s);
    setModal(null);
    setQuery("");
    if (typeof window !== "undefined") window.scrollTo(0, 0);
  }
  function openDoc(id: string, dt: "invoice" | "quote") {
    setScreen("invoice");
    setSelectedId(id);
    setDocType(dt);
    setModal(null);
    if (typeof window !== "undefined") window.scrollTo(0, 0);
  }
  function openDetail(id: string) {
    setScreen("detail");
    setSelectedId(id);
    setModal(null);
    if (typeof window !== "undefined") window.scrollTo(0, 0);
  }
  const printDoc = () => {
    if (typeof window !== "undefined") window.print();
  };

  /* --------------------- uncontrolled field reads --------------------- */

  const val = (id: string) => {
    const e = document.getElementById(id) as HTMLInputElement | HTMLSelectElement | null;
    return e ? e.value.trim() : "";
  };
  const numval = (id: string): number | null => {
    const e = document.getElementById(id) as HTMLInputElement | null;
    if (!e || e.value === "") return null;
    const n = parseFloat(e.value);
    return isNaN(n) ? null : n;
  };

  /* --------------------------- mutations --------------------------- */

  function saveNew() {
    const name = val("nj-name");
    if (!name) {
      document.getElementById("nj-name")?.focus();
      return;
    }
    const adv = numval("nj-adv");
    const client: Client = {
      id: "c" + Date.now(),
      name,
      area: val("nj-area"),
      phone: val("nj-phone"),
      work: val("nj-work"),
      brand: (val("nj-brand") as Brand) || "Poshish Wala",
      total: numval("nj-total"),
      payments: adv != null ? [{ label: "Advance", amount: adv }] : [],
      costs: [],
    };
    mutate((c) => [...c, client]);
    setModal(null);
  }
  function savePay() {
    const a = numval("pay-amt");
    if (a == null) {
      document.getElementById("pay-amt")?.focus();
      return;
    }
    const id = val("pay-client");
    const l = val("pay-label") || "Received";
    const date = val("pay-date") || todayStr();
    mutate((c) =>
      c.map((j) =>
        j.id === id ? { ...j, payments: [...j.payments, { label: l, amount: a, date }] } : j
      )
    );
    setModal(null);
  }
  function saveCost() {
    const a = numval("cost-amt");
    if (a == null) {
      document.getElementById("cost-amt")?.focus();
      return;
    }
    const id = val("cost-client");
    const cat = val("cost-cat") || "Other";
    const l = val("cost-label") || cat;
    const date = val("cost-date") || todayStr();
    mutate((c) =>
      c.map((j) =>
        j.id === id
          ? { ...j, costs: [...j.costs, { label: l, amount: a, category: cat, date }] }
          : j
      )
    );
    setModal(null);
  }
  function saveEdit() {
    const id = selectedId;
    const name = val("ed-name");
    mutate((c) =>
      c.map((j) =>
        j.id === id
          ? {
              ...j,
              name: name || j.name,
              area: val("ed-area"),
              phone: val("ed-phone"),
              work: val("ed-work"),
              brand: (val("ed-brand") as Brand) || j.brand,
              total: numval("ed-total"),
            }
          : j
      )
    );
    setModal(null);
  }
  function removeLine(id: string, kind: "pay" | "cost", idx: number) {
    mutate((c) =>
      c.map((j) => {
        if (j.id !== id) return j;
        const key = kind === "pay" ? "payments" : "costs";
        const arr = [...j[key]];
        arr.splice(idx, 1);
        return { ...j, [key]: arr };
      })
    );
  }
  function del(id: string | null) {
    if (id == null) return;
    if (
      typeof window !== "undefined" &&
      !window.confirm("Delete this client and all their entries?")
    )
      return;
    mutate((c) => c.filter((j) => j.id !== id));
    setScreen("customers");
    setSelectedId(null);
    setModal(null);
  }
  function setStatus(id: string, st: JobStatus) {
    mutate((c) =>
      c.map((j) => (j.id === id ? { ...j, status: st, done: st === "complete" } : j))
    );
  }

  /* --------------------------- quote state --------------------------- */

  const setQBrand = (b: Brand) => setQuote((q) => ({ ...q, brand: b }));
  const setQClient = (k: keyof Quote["client"], v: string) =>
    setQuote((q) => ({ ...q, client: { ...q.client, [k]: v } }));
  const setQTerm = (k: keyof Quote["terms"], v: string) =>
    setQuote((q) => ({ ...q, terms: { ...q.terms, [k]: v } }));
  const setQField = (k: "number" | "to" | "for" | "valid", v: string) =>
    setQuote((q) => ({ ...q, [k]: v }));
  const setQItem = (i: number, k: keyof QuoteItem, v: string) =>
    setQuote((q) => ({
      ...q,
      items: q.items.map((it, idx) => (idx === i ? { ...it, [k]: v } : it)),
    }));
  const addQItem = () =>
    setQuote((q) => ({ ...q, items: [...q.items, { desc: "", unitPrice: "", qty: "1" }] }));
  const removeQItem = (i: number) =>
    setQuote((q) => ({
      ...q,
      items: q.items.length > 1 ? q.items.filter((_, idx) => idx !== i) : q.items,
    }));

  /* --------------------------- derived views --------------------------- */

  function view(j: Client) {
    const f = fig(j);
    const settled = j.total != null && (f.due ?? 0) <= 0;
    const base = j.total != null ? j.total : f.received;
    const profit = base - f.spent;
    const st = jobStatus(j);
    const border = j.total == null ? "#c9a94a" : settled ? "#1f7a6d" : "#c15b4a";
    const color = j.total == null ? "#8a6d1f" : settled ? "#1f7a6d" : "#c15b4a";
    const badgeBase: React.CSSProperties = {
      padding: "4px 11px",
      fontSize: 11,
      fontWeight: 600,
      borderRadius: 20,
      whiteSpace: "nowrap",
    };
    return {
      id: j.id,
      name: j.name,
      area: j.area || "",
      work: j.work || "",
      phone: j.phone || "—",
      telHref: "tel:" + String(j.phone || "").replace(/\s/g, ""),
      initials: initials(j.name),
      meta: [j.area, j.work].filter(Boolean).join(" · ") || "No details yet",
      status: st,
      statusText: STAT[st].label,
      statusStyle: { ...badgeBase, ...STAT[st].css },
      payStatusText:
        j.total == null
          ? "no price set"
          : settled
          ? "paid in full"
          : rs(f.due) + " due",
      payStatusStyle: CSS({
        padding: "3px 10px",
        fontSize: 11,
        fontWeight: 500,
        borderRadius: 20,
        whiteSpace: "nowrap",
        border: "1px solid " + border,
        color,
      }),
      statusBtns: (["pending", "progress", "complete"] as JobStatus[]).map((k) => ({
        key: k,
        label: STAT[k].label,
        onClick: () => setStatus(j.id, k),
        style: CSS({
          flex: 1,
          padding: 9,
          borderRadius: 8,
          cursor: "pointer",
          fontSize: 12,
          fontWeight: 600,
          ...(st === k
            ? STAT[k].css
            : { border: "1px solid #d7dbe0", background: "#fff", color: "#8b9199" }),
        }),
      })),
      totalText: j.total == null ? "not set" : rs(j.total),
      totalNum: j.total == null ? "" : String(j.total),
      brand: j.brand || "Poshish Wala",
      brandStyle: CSS({
        fontSize: 10,
        fontWeight: 600,
        borderRadius: 20,
        padding: "3px 9px",
        whiteSpace: "nowrap",
        ...(j.brand === "Comfy Club"
          ? { color: "#7a4fa0", background: "#efe7f7" }
          : { color: "#1f7a6d", background: "#e7ece9" }),
      }),
      profitText: rs(profit),
      profit,
      profitStyle: CSS({ fontWeight: 600, color: profit < 0 ? "#c15b4a" : "#1f7a6d" }),
      receivedText: rs(f.received),
      spentText: rs(f.spent),
      dueText: j.total == null ? "—" : rs(Math.max(f.due ?? 0, 0)),
      inHandText: rs(f.inHand),
      inHandStyle: CSS({ fontWeight: 600, color: f.inHand < 0 ? "#c15b4a" : "#1f7a6d" }),
      hasBalance: st !== "complete" && j.total != null && (f.due ?? 0) > 0,
      dueAmt: j.total == null ? 0 : Math.max(f.due ?? 0, 0),
      received: f.received,
      spent: f.spent,
      payments: (j.payments || []).map((p, i) => ({
        label: p.label,
        amtText: rs(p.amount),
        dateText: dateText(p.date),
        hasDate: !!p.date,
        onRemove: () => removeLine(j.id, "pay", i),
      })),
      costs: (j.costs || []).map((c, i) => ({
        label: c.label,
        amtText: rs(c.amount),
        catText: c.category || "",
        hasCat: !!c.category,
        dateText: dateText(c.date),
        hasDate: !!c.date,
        onRemove: () => removeLine(j.id, "cost", i),
      })),
      onOpen: () => openDetail(j.id),
      raw: j,
    };
  }

  const views = useMemo(
    () => clients.map(view),
    // `view` is a stable closure over component state; only `clients` matters.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [clients]
  );

  const totals = useMemo(() => {
    let billed = 0,
      received = 0,
      outstanding = 0,
      spent = 0;
    clients.forEach((j) => {
      const f = fig(j);
      received += f.received;
      spent += f.spent;
      if (j.total != null) {
        billed += j.total;
        outstanding += Math.max(f.due ?? 0, 0);
      }
    });
    return { billed, received, outstanding, spent, inHand: received - spent };
  }, [clients]);

  const q = query.toLowerCase();
  const filtered = q
    ? views.filter((v) =>
        (v.name + " " + v.area + " " + v.phone).toLowerCase().includes(q)
      )
    : views;
  const dueList = views.filter((v) => v.hasBalance).sort((a, b) => b.dueAmt - a.dueAmt);
  const current = views.find((v) => v.id === selectedId) || null;

  const dateStr = useMemo(() => {
    const d = new Date();
    return d.toLocaleDateString("en-GB", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
  }, []);

  const navDef: [Screen, string][] = [
    ["dashboard", "Dashboard"],
    ["customers", "Customers"],
    ["quote", "Quotation"],
    ["expenses", "Expenses"],
    ["reports", "Reports"],
  ];

  const expenses = useMemo(() => {
    const list: {
      client: string;
      label: string;
      amount: number;
      amtText: string;
      catText: string;
      hasCat: boolean;
      dateText: string;
      hasDate: boolean;
      onRemove: () => void;
    }[] = [];
    clients.forEach((j) => {
      (j.costs || []).forEach((c, i) =>
        list.push({
          client: j.name,
          label: c.label,
          amount: c.amount,
          amtText: rs(c.amount),
          catText: c.category || "",
          hasCat: !!c.category,
          dateText: dateText(c.date),
          hasDate: !!c.date,
          onRemove: () => removeLine(j.id, "cost", i),
        })
      );
    });
    list.sort((a, b) => b.amount - a.amount);
    return list;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clients]);

  const reportRows = useMemo(() => {
    const maxVal = Math.max(1, ...views.map((v) => Math.max(v.received, v.spent)));
    return views.map((v) => ({
      name: v.name,
      summary: rs(v.received) + " in · " + rs(v.spent) + " out",
      recvStyle: CSS({
        height: "100%",
        width: Math.round((v.received / maxVal) * 100) + "%",
        background: "#1f7a6d",
        borderRadius: 20,
      }),
      spentStyle: CSS({
        height: "100%",
        width: Math.round((v.spent / maxVal) * 100) + "%",
        background: "#c9a94a",
        borderRadius: 20,
      }),
    }));
  }, [views]);

  /* ------------------------- invoice (from client) ------------------------- */

  const cj = clients.find((j) => j.id === selectedId) || null;
  const inv = useMemo(() => {
    if (!cj) return null;
    const f = fig(cj);
    const isQuote = docType === "quote";
    const brand = cj.brand || "Poshish Wala";
    const isComfy = brand === "Comfy Club";
    const gold = "#c2a260",
      navy = "#1c2a4a";
    const acc = isComfy ? navy : gold;
    const accSoft = isComfy ? "#eef1f6" : "#f5eede";
    const tagline = isComfy
      ? "Custom Sofas & Comfort Furniture"
      : "Finishing jo nazar aaye";
    const total = cj.total != null ? cj.total : f.received;
    const num =
      (isComfy ? "CC" : "PW") +
      "-" +
      String(cj.name || "")
        .replace(/[^A-Za-z]/g, "")
        .slice(0, 3)
        .toUpperCase() +
      "-" +
      todayStr().replace(/[-T:]/g, "").slice(2, 12);
    return {
      isQuote,
      docTitle: isQuote ? "QUOTATION" : "INVOICE",
      brand,
      tagline,
      contact:
        "Al Hamra Town, Lahore · 0339 4100052 · " +
        (isComfy ? "comfyclub.pk" : "poshishwala.pk"),
      barStyle: CSS({ height: 6, background: acc }),
      titleStyle: CSS({
        fontSize: 26,
        fontWeight: 800,
        letterSpacing: 3,
        color: acc,
      }),
      rowAccent: CSS({ background: accSoft }),
      totalStyle: CSS({ fontWeight: 800, fontSize: 20, color: acc }),
      sectStyle: CSS({
        fontSize: 12,
        textTransform: "uppercase",
        letterSpacing: 1,
        fontWeight: 700,
        color: acc,
      }),
      number: num,
      dateText: dateText(todayStr()),
      clientName: cj.name,
      clientMeta: [cj.area].filter(Boolean).join(""),
      clientPhone: cj.phone || "",
      work: cj.work || "Upholstery work",
      totalText: rs(total),
      total,
      receivedText: rs(f.received),
      balanceText: rs(Math.max((cj.total != null ? cj.total : 0) - f.received, 0)),
      showPayments: !isQuote && f.received > 0,
      showTerms: isQuote,
      workTerms:
        "Includes fabric, foam, wood work, labour and finishing as per the selection agreed. Any change in design, size or material may revise the final price.",
      payTerms:
        "50% advance to begin work, remaining 50% on delivery. Advance is non-refundable once material is purchased.",
      deliveryTerms:
        "Estimated 7–10 working days from confirmation of advance. Free delivery within Lahore.",
      validNote: "This quotation is valid for 15 days from the date above.",
      note: isQuote
        ? ""
        : "Thank you for your business. Please clear the balance on delivery.",
      logoSrc: isComfy ? "/tool/comfyclub-logo.jpeg" : "/tool/poshishwala-logo.jpeg",
      logoHeight: isComfy ? 80 : 92,
      payments: (cj.payments || []).map((p) => ({
        label: p.label,
        amtText: rs(p.amount),
        dateText: dateText(p.date),
        hasDate: !!p.date,
      })),
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cj, docType]);

  /* --------------------------- quote values --------------------------- */

  const qv = useMemo(() => {
    const isComfy = quote.brand === "Comfy Club";
    const gold = "#c2a260",
      navy = "#1c2a4a",
      green = "#1f7a6d";
    const acc = isComfy ? navy : green;
    const lineTotal = (it: QuoteItem) => {
      const up = parseFloat(it.unitPrice) || 0;
      const qy = it.qty === "" ? 1 : parseFloat(it.qty) || 0;
      return up * qy;
    };
    const total = quote.items.reduce((t, it) => t + lineTotal(it), 0);
    const defNum =
      (isComfy ? "CC" : "PW") + "-QT-" + todayStr().replace(/[-T:]/g, "").slice(2, 8);
    const website = isComfy ? "comfyclub.pk" : "poshishwala.pk";
    const items = quote.items.map((it, i) => {
      const lt = lineTotal(it);
      return {
        desc: it.desc,
        unitPrice: it.unitPrice,
        qty: it.qty,
        unitText:
          it.unitPrice !== "" && !isNaN(parseFloat(it.unitPrice))
            ? rs(parseFloat(it.unitPrice))
            : "",
        qtyDisp: it.qty === "" ? "1" : it.qty,
        amtText: rs(lt),
        onDesc: (e: React.ChangeEvent<HTMLInputElement>) =>
          setQItem(i, "desc", e.target.value),
        onUnit: (e: React.ChangeEvent<HTMLInputElement>) =>
          setQItem(i, "unitPrice", e.target.value),
        onQty: (e: React.ChangeEvent<HTMLInputElement>) =>
          setQItem(i, "qty", e.target.value),
        onRemove: () => removeQItem(i),
      };
    });
    const brandBtn = (b: Brand, label: string) => ({
      label,
      onClick: () => setQBrand(b),
      style: CSS({
        flex: 1,
        padding: 12,
        borderRadius: 10,
        cursor: "pointer",
        fontSize: 14,
        fontWeight: 600,
        ...(quote.brand === b
          ? {
              border: "2px solid " + (b === "Comfy Club" ? navy : green),
              background: b === "Comfy Club" ? "#eef1f6" : "#eaf3f1",
              color: b === "Comfy Club" ? navy : green,
            }
          : { border: "2px solid #e2e5e9", background: "#fff", color: "#8b9199" }),
      }),
    });
    return {
      isComfy,
      brandBtns: [
        brandBtn("Poshish Wala", "Poshish Wala"),
        brandBtn("Comfy Club", "ComfyClub"),
      ],
      logoSrc: isComfy ? "/tool/comfyclub-logo.jpeg" : "/tool/poshishwala-logo.jpeg",
      logoHeight: isComfy ? 80 : 92,
      contact: "Al Hamra Town, Lahore · 0339 4100052 · " + website,
      toDisp: quote.to || quote.client.name || "—",
      forDisp: quote.for,
      barStyle: CSS({ height: 8, background: acc }),
      titleStyle: CSS({
        fontSize: 28,
        fontWeight: 800,
        letterSpacing: 4,
        color: acc,
      }),
      headRow: CSS({ background: acc, color: "#fff" }),
      totalStyle: CSS({ fontWeight: 800, fontSize: 22, color: acc }),
      sectStyle: CSS({
        fontSize: 12,
        textTransform: "uppercase",
        letterSpacing: 1,
        fontWeight: 700,
        color: acc,
      }),
      termsBox: CSS({
        background: isComfy ? "#f4f6fa" : "#faf6ee",
        borderRadius: 10,
        padding: "18px 20px",
      }),
      numberPh: defNum,
      numberDisp: quote.number || defNum,
      dateText: dateText(todayStr()),
      clientNameDisp: quote.client.name || "—",
      clientAreaDisp: quote.client.area,
      clientPhoneDisp: quote.client.phone,
      items,
      totalText: rs(total),
    };
  }, [quote]);

  /* ----------------------------- render ----------------------------- */

  const cardBase: React.CSSProperties = {
    background: "#fff",
    border: "1px solid #e2e5e9",
    borderRadius: 12,
    padding: 18,
  };
  const labelCap: React.CSSProperties = {
    fontSize: 11,
    letterSpacing: ".4px",
    textTransform: "uppercase",
    color: "#9aa0a8",
    fontWeight: 500,
  };
  const primaryBtn: React.CSSProperties = {
    border: "none",
    background: "#1f7a6d",
    color: "#fff",
    fontWeight: 600,
    fontSize: 13,
    padding: "9px 16px",
    borderRadius: 9,
    cursor: "pointer",
  };
  const outlineBtn: React.CSSProperties = {
    border: "1px solid #1f7a6d",
    color: "#1f7a6d",
    background: "#fff",
    fontWeight: 500,
    fontSize: 13,
    padding: "8px 14px",
    borderRadius: 9,
    cursor: "pointer",
  };
  const modalInput: React.CSSProperties = {
    padding: "11px 13px",
    border: "1px solid #d7dbe0",
    borderRadius: 9,
    fontSize: 14,
  };
  const modalSelect: React.CSSProperties = { ...modalInput, background: "#fff" };
  const modalSaveBtn: React.CSSProperties = {
    marginTop: 6,
    border: "none",
    background: "#1f7a6d",
    color: "#fff",
    fontWeight: 600,
    fontSize: 14,
    padding: 12,
    borderRadius: 10,
    cursor: "pointer",
  };
  const quoteInput: React.CSSProperties = {
    padding: "10px 12px",
    border: "1px solid #d7dbe0",
    borderRadius: 9,
    fontSize: 14,
  };
  const sectionCap: React.CSSProperties = {
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: ".4px",
    color: "#9aa0a8",
    fontWeight: 600,
  };

  const isComfyQuote = qv.isComfy;
  const modalTitle =
    modal === "new"
      ? "New client"
      : modal === "pay"
      ? "Record payment"
      : modal === "cost"
      ? "Log expense"
      : "Edit details";

  // ---- front-door login gate + account state (client-side) ----
  const [authUser, setAuthUser] = useState<string | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [loginU, setLoginU] = useState("");
  const [loginP, setLoginP] = useState("");
  const [loginErr, setLoginErr] = useState("");
  const [accountOpen, setAccountOpen] = useState(false);

  useEffect(() => {
    let saved: string | null = null;
    try {
      saved = localStorage.getItem("poshishwala:auth");
    } catch {
      /* ignore */
    }
    if (saved && USERS.some((u) => u.username === saved)) setAuthUser(saved);
    setAuthReady(true);
  }, []);

  function doLogin(e: React.FormEvent) {
    e.preventDefault();
    const u = loginU.trim().toLowerCase();
    const match = USERS.find(
      (x) => x.username.toLowerCase() === u && x.password === loginP
    );
    if (!match) {
      setLoginErr("Wrong username or password.");
      return;
    }
    try {
      localStorage.setItem("poshishwala:auth", match.username);
    } catch {
      /* ignore */
    }
    setAuthUser(match.username);
    setLoginErr("");
    setLoginU("");
    setLoginP("");
  }
  function doLogout() {
    try {
      localStorage.removeItem("poshishwala:auth");
    } catch {
      /* ignore */
    }
    setAuthUser(null);
    setAccountOpen(false);
  }
  function exportData() {
    try {
      const data = localStorage.getItem(KEY) || JSON.stringify(clients);
      const blob = new Blob([data], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download =
        "poshishwala-backup-" + new Date().toISOString().slice(0, 10) + ".json";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      /* ignore */
    }
  }
  function importData(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        if (Array.isArray(parsed)) {
          mutate(() => parsed as Client[]);
          setAccountOpen(false);
          if (typeof window !== "undefined")
            window.alert("Backup restored — " + parsed.length + " clients loaded.");
        } else if (typeof window !== "undefined") {
          window.alert("That file doesn't look like a Poshish Wala backup.");
        }
      } catch {
        if (typeof window !== "undefined") window.alert("Couldn't read that file.");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  }

  const authName =
    USERS.find((u) => u.username === authUser)?.name || authUser || "";
  const authInitial = (authName || "PW").trim().charAt(0).toUpperCase() || "PW";

  if (!authReady)
    return <div className="pw-app" style={{ minHeight: "100vh", background: "#f4f6f8" }} />;

  if (!authUser) {
    return (
      <div className="pw-app" style={loginWrap}>
        <style dangerouslySetInnerHTML={{ __html: PW_FONT_CSS }} />
        <form onSubmit={doLogin} style={loginCard}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
            <div style={loginLogo}>PW</div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontWeight: 600, fontSize: 18 }}>Poshish Wala</div>
              <div style={{ fontSize: 12, color: "#8b9199" }}>Business Tool · Lahore</div>
            </div>
          </div>
          <input
            value={loginU}
            onChange={(e) => setLoginU(e.target.value)}
            placeholder="Username"
            autoCapitalize="none"
            autoCorrect="off"
            style={loginInput}
          />
          <input
            type="password"
            value={loginP}
            onChange={(e) => setLoginP(e.target.value)}
            placeholder="Password"
            style={loginInput}
          />
          {loginErr && (
            <div style={{ color: "#c15b4a", fontSize: 13, textAlign: "center" }}>
              {loginErr}
            </div>
          )}
          <button type="submit" style={loginBtn}>
            Sign in
          </button>
          <div style={{ fontSize: 11, color: "#a7adb4", textAlign: "center" }}>
            Access for the Poshish Wala team.
          </div>
        </form>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <style
        // Global page rules from the prototype: Poppins font, base colours,
        // placeholder colour, link colours and print behaviour.
        dangerouslySetInnerHTML={{
          __html: `
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
.pw-app{background:#f4f6f8;font-family:'Poppins',system-ui,sans-serif;color:#25292e;-webkit-text-size-adjust:100%}
.pw-app *{box-sizing:border-box}
.pw-app input,.pw-app select,.pw-app button,.pw-app textarea{font-family:'Poppins',sans-serif}
.pw-app a{color:#1f7a6d;text-decoration:none}
.pw-app a:hover{color:#155a50}
.pw-app ::placeholder{color:#a7adb4}
.pw-topnav{display:flex}
.pw-bottomnav{display:none}
.pw-headnew{display:inline-block}
@media (max-width:640px){
  .pw-topnav{display:none !important}
  .pw-headnew{display:none !important}
  .pw-bottomnav{display:flex !important}
  .pw-main{padding-bottom:92px !important}
}
@media print{
  .pw-header,.pw-bottomnav,.no-print{display:none !important}
  body{background:#fff}
  .pw-main{padding:0 !important;max-width:none !important}
  #invoice-doc{border:none !important;border-radius:0 !important;max-width:none !important}
}`,
        }}
      />

      {/* wrapper class carries the Poppins font + background for this tool only */}
      <div className="pw-app" style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        {/* ===== HEADER ===== */}
        <header
          className="pw-header"
          style={{
            position: "sticky",
            top: 0,
            zIndex: 20,
            background: "#fff",
            borderBottom: "1px solid #e2e5e9",
            boxShadow: "0 1px 6px rgba(0,0,0,.04)",
          }}
        >
          <div
            style={{
              maxWidth: 1120,
              margin: "0 auto",
              padding: "12px 18px",
              display: "flex",
              alignItems: "center",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <div
              style={{ display: "flex", alignItems: "center", gap: 11, cursor: "pointer" }}
              onClick={() => go("dashboard")}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 9,
                  background: "#1f7a6d",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 600,
                  fontSize: 15,
                }}
              >
                PW
              </div>
              <div style={{ lineHeight: 1.1 }}>
                <div style={{ fontWeight: 600, fontSize: 15 }}>Poshish Wala</div>
                <div style={{ fontSize: 11, color: "#8b9199" }}>× Comfy Club · Lahore</div>
              </div>
            </div>
            <nav className="pw-topnav" style={{ display: "flex", gap: 4, flexWrap: "wrap", marginLeft: 8 }}>
              {navDef.map(([sc, label]) => {
                const active =
                  screen === sc || (sc === "customers" && screen === "detail");
                return (
                  <button
                    key={sc}
                    onClick={() => go(sc)}
                    style={{
                      border: "none",
                      cursor: "pointer",
                      fontSize: 13,
                      fontWeight: active ? 600 : 500,
                      padding: "8px 13px",
                      borderRadius: 8,
                      background: active ? "#eaf3f1" : "transparent",
                      color: active ? "#1f7a6d" : "#5a6069",
                    }}
                  >
                    {label}
                  </button>
                );
              })}
            </nav>
            <div style={{ flex: 1, minWidth: 12 }} />
            <button className="pw-headnew" onClick={() => setModal("new")} style={primaryBtn}>
              + New client
            </button>
            <button
              onClick={() => setAccountOpen(true)}
              aria-label="Account and settings"
              title={"Signed in as " + authName}
              style={{
                width: 38,
                height: 38,
                borderRadius: "50%",
                border: "1px solid #d7dbe0",
                background: "#e7ece9",
                color: "#1f7a6d",
                fontWeight: 600,
                fontSize: 13,
                cursor: "pointer",
                flex: "none",
              }}
            >
              {authInitial}
            </button>
          </div>
        </header>

        <main
          className="pw-main"
          style={{
            flex: 1,
            maxWidth: 1120,
            width: "100%",
            margin: "0 auto",
            padding: "22px 18px 60px",
          }}
        >
          {/* ================= DASHBOARD ================= */}
          {screen === "dashboard" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
              <div>
                <div style={{ fontSize: 21, fontWeight: 600 }}>Assalam-o-alaikum 👋</div>
                <div style={{ fontSize: 13, color: "#8b9199" }}>
                  {dateStr} · here&apos;s where the business stands today
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))",
                  gap: 14,
                }}
              >
                <div style={{ ...cardBase, padding: "15px 17px" }}>
                  <div style={labelCap}>Received</div>
                  <div style={{ fontSize: 25, fontWeight: 600, color: "#1f7a6d" }}>
                    {rs(totals.received)}
                  </div>
                  <div style={{ fontSize: 11, color: "#8b9199" }}>advances &amp; payments in</div>
                </div>
                <div style={{ ...cardBase, padding: "15px 17px" }}>
                  <div style={labelCap}>Spent</div>
                  <div style={{ fontSize: 25, fontWeight: 600 }}>{rs(totals.spent)}</div>
                  <div style={{ fontSize: 11, color: "#8b9199" }}>material, wood, fabric…</div>
                </div>
                <div style={{ ...cardBase, padding: "15px 17px" }}>
                  <div style={labelCap}>Active jobs</div>
                  <div style={{ fontSize: 25, fontWeight: 600 }}>
                    {clients.filter((j) => jobStatus(j) !== "complete").length}
                  </div>
                  <div style={{ fontSize: 11, color: "#8b9199" }}>
                    {dueList.length ? dueList.length + " with balance due" : "all settled"}
                  </div>
                </div>
                <div style={{ ...cardBase, padding: "15px 17px" }}>
                  <div style={labelCap}>Outstanding</div>
                  <div style={{ fontSize: 25, fontWeight: 600, color: "#c15b4a" }}>
                    {rs(totals.outstanding)}
                  </div>
                  <div style={{ fontSize: 11, color: "#8b9199" }}>still to collect</div>
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))",
                  gap: 11,
                }}
              >
                {[
                  { label: "＋ New client", onClick: () => setModal("new") },
                  { label: "＋ Record payment", onClick: () => setModal("pay") },
                  { label: "＋ Log expense", onClick: () => setModal("cost") },
                  { label: "▤ View reports", onClick: () => go("reports") },
                ].map((a) => (
                  <button
                    key={a.label}
                    onClick={a.onClick}
                    style={{
                      textAlign: "left",
                      background: "#fff",
                      border: "1px solid #e2e5e9",
                      borderRadius: 11,
                      padding: 14,
                      cursor: "pointer",
                      fontSize: 13,
                      fontWeight: 500,
                    }}
                  >
                    {a.label}
                  </button>
                ))}
              </div>

              <div style={cardBase}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 12,
                  }}
                >
                  <div style={{ fontWeight: 600, fontSize: 15 }}>Jobs with balance due</div>
                  <button
                    onClick={() => go("customers")}
                    style={{
                      border: "none",
                      background: "none",
                      color: "#1f7a6d",
                      fontSize: 12,
                      cursor: "pointer",
                      fontWeight: 500,
                    }}
                  >
                    all clients →
                  </button>
                </div>
                {dueList.length > 0 ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                    {dueList.map((c) => (
                      <div
                        key={c.id}
                        onClick={c.onOpen}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                          padding: "10px 11px",
                          border: "1px solid #eceef1",
                          borderRadius: 10,
                          cursor: "pointer",
                          background: "#fafbfc",
                        }}
                      >
                        <div style={avatar(34, 12)}>{c.initials}</div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: 500, fontSize: 14 }}>{c.name}</div>
                          <div style={{ fontSize: 12, color: "#8b9199" }}>{c.meta}</div>
                        </div>
                        <div
                          style={{
                            fontWeight: 600,
                            fontSize: 13,
                            color: "#c15b4a",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {rs(c.dueAmt)} due
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div
                    style={{
                      fontSize: 13,
                      color: "#8b9199",
                      fontStyle: "italic",
                      padding: "6px 0",
                    }}
                  >
                    All balances collected. 🎉
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ================= CUSTOMERS ================= */}
          {screen === "customers" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                  flexWrap: "wrap",
                  gap: 10,
                }}
              >
                <div style={{ fontSize: 20, fontWeight: 600 }}>
                  Clients{" "}
                  <span style={{ color: "#9aa0a8", fontWeight: 400, fontSize: 15 }}>
                    ({clients.length})
                  </span>
                </div>
                <button
                  onClick={() => setModal("new")}
                  style={{ ...outlineBtn, padding: "8px 14px" }}
                >
                  + Add client
                </button>
              </div>
              <div
                style={{
                  background: "#fff",
                  border: "1px solid #e2e5e9",
                  borderRadius: 10,
                  display: "flex",
                  alignItems: "center",
                  gap: 9,
                  padding: "10px 14px",
                }}
              >
                <span style={{ color: "#a7adb4" }}>🔍</span>
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by name, area or phone…"
                  style={{
                    border: "none",
                    outline: "none",
                    flex: 1,
                    fontSize: 14,
                    background: "none",
                  }}
                />
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))",
                  gap: 13,
                }}
              >
                {filtered.map((c) => (
                  <div
                    key={c.id}
                    onClick={c.onOpen}
                    style={{
                      background: "#fff",
                      border: "1px solid #e2e5e9",
                      borderRadius: 12,
                      padding: 15,
                      cursor: "pointer",
                      display: "flex",
                      flexDirection: "column",
                      gap: 11,
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 11 }}>
                      <div style={avatar(38, 13)}>{c.initials}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>{c.name}</div>
                        <div style={{ fontSize: 12, color: "#8b9199" }}>{c.meta}</div>
                      </div>
                      <span style={c.statusStyle}>{c.statusText}</span>
                    </div>
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}
                    >
                      <span style={c.brandStyle}>{c.brand}</span>
                      <span style={c.payStatusStyle}>{c.payStatusText}</span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        gap: 16,
                        borderTop: "1px solid #f0f2f4",
                        paddingTop: 10,
                      }}
                    >
                      <div>
                        <div style={miniCap}>Received</div>
                        <div style={{ fontWeight: 600, fontSize: 13, color: "#1f7a6d" }}>
                          {c.receivedText}
                        </div>
                      </div>
                      <div>
                        <div style={miniCap}>Spent</div>
                        <div style={{ fontWeight: 600, fontSize: 13 }}>{c.spentText}</div>
                      </div>
                      <div>
                        <div style={miniCap}>Profit</div>
                        <div style={{ ...c.profitStyle, fontSize: 13 }}>{c.profitText}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {q !== "" && filtered.length === 0 && (
                <div
                  style={{
                    fontSize: 13,
                    color: "#8b9199",
                    fontStyle: "italic",
                    textAlign: "center",
                    padding: 20,
                  }}
                >
                  No clients match &quot;{query}&quot;.
                </div>
              )}
            </div>
          )}

          {/* ================= DETAIL ================= */}
          {screen === "detail" && current && (
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <button
                onClick={() => go("customers")}
                style={{
                  alignSelf: "flex-start",
                  border: "none",
                  background: "none",
                  color: "#8b9199",
                  fontSize: 13,
                  cursor: "pointer",
                  padding: 0,
                }}
              >
                ← All clients
              </button>

              <div
                style={{
                  ...cardBase,
                  padding: 20,
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 16,
                  alignItems: "flex-start",
                }}
              >
                <div style={avatar(52, 18)}>{current.initials}</div>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    <div style={{ fontSize: 20, fontWeight: 600 }}>{current.name}</div>
                    <span style={current.brandStyle}>{current.brand}</span>
                  </div>
                  <div style={{ fontSize: 13, color: "#8b9199", marginTop: 2 }}>
                    {current.meta}
                  </div>
                  <div style={{ marginTop: 8 }}>
                    <a href={current.telHref} style={{ fontSize: 13, fontWeight: 500 }}>
                      📞 {current.phone}
                    </a>
                  </div>
                </div>
                <span style={current.statusStyle}>{current.statusText}</span>
              </div>

              <div
                style={{
                  ...cardBase,
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit,minmax(120px,1fr))",
                  gap: 14,
                }}
              >
                <div>
                  <div style={miniCap}>Total amount</div>
                  <div style={{ fontWeight: 600, fontSize: 17 }}>{current.totalText}</div>
                </div>
                <div>
                  <div style={miniCap}>Received</div>
                  <div style={{ fontWeight: 600, fontSize: 17, color: "#1f7a6d" }}>
                    {current.receivedText}
                  </div>
                </div>
                <div>
                  <div style={miniCap}>Balance due</div>
                  <div style={{ fontWeight: 600, fontSize: 17, color: "#c15b4a" }}>
                    {current.dueText}
                  </div>
                </div>
                <div>
                  <div style={miniCap}>Profit</div>
                  <div style={{ ...current.profitStyle, fontSize: 17 }}>
                    {current.profitText}
                  </div>
                </div>
              </div>
              <div style={{ fontSize: 11, color: "#9aa0a8", marginTop: -8 }}>
                Profit = total amount − all expenses
              </div>

              <div style={{ ...cardBase, padding: "16px 18px" }}>
                <div style={{ ...sectionCap, marginBottom: 10 }}>Project status</div>
                <div style={{ display: "flex", gap: 8 }}>
                  {current.statusBtns.map((b) => (
                    <button key={b.key} onClick={b.onClick} style={b.style}>
                      {b.label}
                    </button>
                  ))}
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
                  gap: 16,
                }}
              >
                <div style={cardBase}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 12,
                    }}
                  >
                    <div style={{ fontWeight: 600, fontSize: 14 }}>Payments received</div>
                    <button onClick={() => setModal("pay")} style={smallAddBtn}>
                      + Add
                    </button>
                  </div>
                  {current.payments.length > 0 ? (
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      {current.payments.map((p, i) => (
                        <div key={i} style={lineRow}>
                          <span style={{ flex: 1 }}>
                            {p.label}
                            {p.hasDate && (
                              <span style={{ display: "block", fontSize: 11, color: "#8b9199" }}>
                                {p.dateText}
                              </span>
                            )}
                          </span>
                          <span style={{ fontWeight: 600 }}>{p.amtText}</span>
                          <button onClick={p.onRemove} style={removeBtn}>
                            remove
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={emptyItalic}>Nothing received yet</div>
                  )}
                </div>

                <div style={cardBase}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 12,
                    }}
                  >
                    <div style={{ fontWeight: 600, fontSize: 14 }}>Costs &amp; expenses</div>
                    <button onClick={() => setModal("cost")} style={smallAddBtn}>
                      + Add
                    </button>
                  </div>
                  {current.costs.length > 0 ? (
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      {current.costs.map((c, i) => (
                        <div key={i} style={lineRow}>
                          <span style={{ flex: 1 }}>
                            {c.label}
                            {c.hasDate && (
                              <span style={{ display: "block", fontSize: 11, color: "#8b9199" }}>
                                {c.dateText}
                              </span>
                            )}
                          </span>
                          {c.hasCat && <span style={catPill}>{c.catText}</span>}
                          <span style={{ fontWeight: 600 }}>{c.amtText}</span>
                          <button onClick={c.onRemove} style={removeBtn}>
                            remove
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={emptyItalic}>No costs recorded yet</div>
                  )}
                </div>
              </div>

              <div style={{ display: "flex", gap: 9, flexWrap: "wrap" }}>
                <button
                  onClick={() => openDoc(selectedId!, "invoice")}
                  style={{ ...primaryBtn, padding: "9px 15px" }}
                >
                  Create invoice
                </button>
                <button
                  onClick={() => setModal("edit")}
                  style={{
                    border: "1px solid #cfd4da",
                    background: "#fff",
                    fontSize: 13,
                    fontWeight: 500,
                    padding: "9px 15px",
                    borderRadius: 9,
                    cursor: "pointer",
                  }}
                >
                  Edit details
                </button>
                <button
                  onClick={() => del(selectedId)}
                  style={{
                    border: "1px solid #e7c3bc",
                    background: "#fff",
                    color: "#c15b4a",
                    fontSize: 13,
                    fontWeight: 500,
                    padding: "9px 15px",
                    borderRadius: 9,
                    cursor: "pointer",
                  }}
                >
                  Delete client
                </button>
              </div>
            </div>
          )}

          {/* ================= EXPENSES ================= */}
          {screen === "expenses" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                  flexWrap: "wrap",
                  gap: 10,
                }}
              >
                <div style={{ fontSize: 20, fontWeight: 600 }}>Expenses</div>
                <button onClick={() => setModal("cost")} style={outlineBtn}>
                  + Log expense
                </button>
              </div>
              <div style={{ ...cardBase, padding: 17 }}>
                <div style={labelCap}>Total spent</div>
                <div style={{ fontSize: 26, fontWeight: 600 }}>{rs(totals.spent)}</div>
              </div>
              <div
                style={{
                  background: "#fff",
                  border: "1px solid #e2e5e9",
                  borderRadius: 12,
                  overflow: "hidden",
                }}
              >
                {expenses.map((e, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "13px 16px",
                      borderBottom: "1px solid #f0f2f4",
                    }}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 500, fontSize: 14 }}>{e.label}</div>
                      <div style={{ fontSize: 12, color: "#8b9199" }}>
                        {e.client}
                        {e.hasDate && <> · {e.dateText}</>}
                      </div>
                    </div>
                    {e.hasCat && <span style={{ ...catPill, padding: "3px 9px" }}>{e.catText}</span>}
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{e.amtText}</div>
                    <button onClick={e.onRemove} style={removeBtn}>
                      remove
                    </button>
                  </div>
                ))}
                {expenses.length === 0 && (
                  <div style={{ ...emptyItalic, padding: 16 }}>No expenses logged yet.</div>
                )}
              </div>
            </div>
          )}

          {/* ================= REPORTS ================= */}
          {screen === "reports" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <div style={{ fontSize: 20, fontWeight: 600 }}>Reports &amp; analytics</div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))",
                  gap: 14,
                }}
              >
                <div style={{ ...cardBase, padding: "15px 17px" }}>
                  <div style={labelCap}>Billed</div>
                  <div style={{ fontSize: 22, fontWeight: 600 }}>{rs(totals.billed)}</div>
                </div>
                <div style={{ ...cardBase, padding: "15px 17px" }}>
                  <div style={labelCap}>Received</div>
                  <div style={{ fontSize: 22, fontWeight: 600, color: "#1f7a6d" }}>
                    {rs(totals.received)}
                  </div>
                </div>
                <div style={{ ...cardBase, padding: "15px 17px" }}>
                  <div style={labelCap}>Outstanding</div>
                  <div style={{ fontSize: 22, fontWeight: 600, color: "#c15b4a" }}>
                    {rs(totals.outstanding)}
                  </div>
                </div>
                <div style={{ ...cardBase, padding: "15px 17px" }}>
                  <div style={labelCap}>Cash in hand</div>
                  <div
                    style={{
                      fontWeight: 600,
                      color: totals.inHand < 0 ? "#c15b4a" : "#1f7a6d",
                      fontSize: 22,
                    }}
                  >
                    {rs(totals.inHand)}
                  </div>
                </div>
              </div>

              <div style={cardBase}>
                <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 16 }}>
                  Received vs spent, by client
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 15 }}>
                  {reportRows.map((r, i) => (
                    <div key={i}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          fontSize: 13,
                          marginBottom: 5,
                        }}
                      >
                        <span style={{ fontWeight: 500 }}>{r.name}</span>
                        <span style={{ color: "#8b9199" }}>{r.summary}</span>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                        <div style={barTrack}>
                          <div style={r.recvStyle} />
                        </div>
                        <div style={barTrack}>
                          <div style={r.spentStyle} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: 18,
                    marginTop: 16,
                    fontSize: 12,
                    color: "#8b9199",
                  }}
                >
                  <span>
                    <span style={legendDot("#1f7a6d")} /> Received
                  </span>
                  <span>
                    <span style={legendDot("#c9a94a")} /> Spent
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* ================= QUOTATION BUILDER ================= */}
          {screen === "quote" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <div
                className="no-print"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: 10,
                }}
              >
                <div style={{ fontSize: 20, fontWeight: 600 }}>Create quotation</div>
                <button onClick={printDoc} style={darkBtn}>
                  Print / Save PDF
                </button>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))",
                  gap: 20,
                  alignItems: "start",
                }}
              >
                {/* EDITOR */}
                <div
                  className="no-print"
                  style={{ display: "flex", flexDirection: "column", gap: 16 }}
                >
                  <div style={{ ...cardBase, padding: 16 }}>
                    <div style={{ ...sectionCap, marginBottom: 10 }}>Which brand?</div>
                    <div style={{ display: "flex", gap: 10 }}>
                      {qv.brandBtns.map((b) => (
                        <button key={b.label} onClick={b.onClick} style={b.style}>
                          {b.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div
                    style={{
                      ...cardBase,
                      padding: 16,
                      display: "flex",
                      flexDirection: "column",
                      gap: 11,
                    }}
                  >
                    <div style={sectionCap}>Client &amp; reference</div>
                    <input
                      value={quote.client.name}
                      onChange={(e) => setQClient("name", e.target.value)}
                      placeholder="Client name"
                      style={quoteInput}
                    />
                    <input
                      value={quote.client.area}
                      onChange={(e) => setQClient("area", e.target.value)}
                      placeholder="Area / address"
                      style={quoteInput}
                    />
                    <input
                      value={quote.client.phone}
                      onChange={(e) => setQClient("phone", e.target.value)}
                      placeholder="Phone"
                      style={quoteInput}
                    />
                    <input
                      value={quote.number}
                      onChange={(e) => setQField("number", e.target.value)}
                      placeholder={qv.numberPh}
                      style={quoteInput}
                    />
                    {isComfyQuote && (
                      <>
                        <input
                          value={quote.to}
                          onChange={(e) => setQField("to", e.target.value)}
                          placeholder="Quotation to (name / company)"
                          style={quoteInput}
                        />
                        <input
                          value={quote.for}
                          onChange={(e) => setQField("for", e.target.value)}
                          placeholder="Quotation for (e.g. lips shape sofa 2+2)"
                          style={quoteInput}
                        />
                      </>
                    )}
                  </div>

                  <div
                    style={{
                      ...cardBase,
                      padding: 16,
                      display: "flex",
                      flexDirection: "column",
                      gap: 10,
                    }}
                  >
                    <div style={sectionCap}>Line items</div>
                    <div
                      style={{
                        display: "flex",
                        gap: 8,
                        fontSize: 10,
                        textTransform: "uppercase",
                        letterSpacing: ".4px",
                        color: "#9aa0a8",
                        fontWeight: 600,
                      }}
                    >
                      <span style={{ flex: 1 }}>Product / work</span>
                      <span style={{ width: 88 }}>Unit price</span>
                      <span style={{ width: 52 }}>Qty</span>
                      <span style={{ width: 18 }} />
                    </div>
                    {qv.items.map((it, i) => (
                      <div key={i} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <input
                          value={it.desc}
                          onChange={it.onDesc}
                          placeholder="Product name"
                          style={{ ...quoteInput, flex: 1 }}
                        />
                        <input
                          value={it.unitPrice}
                          onChange={it.onUnit}
                          type="number"
                          inputMode="numeric"
                          placeholder="Rs"
                          style={{ ...quoteInput, width: 88 }}
                        />
                        <input
                          value={it.qty}
                          onChange={it.onQty}
                          type="number"
                          inputMode="numeric"
                          placeholder="1"
                          style={{ ...quoteInput, width: 52 }}
                        />
                        <button
                          onClick={it.onRemove}
                          style={{
                            border: "none",
                            background: "none",
                            color: "#c15b4a",
                            fontSize: 18,
                            cursor: "pointer",
                            lineHeight: 1,
                          }}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={addQItem}
                      style={{
                        alignSelf: "flex-start",
                        border: "1px dashed #cfd4da",
                        background: "#fff",
                        fontSize: 13,
                        fontWeight: 500,
                        padding: "8px 14px",
                        borderRadius: 9,
                        cursor: "pointer",
                      }}
                    >
                      + Add item
                    </button>
                  </div>

                  <div
                    style={{
                      ...cardBase,
                      padding: 16,
                      display: "flex",
                      flexDirection: "column",
                      gap: 11,
                    }}
                  >
                    <div style={sectionCap}>Terms (editable)</div>
                    <label style={termLabel}>
                      Work terms
                      <textarea
                        value={quote.terms.work}
                        onChange={(e) => setQTerm("work", e.target.value)}
                        rows={3}
                        style={termArea}
                      />
                    </label>
                    <label style={termLabel}>
                      Payment terms
                      <textarea
                        value={quote.terms.payment}
                        onChange={(e) => setQTerm("payment", e.target.value)}
                        rows={3}
                        style={termArea}
                      />
                    </label>
                    <label style={termLabel}>
                      Delivery
                      <textarea
                        value={quote.terms.delivery}
                        onChange={(e) => setQTerm("delivery", e.target.value)}
                        rows={2}
                        style={termArea}
                      />
                    </label>
                    <label style={termLabel}>
                      Validity note
                      <input
                        value={quote.valid}
                        onChange={(e) => setQField("valid", e.target.value)}
                        style={{ ...quoteInput, fontSize: 13 }}
                      />
                    </label>
                  </div>
                </div>

                {/* PREVIEW */}
                <div
                  id="invoice-doc"
                  style={{
                    background: "#fff",
                    border: "1px solid #e2e5e9",
                    borderRadius: 12,
                    overflow: "hidden",
                    position: "sticky",
                    top: 76,
                  }}
                >
                  <div style={qv.barStyle} />

                  {/* POSHISH WALA template: logo left, title right */}
                  {!isComfyQuote && (
                    <div
                      style={{
                        padding: "26px 30px 20px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        flexWrap: "wrap",
                        gap: 16,
                        borderBottom: "1px solid #eceef1",
                      }}
                    >
                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        <div>{logoImg(qv.logoSrc, quote.brand, qv.logoHeight)}</div>
                        <div style={{ fontSize: 12, color: "#8b9199" }}>{qv.contact}</div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={qv.titleStyle}>QUOTATION</div>
                        <div style={{ fontSize: 12, color: "#8b9199", marginTop: 6 }}>
                          No. {qv.numberDisp}
                        </div>
                        <div style={{ fontSize: 12, color: "#8b9199" }}>{qv.dateText}</div>
                      </div>
                    </div>
                  )}

                  {/* COMFYCLUB template: centered logo & title */}
                  {isComfyQuote && (
                    <div
                      style={{
                        padding: "30px 30px 22px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 12,
                        borderBottom: "1px solid #eceef1",
                        textAlign: "center",
                      }}
                    >
                      <div>{logoImg(qv.logoSrc, quote.brand, qv.logoHeight)}</div>
                      <div style={qv.titleStyle}>QUOTATION</div>
                      <div style={{ fontSize: 12, color: "#8b9199" }}>{qv.contact}</div>
                      <div style={{ fontSize: 12, color: "#8b9199" }}>
                        No. {qv.numberDisp} · {qv.dateText}
                      </div>
                    </div>
                  )}

                  <div
                    style={{
                      padding: "22px 30px 30px",
                      display: "flex",
                      flexDirection: "column",
                      gap: 22,
                    }}
                  >
                    {!isComfyQuote && (
                      <>
                        <div>
                          <div style={preparedCap}>Prepared for</div>
                          <div style={{ fontSize: 16, fontWeight: 600, marginTop: 3 }}>
                            {qv.clientNameDisp}
                          </div>
                          <div style={{ fontSize: 13, color: "#5a6069" }}>
                            {qv.clientAreaDisp}
                          </div>
                          <div style={{ fontSize: 13, color: "#5a6069" }}>
                            {qv.clientPhoneDisp}
                          </div>
                        </div>
                        <div>
                          <div style={{ ...docHeadRow, ...qv.headRow }}>
                            <span style={{ flex: 1 }}>Description</span>
                            <span>Amount</span>
                          </div>
                          {qv.items.map((it, i) => (
                            <div key={i} style={docItemRow}>
                              <span style={{ flex: 1 }}>{it.desc}</span>
                              <span style={{ fontWeight: 600 }}>{it.amtText}</span>
                            </div>
                          ))}
                        </div>
                      </>
                    )}

                    {isComfyQuote && (
                      <>
                        <div style={{ display: "flex", gap: 30, flexWrap: "wrap" }}>
                          <div>
                            <div style={preparedCap}>Quotation to</div>
                            <div style={{ fontSize: 15, fontWeight: 600, marginTop: 3 }}>
                              {qv.toDisp}
                            </div>
                          </div>
                          <div>
                            <div style={preparedCap}>Quotation for</div>
                            <div style={{ fontSize: 15, fontWeight: 600, marginTop: 3 }}>
                              {qv.forDisp}
                            </div>
                          </div>
                        </div>
                        <div>
                          <div style={{ ...docHeadRow, ...qv.headRow }}>
                            <span style={{ flex: 1 }}>Product</span>
                            <span style={{ width: 110, textAlign: "right" }}>Unit price</span>
                            <span style={{ width: 50, textAlign: "right" }}>Qty</span>
                            <span style={{ width: 120, textAlign: "right" }}>Total bill</span>
                          </div>
                          {qv.items.map((it, i) => (
                            <div key={i} style={docItemRow}>
                              <span style={{ flex: 1 }}>{it.desc}</span>
                              <span style={{ width: 110, textAlign: "right", color: "#5a6069" }}>
                                {it.unitText}
                              </span>
                              <span style={{ width: 50, textAlign: "right", color: "#5a6069" }}>
                                {it.qtyDisp}
                              </span>
                              <span style={{ width: 120, textAlign: "right", fontWeight: 600 }}>
                                {it.amtText}
                              </span>
                            </div>
                          ))}
                        </div>
                      </>
                    )}

                    <div style={{ display: "flex", justifyContent: "flex-end" }}>
                      <div
                        style={{
                          width: 260,
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "baseline",
                          borderTop: "2px solid #eceef1",
                          paddingTop: 11,
                        }}
                      >
                        <span style={totalLabel}>Total bill</span>
                        <span style={qv.totalStyle}>{qv.totalText}</span>
                      </div>
                    </div>

                    <div style={{ ...qv.termsBox, display: "flex", flexDirection: "column", gap: 16 }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                        <div style={qv.sectStyle}>Work terms</div>
                        <div style={termsText}>{quote.terms.work}</div>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                        <div style={qv.sectStyle}>Payment terms</div>
                        <div style={termsText}>{quote.terms.payment}</div>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                        <div style={qv.sectStyle}>Delivery</div>
                        <div style={termsText}>{quote.terms.delivery}</div>
                      </div>
                    </div>
                    <div style={{ fontSize: 12, color: "#9aa0a8", fontStyle: "italic" }}>
                      {quote.valid}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= INVOICE ================= */}
          {screen === "invoice" && inv && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div
                className="no-print"
                style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}
              >
                <button
                  onClick={() => go("customers")}
                  style={{
                    border: "none",
                    background: "none",
                    color: "#8b9199",
                    fontSize: 13,
                    cursor: "pointer",
                    padding: 0,
                  }}
                >
                  ← Back
                </button>
                <div style={{ flex: 1 }} />
                <button onClick={printDoc} style={darkBtn}>
                  Print / Save PDF
                </button>
              </div>

              <div
                id="invoice-doc"
                style={{
                  background: "#fff",
                  border: "1px solid #e2e5e9",
                  borderRadius: 12,
                  overflow: "hidden",
                  maxWidth: 720,
                  margin: "0 auto",
                  width: "100%",
                }}
              >
                <div style={inv.barStyle} />
                <div
                  style={{
                    padding: "26px 30px 20px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    flexWrap: "wrap",
                    gap: 16,
                    borderBottom: "1px solid #eceef1",
                  }}
                >
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <div>{logoImg(inv.logoSrc, inv.brand, inv.logoHeight)}</div>
                    <div style={{ fontSize: 12, color: "#8b9199" }}>{inv.contact}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={inv.titleStyle}>{inv.docTitle}</div>
                    <div style={{ fontSize: 12, color: "#8b9199", marginTop: 6 }}>
                      No. {inv.number}
                    </div>
                    <div style={{ fontSize: 12, color: "#8b9199" }}>{inv.dateText}</div>
                  </div>
                </div>

                <div
                  style={{
                    padding: "24px 30px 30px",
                    display: "flex",
                    flexDirection: "column",
                    gap: 22,
                  }}
                >
                  <div>
                    <div style={preparedCap}>Prepared for</div>
                    <div style={{ fontSize: 16, fontWeight: 600, marginTop: 3 }}>
                      {inv.clientName}
                    </div>
                    <div style={{ fontSize: 13, color: "#5a6069" }}>{inv.clientMeta}</div>
                    <div style={{ fontSize: 13, color: "#5a6069" }}>{inv.clientPhone}</div>
                  </div>

                  <div>
                    <div
                      style={{
                        display: "flex",
                        padding: "11px 14px",
                        borderRadius: "8px 8px 0 0",
                        fontSize: 11,
                        textTransform: "uppercase",
                        letterSpacing: ".5px",
                        fontWeight: 700,
                        color: "#5a6069",
                        ...inv.rowAccent,
                      }}
                    >
                      <span style={{ flex: 1 }}>Description</span>
                      <span>Amount</span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        padding: 14,
                        border: "1px solid #eceef1",
                        borderTop: "none",
                        borderRadius: "0 0 8px 8px",
                        fontSize: 14,
                      }}
                    >
                      <span style={{ flex: 1 }}>{inv.work}</span>
                      <span style={{ fontWeight: 600 }}>{inv.totalText}</span>
                    </div>
                  </div>

                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <div style={{ width: 260, display: "flex", flexDirection: "column", gap: 9 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}>
                        <span style={{ color: "#5a6069" }}>Total estimate</span>
                        <span style={inv.totalStyle}>{inv.totalText}</span>
                      </div>
                      {inv.showPayments && (
                        <>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              fontSize: 13,
                              color: "#5a6069",
                            }}
                          >
                            <span>Received</span>
                            <span>− {inv.receivedText}</span>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              fontSize: 15,
                              fontWeight: 700,
                              borderTop: "1px solid #eceef1",
                              paddingTop: 9,
                            }}
                          >
                            <span>Balance due</span>
                            <span style={{ color: "#c15b4a" }}>{inv.balanceText}</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {inv.showPayments && (
                    <div>
                      <div style={{ ...preparedCap, marginBottom: 6 }}>Payment history</div>
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        {inv.payments.map((p, i) => (
                          <div
                            key={i}
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              fontSize: 13,
                              padding: "6px 0",
                              borderBottom: "1px dotted #eceef1",
                              color: "#5a6069",
                            }}
                          >
                            <span>
                              {p.label}
                              {p.hasDate && <> · {p.dateText}</>}
                            </span>
                            <span>{p.amtText}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {inv.showTerms && (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 16,
                        borderTop: "1px solid #eceef1",
                        paddingTop: 20,
                      }}
                    >
                      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                        <div style={inv.sectStyle}>Work terms</div>
                        <div style={termsText}>{inv.workTerms}</div>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                        <div style={inv.sectStyle}>Payment terms</div>
                        <div style={termsText}>{inv.payTerms}</div>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                        <div style={inv.sectStyle}>Delivery</div>
                        <div style={termsText}>{inv.deliveryTerms}</div>
                      </div>
                      <div style={{ fontSize: 12, color: "#9aa0a8", fontStyle: "italic" }}>
                        {inv.validNote}
                      </div>
                    </div>
                  )}

                  {inv.showPayments && (
                    <div
                      style={{
                        borderTop: "1px solid #eceef1",
                        paddingTop: 16,
                        fontSize: 12,
                        color: "#8b9199",
                      }}
                    >
                      {inv.note}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </main>

        {/* ===== MOBILE APP-STYLE BOTTOM NAV ===== */}
        <nav className="pw-bottomnav" style={bottomNavBar}>
          {bottomNavDef.map(([sc, label]) => {
            const active =
              screen === sc || (sc === "customers" && screen === "detail");
            return (
              <button key={sc} onClick={() => go(sc)} style={bottomNavItem(active)}>
                <NavIcon name={sc} active={active} />
                <span>{label}</span>
              </button>
            );
          })}
        </nav>

        {/* ================= MODAL ================= */}
        {modal && (
          <div
            onClick={() => setModal(null)}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(20,30,35,.4)",
              zIndex: 40,
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "center",
              padding: 0,
            }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                background: "#fff",
                width: "100%",
                maxWidth: 460,
                borderRadius: "16px 16px 0 0",
                padding: 22,
                boxShadow: "0 -8px 40px rgba(0,0,0,.18)",
                maxHeight: "92vh",
                overflow: "auto",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 16,
                }}
              >
                <div style={{ fontWeight: 600, fontSize: 16 }}>{modalTitle}</div>
                <button
                  onClick={() => setModal(null)}
                  style={{
                    border: "none",
                    background: "none",
                    fontSize: 20,
                    color: "#8b9199",
                    cursor: "pointer",
                    lineHeight: 1,
                  }}
                >
                  ×
                </button>
              </div>

              {/* new client */}
              {modal === "new" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
                  <input id="nj-name" placeholder="Client name" style={modalInput} />
                  <input id="nj-area" placeholder="Area, e.g. DHA Phase 8" style={modalInput} />
                  <input
                    id="nj-phone"
                    placeholder="Phone, e.g. +92 3xx xxxxxxx"
                    style={modalInput}
                  />
                  <input
                    id="nj-work"
                    placeholder="Work, e.g. 5-seater sofa + 1 chair"
                    style={modalInput}
                  />
                  <select id="nj-brand" defaultValue="Poshish Wala" style={modalSelect}>
                    {BRAND_OPTS.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                  <div style={{ display: "flex", gap: 10 }}>
                    <input
                      id="nj-total"
                      type="number"
                      inputMode="numeric"
                      placeholder="Total amount (Rs)"
                      style={{ ...modalInput, flex: 1 }}
                    />
                    <input
                      id="nj-adv"
                      type="number"
                      inputMode="numeric"
                      placeholder="Advance (Rs)"
                      style={{ ...modalInput, flex: 1 }}
                    />
                  </div>
                  <button onClick={saveNew} style={modalSaveBtn}>
                    Save client
                  </button>
                </div>
              )}

              {/* payment */}
              {modal === "pay" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
                  <select
                    id="pay-client"
                    defaultValue={selectedId ?? undefined}
                    style={modalSelect}
                  >
                    {views.map((o) => (
                      <option key={o.id} value={o.id}>
                        {o.name}
                      </option>
                    ))}
                  </select>
                  <input
                    id="pay-label"
                    placeholder="Note, e.g. second instalment"
                    style={modalInput}
                  />
                  <input
                    id="pay-amt"
                    type="number"
                    inputMode="numeric"
                    placeholder="Amount received (Rs)"
                    style={modalInput}
                  />
                  <label style={dateLabel}>
                    Date &amp; time received
                    <input
                      id="pay-date"
                      type="datetime-local"
                      defaultValue={todayStr()}
                      style={modalInput}
                    />
                  </label>
                  <button onClick={savePay} style={modalSaveBtn}>
                    Record payment
                  </button>
                </div>
              )}

              {/* cost */}
              {modal === "cost" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
                  <select
                    id="cost-client"
                    defaultValue={selectedId ?? undefined}
                    style={modalSelect}
                  >
                    {views.map((o) => (
                      <option key={o.id} value={o.id}>
                        {o.name}
                      </option>
                    ))}
                  </select>
                  <select id="cost-cat" defaultValue="Material" style={modalSelect}>
                    {CATEGORY_OPTS.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                  <input
                    id="cost-label"
                    placeholder="Note, e.g. velvet fabric (optional)"
                    style={modalInput}
                  />
                  <input
                    id="cost-amt"
                    type="number"
                    inputMode="numeric"
                    placeholder="Amount (Rs)"
                    style={modalInput}
                  />
                  <label style={dateLabel}>
                    Date &amp; time paid
                    <input
                      id="cost-date"
                      type="datetime-local"
                      defaultValue={todayStr()}
                      style={modalInput}
                    />
                  </label>
                  <button onClick={saveCost} style={modalSaveBtn}>
                    Log expense
                  </button>
                </div>
              )}

              {/* edit */}
              {modal === "edit" && current && (
                <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
                  <input
                    id="ed-name"
                    defaultValue={current.name}
                    placeholder="Client name"
                    style={modalInput}
                  />
                  <input
                    id="ed-area"
                    defaultValue={current.area}
                    placeholder="Area"
                    style={modalInput}
                  />
                  <input
                    id="ed-phone"
                    defaultValue={current.raw.phone ?? ""}
                    placeholder="Phone"
                    style={modalInput}
                  />
                  <input
                    id="ed-work"
                    defaultValue={current.work}
                    placeholder="Work"
                    style={modalInput}
                  />
                  <select id="ed-brand" defaultValue={current.brand} style={modalSelect}>
                    {BRAND_OPTS.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                  <input
                    id="ed-total"
                    type="number"
                    inputMode="numeric"
                    defaultValue={current.totalNum}
                    placeholder="Total amount (Rs)"
                    style={modalInput}
                  />
                  <button onClick={saveEdit} style={modalSaveBtn}>
                    Save details
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ===== ACCOUNT / SETTINGS SHEET ===== */}
        {accountOpen && (
          <div onClick={() => setAccountOpen(false)} style={sheetOverlay}>
            <div onClick={(e) => e.stopPropagation()} style={sheetCard}>
              <div style={sheetHeader}>
                <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      background: "#e7ece9",
                      color: "#1f7a6d",
                      fontWeight: 600,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {authInitial}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 15 }}>{authName}</div>
                    <div style={{ fontSize: 12, color: "#8b9199" }}>Signed in</div>
                  </div>
                </div>
                <button onClick={() => setAccountOpen(false)} style={sheetClose}>
                  ×
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 6 }}>
                <div
                  style={{
                    fontSize: 11,
                    textTransform: "uppercase",
                    letterSpacing: ".4px",
                    color: "#9aa0a8",
                    fontWeight: 600,
                  }}
                >
                  Your data
                </div>
                <button onClick={exportData} style={sheetAction}>
                  ⬇  Back up my data (save a file)
                </button>
                <label style={{ ...sheetAction, display: "block", cursor: "pointer" }}>
                  ⬆  Restore from a backup file
                  <input
                    type="file"
                    accept="application/json,.json"
                    onChange={importData}
                    style={{ display: "none" }}
                  />
                </label>
                <div style={{ fontSize: 11, color: "#a7adb4", lineHeight: 1.5 }}>
                  Your records are saved on this device. Back up now and then, and use
                  the same file to move them to another phone.
                </div>
              </div>

              <button
                onClick={doLogout}
                style={{ ...loginBtn, background: "#25292e", marginTop: 16 }}
              >
                Log out
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* --------------------------- style helpers --------------------------- */

const avatar = (size: number, font: number): React.CSSProperties => ({
  width: size,
  height: size,
  borderRadius: "50%",
  background: "#e7ece9",
  color: "#1f7a6d",
  fontWeight: 600,
  fontSize: font,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flex: "none",
});

const miniCap: React.CSSProperties = {
  fontSize: 10,
  textTransform: "uppercase",
  color: "#9aa0a8",
  letterSpacing: ".4px",
};

const smallAddBtn: React.CSSProperties = {
  border: "1px solid #cfd4da",
  background: "#fff",
  fontSize: 12,
  fontWeight: 500,
  padding: "5px 11px",
  borderRadius: 8,
  cursor: "pointer",
};

const lineRow: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  padding: "8px 0",
  borderBottom: "1px dotted #e6e9ec",
  fontSize: 14,
};

const removeBtn: React.CSSProperties = {
  border: "none",
  background: "none",
  color: "#c15b4a",
  fontSize: 11,
  cursor: "pointer",
  textDecoration: "underline",
};

const emptyItalic: React.CSSProperties = {
  fontSize: 13,
  color: "#8b9199",
  fontStyle: "italic",
};

const catPill: React.CSSProperties = {
  fontSize: 10,
  fontWeight: 500,
  color: "#8a6d1f",
  background: "#f7efd6",
  borderRadius: 20,
  padding: "2px 8px",
};

const barTrack: React.CSSProperties = {
  height: 11,
  background: "#f0f2f4",
  borderRadius: 20,
  overflow: "hidden",
};

const legendDot = (bg: string): React.CSSProperties => ({
  display: "inline-block",
  width: 11,
  height: 11,
  borderRadius: 3,
  background: bg,
  verticalAlign: "middle",
});

const darkBtn: React.CSSProperties = {
  border: "none",
  background: "#25292e",
  color: "#fff",
  fontSize: 13,
  fontWeight: 600,
  padding: "9px 16px",
  borderRadius: 9,
  cursor: "pointer",
};

const termLabel: React.CSSProperties = {
  fontSize: 12,
  color: "#5a6069",
  display: "flex",
  flexDirection: "column",
  gap: 5,
};

const termArea: React.CSSProperties = {
  padding: "10px 12px",
  border: "1px solid #d7dbe0",
  borderRadius: 9,
  fontSize: 13,
  fontFamily: "inherit",
  resize: "vertical",
};

const preparedCap: React.CSSProperties = {
  fontSize: 11,
  textTransform: "uppercase",
  letterSpacing: ".5px",
  color: "#9aa0a8",
  fontWeight: 700,
};

const docHeadRow: React.CSSProperties = {
  display: "flex",
  padding: "11px 14px",
  borderRadius: "8px 8px 0 0",
  fontSize: 11,
  textTransform: "uppercase",
  letterSpacing: ".5px",
  fontWeight: 700,
};

const docItemRow: React.CSSProperties = {
  display: "flex",
  padding: "13px 14px",
  border: "1px solid #eceef1",
  borderTop: "none",
  fontSize: 14,
};

const totalLabel: React.CSSProperties = {
  fontSize: 13,
  textTransform: "uppercase",
  letterSpacing: ".5px",
  color: "#5a6069",
  fontWeight: 700,
};

const termsText: React.CSSProperties = {
  fontSize: 13,
  color: "#5a6069",
  lineHeight: 1.55,
};

const dateLabel: React.CSSProperties = {
  fontSize: 12,
  color: "#8b9199",
  display: "flex",
  flexDirection: "column",
  gap: 5,
};

function logoImg(src: string, alt: string, height: number) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      style={{
        height,
        width: "auto",
        display: "block",
        maxWidth: 260,
        objectFit: "contain",
      }}
    />
  );
}


/* --------------------- login + app-shell helpers --------------------- */

/**
 * Front-door accounts (client-side gate). Edit this list to add or change who
 * can sign in. NOTE: this keeps casual users out but is not strong security —
 * the app is public, so anyone technical who opens it could read these. For a
 * private team tool that is the accepted trade-off.
 */
const USERS: { username: string; password: string; name: string }[] = [
  { username: "poshishwala", password: "poshish2024", name: "Poshish Wala" },
];

const PW_FONT_CSS = `@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
.pw-app{font-family:'Poppins',system-ui,sans-serif;color:#25292e;-webkit-text-size-adjust:100%}
.pw-app *{box-sizing:border-box}
.pw-app input,.pw-app button{font-family:'Poppins',sans-serif}
.pw-app ::placeholder{color:#a7adb4}`;

const bottomNavDef: [Screen, string][] = [
  ["dashboard", "Home"],
  ["customers", "Clients"],
  ["quote", "Quote"],
  ["expenses", "Expenses"],
  ["reports", "Reports"],
];

const loginWrap: React.CSSProperties = {
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 20,
  background: "#f4f6f8",
};
const loginCard: React.CSSProperties = {
  width: "100%",
  maxWidth: 360,
  background: "#fff",
  borderRadius: 16,
  padding: "28px 24px",
  display: "flex",
  flexDirection: "column",
  gap: 14,
  boxShadow: "0 10px 40px rgba(0,0,0,.08)",
  border: "1px solid #e2e5e9",
};
const loginLogo: React.CSSProperties = {
  width: 56,
  height: 56,
  borderRadius: 14,
  background: "#1f7a6d",
  color: "#fff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: 600,
  fontSize: 20,
};
const loginInput: React.CSSProperties = {
  padding: "12px 13px",
  border: "1px solid #d7dbe0",
  borderRadius: 10,
  fontSize: 14,
  outline: "none",
};
const loginBtn: React.CSSProperties = {
  border: "none",
  background: "#1f7a6d",
  color: "#fff",
  fontWeight: 600,
  fontSize: 15,
  padding: 13,
  borderRadius: 11,
  cursor: "pointer",
};

const sheetOverlay: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "rgba(20,30,35,.4)",
  zIndex: 50,
  display: "flex",
  alignItems: "flex-end",
  justifyContent: "center",
};
const sheetCard: React.CSSProperties = {
  background: "#fff",
  width: "100%",
  maxWidth: 460,
  borderRadius: "16px 16px 0 0",
  padding: 22,
  boxShadow: "0 -8px 40px rgba(0,0,0,.18)",
  maxHeight: "92vh",
  overflow: "auto",
};
const sheetHeader: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 8,
};
const sheetClose: React.CSSProperties = {
  border: "none",
  background: "none",
  fontSize: 20,
  color: "#8b9199",
  cursor: "pointer",
  lineHeight: 1,
};
const sheetAction: React.CSSProperties = {
  textAlign: "left",
  border: "1px solid #e2e5e9",
  background: "#fafbfc",
  borderRadius: 10,
  padding: "12px 14px",
  fontSize: 14,
  fontWeight: 500,
  cursor: "pointer",
  width: "100%",
};

const bottomNavBar: React.CSSProperties = {
  position: "fixed",
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 30,
  background: "#fff",
  borderTop: "1px solid #e2e5e9",
  justifyContent: "space-around",
  alignItems: "stretch",
  padding: "6px 4px calc(6px + env(safe-area-inset-bottom))",
  boxShadow: "0 -2px 10px rgba(0,0,0,.04)",
};
const bottomNavItem = (active: boolean): React.CSSProperties => ({
  flex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 3,
  border: "none",
  background: "none",
  cursor: "pointer",
  fontSize: 10.5,
  fontWeight: active ? 600 : 500,
  color: active ? "#1f7a6d" : "#8b9199",
  padding: "4px 2px",
});

function NavIcon({ name, active }: { name: Screen; active: boolean }) {
  const c = active ? "#1f7a6d" : "#8b9199";
  const common = {
    width: 22,
    height: 22,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: c,
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  switch (name) {
    case "dashboard":
      return (
        <svg {...common}>
          <path d="M3 10.5 12 4l9 6.5" />
          <path d="M5 9.5V20h14V9.5" />
        </svg>
      );
    case "customers":
      return (
        <svg {...common}>
          <circle cx="9" cy="8" r="3" />
          <path d="M3 20a6 6 0 0 1 12 0" />
          <path d="M16 5.2a3 3 0 0 1 0 5.6" />
          <path d="M18 20a6 6 0 0 0-3-5.2" />
        </svg>
      );
    case "quote":
      return (
        <svg {...common}>
          <path d="M6 3h8l4 4v14H6z" />
          <path d="M9 9h6M9 13h6M9 17h4" />
        </svg>
      );
    case "expenses":
      return (
        <svg {...common}>
          <rect x="3" y="6" width="18" height="12" rx="2" />
          <circle cx="12" cy="12" r="2.5" />
        </svg>
      );
    case "reports":
      return (
        <svg {...common}>
          <path d="M4 4v16h16" />
          <rect x="7" y="12" width="3" height="5" />
          <rect x="12" y="8" width="3" height="9" />
          <rect x="17" y="14" width="3" height="3" />
        </svg>
      );
    default:
      return null;
  }
}
