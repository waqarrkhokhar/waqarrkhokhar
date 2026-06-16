"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Lightweight rich-text editor (no external deps) for CMS page content.
 * Supports headings, bold/italic, lists, and links with a target choice
 * (open in a new tab or the same tab) - ideal for internal linking.
 */
export default function RichTextEditor({
  value,
  onChange,
  minHeight = 280,
}: {
  value: string;
  onChange: (html: string) => void;
  minHeight?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const savedRange = useRef<Range | null>(null);
  const [linkOpen, setLinkOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [linkText, setLinkText] = useState("");
  const [linkNewTab, setLinkNewTab] = useState(false);

  // Seed initial HTML once (uncontrolled thereafter to keep the caret stable).
  useEffect(() => {
    if (ref.current && value && ref.current.innerHTML.trim() === "") {
      ref.current.innerHTML = value;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const emit = () => onChange(ref.current?.innerHTML ?? "");

  function exec(cmd: string, arg?: string) {
    ref.current?.focus();
    document.execCommand(cmd, false, arg);
    emit();
  }
  function block(tag: string) {
    ref.current?.focus();
    document.execCommand("formatBlock", false, tag);
    emit();
  }

  function openLink() {
    const sel = window.getSelection();
    if (sel && sel.rangeCount) savedRange.current = sel.getRangeAt(0).cloneRange();
    setLinkText(sel?.toString() ?? "");
    setLinkUrl("");
    setLinkNewTab(false);
    setLinkOpen(true);
  }

  function applyLink() {
    const url = linkUrl.trim();
    if (!url) return setLinkOpen(false);
    ref.current?.focus();
    const sel = window.getSelection();
    if (sel && savedRange.current) {
      sel.removeAllRanges();
      sel.addRange(savedRange.current);
    }
    const collapsed = sel?.isCollapsed ?? true;
    const rel = linkNewTab ? ' rel="noopener noreferrer"' : "";
    const target = linkNewTab ? ' target="_blank"' : "";
    if (collapsed) {
      const text = (linkText || url).replace(/</g, "&lt;");
      document.execCommand("insertHTML", false, `<a href="${url}"${target}${rel}>${text}</a>`);
    } else {
      document.execCommand("createLink", false, url);
      // Apply target/rel to the freshly-created anchor(s).
      ref.current?.querySelectorAll<HTMLAnchorElement>(`a[href="${url}"]`).forEach((a) => {
        if (linkNewTab) { a.target = "_blank"; a.rel = "noopener noreferrer"; }
        else { a.removeAttribute("target"); a.removeAttribute("rel"); }
      });
    }
    setLinkOpen(false);
    emit();
  }

  const Btn = ({ on, title, children }: { on: () => void; title: string; children: React.ReactNode }) => (
    <button type="button" title={title} onMouseDown={(e) => e.preventDefault()} onClick={on}
      className="rounded px-2 py-1 text-[13px] text-ink hover:bg-black/5 dark:text-cream dark:hover:bg-white/10">
      {children}
    </button>
  );

  return (
    <div className="rounded-md border border-line dark:border-white/10">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 border-b border-line bg-panel px-2 py-1.5 dark:border-white/10 dark:bg-white/5">
        <Btn on={() => block("H2")} title="Heading 2"><span className="font-heading font-semibold">H2</span></Btn>
        <Btn on={() => block("H3")} title="Heading 3"><span className="font-heading font-semibold">H3</span></Btn>
        <Btn on={() => block("P")} title="Paragraph">P</Btn>
        <span className="mx-1 h-4 w-px bg-line dark:bg-white/10" />
        <Btn on={() => exec("bold")} title="Bold"><b>B</b></Btn>
        <Btn on={() => exec("italic")} title="Italic"><i>I</i></Btn>
        <span className="mx-1 h-4 w-px bg-line dark:bg-white/10" />
        <Btn on={() => exec("insertUnorderedList")} title="Bullet list">• List</Btn>
        <Btn on={() => exec("insertOrderedList")} title="Numbered list">1. List</Btn>
        <span className="mx-1 h-4 w-px bg-line dark:bg-white/10" />
        <Btn on={openLink} title="Insert link">🔗 Link</Btn>
        <Btn on={() => exec("unlink")} title="Remove link">Unlink</Btn>
        <Btn on={() => exec("removeFormat")} title="Clear formatting">Clear</Btn>
      </div>

      {/* Editable area */}
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        onInput={emit}
        onBlur={emit}
        className="rich-text px-4 py-3 text-ink outline-none dark:text-cream"
        style={{ minHeight }}
      />

      {/* Link dialog */}
      {linkOpen && (
        <div className="flex flex-wrap items-end gap-2 border-t border-line bg-panel px-3 py-2.5 dark:border-white/10 dark:bg-white/5">
          <div className="min-w-[180px] flex-1">
            <label className="mb-1 block text-[11px] font-medium text-muted">Link URL</label>
            <input autoFocus value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} placeholder="/sofas/sofa-chair/ or https://…"
              className="w-full rounded border border-line bg-white px-2.5 py-1.5 text-[13px] outline-none focus:border-gold dark:border-white/10 dark:bg-white/5" />
          </div>
          {!linkText && (
            <div className="min-w-[140px] flex-1">
              <label className="mb-1 block text-[11px] font-medium text-muted">Link text</label>
              <input value={linkText} onChange={(e) => setLinkText(e.target.value)} placeholder="Shown text"
                className="w-full rounded border border-line bg-white px-2.5 py-1.5 text-[13px] outline-none focus:border-gold dark:border-white/10 dark:bg-white/5" />
            </div>
          )}
          <label className="flex items-center gap-1.5 pb-1.5 text-[12px] text-ink dark:text-cream">
            <input type="checkbox" checked={linkNewTab} onChange={(e) => setLinkNewTab(e.target.checked)} />
            Open in new tab
          </label>
          <button type="button" onClick={applyLink} className="rounded bg-gold px-3 py-1.5 text-[12px] font-semibold text-white">Apply</button>
          <button type="button" onClick={() => setLinkOpen(false)} className="rounded px-2 py-1.5 text-[12px] text-muted">Cancel</button>
        </div>
      )}
    </div>
  );
}
