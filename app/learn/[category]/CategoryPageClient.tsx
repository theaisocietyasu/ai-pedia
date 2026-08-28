"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { ArticleMeta, Category } from "@/lib/content";

interface CategoryPageClientProps {
  category: Category;
  articles: ArticleMeta[];
}

export function CategoryPageClient({
  category,
  articles,
}: CategoryPageClientProps) {
  const [activeId, setActiveId] = useState<string>("");
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const manualScrollTarget = useRef<string | null>(null);
  const rafIdRef = useRef<number | null>(null);

  // compute the card whose center is closest to viewport center
  const computeClosestId = () => {
    const centerY = window.innerHeight / 2;
    let closestId = "";
    let minDistance = Infinity;

    cardRefs.current.forEach((card) => {
      if (!card) return;
      const rect = card.getBoundingClientRect();
      const cardCenter = rect.top + rect.height / 2;
      const distance = Math.abs(centerY - cardCenter);
      if (distance < minDistance) {
        minDistance = distance;
        closestId = card.id;
      }
    });

    return closestId;
  };

  // raf-throttled scroll handler
  // biome-ignore lint/correctness/useExhaustiveDependencies: intentionally re-runs only when articles change; adding activeId/computeClosestId would re-register the scroll listener on every scroll update
  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      rafIdRef.current = requestAnimationFrame(() => {
        // if a manual scroll to a target is in progress, do not update activeId here
        if (!manualScrollTarget.current) {
          const closest = computeClosestId();
          if (closest && closest !== activeId) {
            setActiveId(closest);
          }
        }
        ticking = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    // initialize activeId on mount
    rafIdRef.current = requestAnimationFrame(() => {
      const closest = computeClosestId();
      if (closest) setActiveId(closest);
    });

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [articles]); // re-run if articles change

  // Programmatic scroll to center + watch until centered
  const scrollToCenter = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;

    // mark manual scroll in progress and immediately set activeId
    manualScrollTarget.current = id;
    setActiveId(id);

    el.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "nearest",
    });

    const start = performance.now();
    const maxDuration = 2000; // fallback: stop watching after 2s

    const watch = () => {
      const rect = el.getBoundingClientRect();
      const elCenter = rect.top + rect.height / 2;
      const centerY = window.innerHeight / 2;
      const distance = Math.abs(elCenter - centerY);

      // consider centered if within 8 pixels (tweakable)
      if (distance <= 8 || performance.now() - start > maxDuration) {
        manualScrollTarget.current = null;
        setActiveId(id); // ensure final state
        return;
      }

      rafIdRef.current = requestAnimationFrame(watch);
    };

    // start watching
    if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    rafIdRef.current = requestAnimationFrame(watch);
  };

  // cleanup RAF on unmount
  useEffect(() => {
    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, []);

  return (
    <div className="w-full max-w-5xl mt-12 flex flex-col items-center gap-16">
      {/* Title */}
      <div className="relative inline-block mb-6 text-center max-w-3xl">
        <p className="eyebrow mb-5">
          <Link
            href="/learn"
            className="hover:text-foreground transition-colors"
          >
            Learn
          </Link>
        </p>
        <h1 className="font-display text-4xl md:text-6xl leading-tight relative z-10">
          {category.title}
        </h1>

        {category.description && (
          <p className="mt-5 text-lg text-ink-2 max-w-2xl mx-auto">
            {category.description}
          </p>
        )}
      </div>

      {/* Wrapper for cards + sidebar */}
      <div className="w-full flex justify-between gap-16 relative">
        {/* Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-col gap-6 w-full min-w-0"
        >
          {articles.length === 0 && (
            <p className="text-muted">
              No articles in this category yet. Add a markdown file under{" "}
              <code>content/{category.slug}/</code>.
            </p>
          )}
          {articles.map((item, index) => {
            const id = item.slug;
            return (
              <motion.div
                key={id}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.2 }}
                id={id}
                ref={(el) => {
                  cardRefs.current[index] = el;
                }}
                className="w-full"
              >
                <Link
                  key={id}
                  href={`/learn/${category.slug}/${item.slug}`}
                  className="group flex flex-col md:flex-row items-center gap-6 md:gap-10 p-5 rounded-lg bg-surface border border-line hover:border-purple transition-colors"
                >
                  {item.thumbnail && (
                    <img
                      src={item.thumbnail}
                      alt=""
                      className="w-full md:w-1/3 md:min-w-[200px] h-48 md:h-52 rounded-md border border-line object-cover flex-shrink-0"
                    />
                  )}

                  {/* Text */}
                  <div className="flex-1 text-center md:text-left min-w-0">
                    <h2 className="font-display text-2xl md:text-3xl mb-2 line-clamp-2 group-hover:text-purple-deep transition-colors">
                      {item.title}
                    </h2>
                    <p className="text-base text-ink-2 line-clamp-4">
                      {item.description}
                    </p>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Sidebar (sticky, not fixed) */}
        <div className="hidden lg:flex flex-col lg:w-56 shrink-0 sticky top-20 self-start border-l border-line">
          <p className="eyebrow mb-3 pl-3">Modules</p>
          {articles.map((item) => {
            const id = item.slug;
            const isActive = activeId === id;
            return (
              <button
                type="button"
                key={id}
                onClick={() => scrollToCenter(id)}
                className={`text-sm transition-colors py-1 pl-3 -ml-px border-l text-left ${
                  isActive
                    ? "border-purple-deep text-foreground"
                    : "border-transparent text-muted hover:text-foreground cursor-pointer"
                }`}
              >
                {item.title}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
