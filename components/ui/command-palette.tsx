"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { navItems } from "@/lib/constants";
import type { SearchEntry } from "@/lib/content";
import { cn } from "@/lib/utils";

const TYPE_LABEL: Record<SearchEntry["type"], string> = {
  page: "Page",
  category: "Category",
  article: "Article",
};

/** Spotlight-style search: ⌘K / Ctrl+K opens, Esc closes. */
export function CommandPalette({ index }: { index: SearchEntry[] }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [isMac, setIsMac] = useState(true);

  const entries = useMemo<SearchEntry[]>(
    () => [
      ...navItems.map((item) => ({
        title: item.name,
        description: item.description,
        path: item.link,
        type: "page" as const,
      })),
      ...index,
    ],
    [index],
  );

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return entries.filter((e) => e.type !== "page").slice(0, 8);
    return entries
      .filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.description?.toLowerCase().includes(q) ||
          e.category?.toLowerCase().includes(q),
      )
      .slice(0, 8);
  }, [entries, query]);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setSelected(0);
  }, []);

  const go = useCallback(
    (entry: SearchEntry) => {
      router.push(entry.path);
      close();
    },
    [router, close],
  );

  useEffect(() => {
    setIsMac(/Mac|iPhone|iPad/.test(navigator.platform));
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      } else if (e.key === "Escape") {
        close();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close]);

  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => inputRef.current?.focus());
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // biome-ignore lint/correctness/useExhaustiveDependencies(results): reset the cursor whenever the visible results change
  useEffect(() => {
    setSelected(0);
  }, [results]);

  const onInputKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelected((s) => Math.min(s + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelected((s) => Math.max(s - 1, 0));
    } else if (e.key === "Enter" && results[selected]) {
      e.preventDefault();
      go(results[selected]);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-full border border-line bg-surface/70 pl-3 pr-2 py-1 text-sm text-muted hover:text-foreground hover:border-foreground/30 transition-colors"
        aria-label="Search"
      >
        <Search size={14} aria-hidden="true" />
        <span className="hidden sm:inline">Search</span>
        <kbd className="hidden sm:inline-flex items-center rounded border border-line bg-background px-1.5 text-[0.7rem] font-mono text-muted">
          {isMac ? "⌘" : "Ctrl"} K
        </kbd>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-[100] flex items-start justify-center bg-foreground/20 backdrop-blur-[2px] px-4 pt-[14vh]"
            onClick={close}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Search"
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.15 }}
              className="w-full max-w-xl overflow-hidden rounded-xl border border-line bg-background shadow-2xl shadow-foreground/10"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 border-b border-line px-4">
                <Search size={18} className="text-muted" aria-hidden="true" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={onInputKey}
                  placeholder="Search the encyclopedia…"
                  className="w-full bg-transparent py-4 text-base text-foreground placeholder:text-muted focus:outline-none"
                />
                <kbd className="hidden sm:inline rounded border border-line px-1.5 text-[0.7rem] font-mono text-muted">
                  esc
                </kbd>
              </div>

              <ul className="max-h-[50vh] overflow-y-auto p-2">
                {results.length === 0 && (
                  <li className="px-3 py-8 text-center text-sm text-muted">
                    No results for “{query}”
                  </li>
                )}
                {results.map((r, i) => (
                  <li key={r.path}>
                    <button
                      type="button"
                      onClick={() => go(r)}
                      onMouseEnter={() => setSelected(i)}
                      className={cn(
                        "flex w-full items-center justify-between gap-4 rounded-md px-3 py-2.5 text-left transition-colors",
                        i === selected ? "bg-purple-wash" : "hover:bg-surface",
                      )}
                    >
                      <span className="min-w-0">
                        <span className="flex items-baseline gap-2">
                          <span className="truncate font-medium text-foreground">
                            {r.title}
                          </span>
                          <span className="shrink-0 text-[0.7rem] uppercase tracking-wider text-muted">
                            {TYPE_LABEL[r.type]}
                            {r.category ? ` · ${r.category}` : ""}
                          </span>
                        </span>
                        {r.description && (
                          <span className="block truncate text-sm text-muted">
                            {r.description}
                          </span>
                        )}
                      </span>
                      <ArrowRight
                        size={14}
                        className={cn(
                          "shrink-0 text-purple-deep transition-opacity",
                          i === selected ? "opacity-100" : "opacity-0",
                        )}
                        aria-hidden="true"
                      />
                    </button>
                  </li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
