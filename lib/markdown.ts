/**
 * Minimal, dependency-free Markdown → HTML for blog content.
 * Supports headings, bold/italic, links, images, blockquotes, lists, hr and
 * paragraphs — the subset produced by the blog editor toolbar. Output is meant
 * to be rendered inside a `.rich-text` container.
 */
function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function inline(s: string): string {
  let t = escapeHtml(s);
  // images ![alt](url)
  t = t.replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g, '<img src="$2" alt="$1" referrerpolicy="no-referrer" />');
  // links [text](url) with optional attributes {nofollow newtab}
  t = t.replace(/\[([^\]]+)\]\(([^)\s]+)\)(?:\{([^}]*)\})?/g, (_m, text, url, attrs) => {
    const a = String(attrs || "").toLowerCase();
    const nofollow = /nofollow/.test(a);
    const newtab = /newtab|blank/.test(a);
    const external = /^https?:\/\//i.test(url) && !/comfyclub\.pk/i.test(url);
    const rel: string[] = [];
    if (nofollow) rel.push("nofollow");
    if (newtab || external) rel.push("noopener");
    const relAttr = rel.length ? ` rel="${rel.join(" ")}"` : "";
    const targetAttr = newtab ? ' target="_blank"' : "";
    return `<a href="${url}"${relAttr}${targetAttr}>${text}</a>`;
  });
  // bold **text**
  t = t.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  // italic _text_ or *text*
  t = t.replace(/(^|[^*])\*([^*]+)\*/g, "$1<em>$2</em>");
  t = t.replace(/_([^_]+)_/g, "<em>$1</em>");
  // inline code `code`
  t = t.replace(/`([^`]+)`/g, "<code>$1</code>");
  return t;
}

export function markdownToHtml(md: string | null | undefined): string {
  if (!md) return "";
  // If it already looks like HTML, pass through.
  if (/<(p|h[1-6]|ul|ol|div|img|blockquote)\b/i.test(md)) return md;

  const lines = md.replace(/\r\n/g, "\n").split("\n");
  const out: string[] = [];
  let list: "ul" | "ol" | null = null;
  const closeList = () => { if (list) { out.push(`</${list}>`); list = null; } };

  for (const raw of lines) {
    const line = raw.trimEnd();
    if (!line.trim()) { closeList(); continue; }

    const h = line.match(/^(#{1,4})\s+(.*)$/);
    if (h) { closeList(); const lvl = Math.min(h[1].length + 1, 4); out.push(`<h${lvl}>${inline(h[2])}</h${lvl}>`); continue; }

    if (/^(---|\*\*\*|___)\s*$/.test(line)) { closeList(); out.push("<hr/>"); continue; }

    if (/^>\s?/.test(line)) { closeList(); out.push(`<blockquote>${inline(line.replace(/^>\s?/, ""))}</blockquote>`); continue; }

    const ul = line.match(/^[-*]\s+(.*)$/);
    if (ul) { if (list !== "ul") { closeList(); out.push("<ul>"); list = "ul"; } out.push(`<li>${inline(ul[1])}</li>`); continue; }

    const ol = line.match(/^\d+\.\s+(.*)$/);
    if (ol) { if (list !== "ol") { closeList(); out.push("<ol>"); list = "ol"; } out.push(`<li>${inline(ol[1])}</li>`); continue; }

    closeList();
    out.push(`<p>${inline(line)}</p>`);
  }
  closeList();
  return out.join("\n");
}
