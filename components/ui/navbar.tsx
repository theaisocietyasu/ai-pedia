"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { SearchEntry } from "@/lib/content";
import { cn } from "@/lib/utils";
import { CommandPalette } from "./command-palette";

/** Hairline top bar: wordmark on the left, spotlight search on the right. */
export function Navbar({ searchIndex }: { searchIndex: SearchEntry[] }) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 h-12 border-b transition-colors duration-200",
          isScrolled
            ? "bg-background/90 backdrop-blur border-line"
            : "bg-transparent border-transparent",
        )}
      >
        <nav className="container flex h-12 items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <img
              src="/logo.png"
              alt=""
              className="h-6 w-6 rounded-sm object-cover"
            />
            <span className="font-display text-lg leading-none text-foreground">
              AI Pedia
            </span>
          </Link>
          <CommandPalette index={searchIndex} />
        </nav>
      </header>
      <div className="h-12" aria-hidden="true" />
    </>
  );
}
