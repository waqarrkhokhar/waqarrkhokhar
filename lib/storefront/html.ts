/**
 * CMS rich-text helpers.
 *
 * The migrated WooCommerce content is stored as HTML but with literal "\n"
 * sequences (escaped newlines that were never un-escaped) and Google-Sheets
 * wrapper spans. It also packs the whole product body — title, intro, key
 * features, "perfect for", dimensions, etc. — into one long_description blob.
 * These helpers clean that up and split it into the sections the prototype
 * product page expects.
 */

/** Strip literal escape sequences and editor cruft from stored CMS HTML. */
export function cleanHtml(html: string | null | undefined): string {
  if (!html) return "";
  return html
    .replace(/\\r\\n|\\n|\\r/g, "\n") // literal backslash-n → real newline (collapses in HTML)
    .replace(/\\t/g, " ")
    .replace(/\\"/g, '"')
    .replace(/\\'/g, "'")
    .replace(/<span[^>]*data-sheets-root[^>]*>/gi, "")
    .replace(/<span[^>]*data-sheets-value[^>]*>/gi, "")
    .replace(/<\/span>/gi, "")
    .trim();
}

function stripTags(s: string): string {
  return s.replace(/<[^>]+>/g, "").trim();
}

/** Clean CMS HTML down to plain text (for banners, meta, list intros). */
export function stripTagsPlain(s: string | null | undefined): string {
  return stripTags(cleanHtml(s)).replace(/\s+/g, " ").trim();
}

export type Dimensions = { width?: string; depth?: string; height?: string; seatHeight?: string };

export type ParsedBody = {
  /** Description-tab HTML: intro + remaining sections (no Key Features / Dimensions). */
  descriptionHtml: string;
  /** Bullet list for the Features tab. */
  features: string[];
  /** Parsed dimensions, rendered as a grid. */
  dimensions: Dimensions | null;
};

/**
 * Parse a WooCommerce product body into the prototype's sections.
 * Splits on <h3> headings; pulls out "Key Features" (→ Features tab) and
 * "Dimensions" (→ grid), leaving the rest as the Description tab.
 */
export function parseProductBody(raw: string | null | undefined): ParsedBody {
  const clean = cleanHtml(raw);
  if (!clean) return { descriptionHtml: "", features: [], dimensions: null };

  // Split into a lead block (before first <h3>) plus titled sections.
  const parts = clean.split(/<h3[^>]*>/i);
  const lead = parts[0] ?? "";
  const sections: { title: string; html: string }[] = [];
  for (let i = 1; i < parts.length; i++) {
    const m = parts[i].match(/^([\s\S]*?)<\/h3>([\s\S]*)$/i);
    if (m) sections.push({ title: stripTags(m[1]), html: m[2] });
    else sections.push({ title: "", html: parts[i] });
  }

  let features: string[] = [];
  let dimensions: Dimensions | null = null;
  const keep: { title: string; html: string }[] = [];

  for (const s of sections) {
    const t = s.title.toLowerCase();
    if (/feature/.test(t)) {
      features = (s.html.match(/<li[^>]*>([\s\S]*?)<\/li>/gi) ?? [])
        .map((li) => stripTags(li))
        .filter(Boolean);
      continue;
    }
    if (/dimension/.test(t)) {
      dimensions = parseDimensions(stripTags(s.html));
      continue;
    }
    keep.push(s);
  }

  const descriptionHtml =
    lead + keep.map((s) => `<h3>${s.title}</h3>${s.html}`).join("");

  return { descriptionHtml: descriptionHtml.trim(), features, dimensions };
}

function parseDimensions(text: string): Dimensions | null {
  const grab = (label: string) => {
    const m = text.match(new RegExp(label + "\\s*:?\\s*([0-9]+(?:\\.[0-9]+)?\\s*cm)", "i"));
    return m ? m[1].replace(/\s+/g, " ").trim() : undefined;
  };
  const d: Dimensions = {
    width: grab("width"),
    depth: grab("depth"),
    height: grab("height"),
    seatHeight: grab("seat\\s*height"),
  };
  return d.width || d.depth || d.height || d.seatHeight ? d : null;
}
