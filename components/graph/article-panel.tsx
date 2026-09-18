"use client";

import { ArrowUpRight, Pencil, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import NotebookRenderer from "@/components/NotebookRenderer";
import type { ArticlePayload } from "@/lib/article-payload";

/**
 * The reading panel that slides in when a node is opened on the map.
 *
 * Content is fetched from the statically generated article endpoint and handed
 * to the same renderers the standalone article page uses, so markdown,
 * notebooks, maths and embedded visualizations behave identically here.
 */

const cache = new Map<string, ArticlePayload>();

function endpointFor(href: string): string | null {
  const match = href.match(/^\/learn\/([^/]+)\/([^/]+)$/);
  return match ? `/api/article/${match[1]}/${match[2]}` : null;
}

export function ArticlePanel({
  href,
  anchor,
  onClose,
}: {
  href: string;
  anchor?: string;
  onClose: () => void;
}) {
  const [article, setArticle] = useState<ArticlePayload | null>(
    () => cache.get(href) ?? null,
  );
  const [error, setError] = useState(false);
  const bodyRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const cached = cache.get(href);
    if (cached) {
      setArticle(cached);
      setError(false);
      return;
    }

    const endpoint = endpointFor(href);
    if (!endpoint) {
      setError(true);
      return;
    }

    let live = true;
    setArticle(null);
    setError(false);
    fetch(endpoint)
      .then((response) => {
        if (!response.ok) throw new Error(String(response.status));
        return response.json() as Promise<ArticlePayload>;
      })
      .then((payload) => {
        cache.set(href, payload);
        if (live) setArticle(payload);
      })
      .catch(() => {
        if (live) setError(true);
      });

    return () => {
      live = false;
    };
  }, [href]);

  // Move focus into the panel so Escape and scrolling land here, not the map.
  useEffect(() => {
    panelRef.current?.focus({ preventScroll: true });
  }, []);

  // Jump to the heading whose node was clicked, once its markup exists.
  useEffect(() => {
    if (!article) return;
    const body = bodyRef.current;
    if (!body) return;
    if (!anchor) {
      body.scrollTo({ top: 0 });
      return;
    }
    const target = body.querySelector(`#${CSS.escape(anchor)}`);
    target?.scrollIntoView({ block: "start", behavior: "smooth" });
  }, [article, anchor]);

  return (
    <aside
      ref={panelRef}
      tabIndex={-1}
      aria-label={article?.title ?? "Article"}
      className="ngraph-panel absolute inset-0 z-30 flex flex-col border-line bg-background sm:inset-y-0 sm:right-0 sm:left-auto sm:w-full sm:max-w-[760px] sm:border-l lg:w-[52vw]"
    >
      <header className="flex items-start justify-between gap-4 border-b border-line px-6 py-4 sm:px-8">
        <div className="min-w-0">
          <p className="eyebrow truncate">{article?.categoryTitle ?? " "}</p>
          <h2 className="mt-1 truncate font-display text-2xl">
            {article?.title ?? "Loading…"}
          </h2>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          {article && (
            <>
              <Link
                href={href}
                title="Open the full page"
                className="rounded-full p-2 text-muted transition-colors hover:bg-surface-2 hover:text-foreground"
              >
                <ArrowUpRight size={17} aria-hidden="true" />
                <span className="sr-only">Open the full page</span>
              </Link>
              <a
                href={article.editUrl}
                target="_blank"
                rel="noreferrer"
                title="Edit on GitHub"
                className="rounded-full p-2 text-muted transition-colors hover:bg-surface-2 hover:text-foreground"
              >
                <Pencil size={16} aria-hidden="true" />
                <span className="sr-only">Edit on GitHub</span>
              </a>
            </>
          )}
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-muted transition-colors hover:bg-surface-2 hover:text-foreground"
          >
            <X size={18} aria-hidden="true" />
            <span className="sr-only">Close and return to the map</span>
          </button>
        </div>
      </header>

      <div
        ref={bodyRef}
        className="min-h-0 flex-1 overflow-y-auto px-6 sm:px-8"
      >
        {error && (
          <p className="py-16 text-center text-muted">
            This article could not be loaded.{" "}
            <Link href={href} className="text-purple-deep underline">
              Open the full page
            </Link>
            .
          </p>
        )}

        {!error && !article && <PanelSkeleton />}

        {article && (
          <article className="py-8">
            {article.notebook ? (
              <NotebookRenderer notebook={article.notebook} />
            ) : (
              <MarkdownRenderer content={article.content} />
            )}
            <footer className="mt-12 space-y-3 border-t border-line pt-8 pb-10 text-sm text-muted">
              {article.contributors.length > 0 && (
                <p>
                  <span className="eyebrow mr-3">Contributors</span>
                  {article.contributors.join(", ")}
                </p>
              )}
              {article.updatedAt && (
                <p>
                  <span className="eyebrow mr-3">Last updated</span>
                  {article.updatedAt}
                </p>
              )}
            </footer>
          </article>
        )}
      </div>
    </aside>
  );
}

function PanelSkeleton() {
  return (
    <div className="animate-pulse space-y-4 py-10" aria-hidden="true">
      <div className="h-3 w-1/3 rounded bg-surface-2" />
      <div className="h-3 w-full rounded bg-surface-2" />
      <div className="h-3 w-11/12 rounded bg-surface-2" />
      <div className="h-3 w-4/5 rounded bg-surface-2" />
      <div className="h-40 w-full rounded bg-surface" />
      <div className="h-3 w-full rounded bg-surface-2" />
      <div className="h-3 w-3/4 rounded bg-surface-2" />
    </div>
  );
}
