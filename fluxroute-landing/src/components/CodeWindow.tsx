"use client";

import { useState, type ReactNode } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Restrained, brand-cohesive highlighter for the always-dark code window.
 * Order matters: comments and strings are matched before keywords/numbers so
 * their contents are not re-tokenised. Colours stay within the verdigris +
 * warm-mineral family so highlighting communicates structure, not decoration.
 */
const TOKEN_RE =
  /(\/\/[^\n]*)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)|(\b\d+(?:\.\d+)?\b)|(\b(?:import|from|const|let|var|new|async|await|return|export|function|app|require)\b)|(\b(?:true|false|null|undefined)\b)/g;

function highlight(code: string): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0;
  let key = 0;
  TOKEN_RE.lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = TOKEN_RE.exec(code)) !== null) {
    const idx = m.index;
    if (idx > last) out.push(code.slice(last, idx));
    const [full, comment, str, num, keyword, literal] = m;
    let cls = "";
    if (comment) cls = "text-surface-500 italic";
    else if (str) cls = "text-accent-300";
    else if (num) cls = "text-sol-300";
    else if (keyword) cls = "text-accent-200 font-medium";
    else if (literal) cls = "text-sol-200";
    out.push(
      <span key={key++} className={cls}>
        {full}
      </span>
    );
    last = idx + full.length;
  }
  if (last < code.length) out.push(code.slice(last));
  return out;
}

export type CodeTab = { label: string; filename: string; code: string };

type CodeWindowProps = {
  tabs: CodeTab[];
  className?: string;
};

/** macOS-style code window with tabs, copy-to-clipboard, and syntax colour. */
export function CodeWindow({ tabs, className }: CodeWindowProps) {
  const [active, setActive] = useState(0);
  const [copied, setCopied] = useState(false);
  const current = tabs[active];

  async function copy() {
    try {
      await navigator.clipboard.writeText(current.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard may be blocked; no-op */
    }
  }

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-surface-700/60 bg-surface-950 shadow-elevate-lg",
        className
      )}
    >
      {/* Title bar */}
      <div className="flex items-center gap-3 border-b border-surface-700/60 bg-surface-900/80 px-4 py-3">
        <div className="flex items-center gap-1.5" aria-hidden>
          <span className="h-3 w-3 rounded-full bg-[#ff5f57]/80" />
          <span className="h-3 w-3 rounded-full bg-[#febc2e]/80" />
          <span className="h-3 w-3 rounded-full bg-[#28c840]/80" />
        </div>

        {tabs.length > 1 ? (
          <div className="ml-2 flex items-center gap-1" role="tablist" aria-label="Code examples">
            {tabs.map((tab, i) => (
              <button
                key={tab.label}
                role="tab"
                aria-selected={i === active}
                onClick={() => setActive(i)}
                className={cn(
                  "rounded px-2.5 py-1 font-mono text-caption transition-colors",
                  i === active
                    ? "bg-surface-800 text-surface-100"
                    : "text-surface-500 hover:text-surface-300"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        ) : (
          <span className="ml-2 font-mono text-caption text-surface-400">
            {current.filename}
          </span>
        )}

        <button
          type="button"
          onClick={copy}
          className="ml-auto inline-flex items-center gap-1.5 rounded px-2 py-1 font-mono text-caption text-surface-400 transition-colors hover:bg-surface-800 hover:text-surface-200"
          aria-label="Copy code"
        >
          {copied ? <Check size={13} className="text-accent-400" /> : <Copy size={13} />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>

      <pre className="overflow-x-auto p-5 text-body-sm leading-relaxed text-surface-300 scrollbar-none">
        <code className="font-mono">{highlight(current.code)}</code>
      </pre>
    </div>
  );
}
