/**
 * Convert pasted rich HTML (Word / Google Docs / web pages) into the Markdown
 * the blog editor uses — preserving headings, bold, italic, links, and lists.
 * Browser-only (uses DOMParser); call it from a paste handler.
 */
export function htmlToMarkdown(html: string): string {
  if (typeof window === "undefined" || !html) return "";
  const doc = new DOMParser().parseFromString(html, "text/html");
  // Drop noise Word/Docs inject.
  doc.querySelectorAll("style, script, meta, link, title, o\\:p").forEach((n) => n.remove());

  const inline = (node: Node): string => {
    let out = "";
    node.childNodes.forEach((c) => (out += render(c, true)));
    return out;
  };

  const isBold = (el: HTMLElement) => {
    const w = el.style.fontWeight;
    return el.tagName === "B" || el.tagName === "STRONG" || w === "bold" || (parseInt(w, 10) >= 600);
  };
  const isItalic = (el: HTMLElement) => el.tagName === "I" || el.tagName === "EM" || el.style.fontStyle === "italic";

  const render = (node: Node, inlineCtx = false): string => {
    if (node.nodeType === Node.TEXT_NODE) {
      return (node.textContent || "").replace(/\s+/g, " ");
    }
    if (node.nodeType !== Node.ELEMENT_NODE) return "";
    const el = node as HTMLElement;
    const tag = el.tagName.toLowerCase();

    switch (tag) {
      case "h1": case "h2": case "h3": case "h4": case "h5": case "h6": {
        const lvl = Math.min(Number(tag[1]) + 1, 4); // demote (page already has an h1)
        return `\n\n${"#".repeat(lvl)} ${inline(el).trim()}\n\n`;
      }
      case "p": case "div": {
        const t = inline(el).trim();
        return t ? `\n\n${t}\n\n` : "";
      }
      case "br": return "\n";
      case "hr": return "\n\n---\n\n";
      case "strong": case "b": {
        const t = inline(el).trim();
        return t ? `**${t}**` : "";
      }
      case "em": case "i": {
        const t = inline(el).trim();
        return t ? `_${t}_` : "";
      }
      case "a": {
        const href = el.getAttribute("href") || "";
        const t = inline(el).trim() || href;
        return href ? `[${t}](${href})` : t;
      }
      case "ul": case "ol": {
        let n = 1, out = "\n";
        el.querySelectorAll(":scope > li").forEach((li) => {
          const bullet = tag === "ol" ? `${n++}.` : "-";
          out += `${bullet} ${inline(li).trim()}\n`;
        });
        return out + "\n";
      }
      case "blockquote": return `\n\n> ${inline(el).trim()}\n\n`;
      case "span": {
        let t = inline(el);
        if (t.trim() && isBold(el)) t = `**${t.trim()}**`;
        else if (t.trim() && isItalic(el)) t = `_${t.trim()}_`;
        return t;
      }
      default:
        return inline(el);
    }
    void inlineCtx;
  };

  return inline(doc.body)
    .replace(/ /g, " ")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
