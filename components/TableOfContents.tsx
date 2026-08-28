"use client";

import type React from "react";
import { useEffect, useState } from "react";
import type { Heading } from "@/lib/markdown-utils";
import { cn } from "@/lib/utils";

interface TableOfContentsProps {
  headings: Heading[];
  className?: string;
}

const TableOfContents: React.FC<TableOfContentsProps> = ({
  headings,
  className = "",
}) => {
  const [activeId, setActiveId] = useState<string>("");

  // biome-ignore lint/correctness/useExhaustiveDependencies(headings): re-observe DOM heading elements whenever the headings prop changes, since the rendered heading elements change with it
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-100px 0px -80% 0px", threshold: 0.1 },
    );

    const headingElements = document.querySelectorAll("h1[id], h2[id], h3[id]");
    headingElements.forEach((element) => {
      observer.observe(element);
    });

    return () => {
      headingElements.forEach((element) => {
        observer.unobserve(element);
      });
    };
  }, [headings]);

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (!element) return;
    const offset = 100;
    const top =
      element.getBoundingClientRect().top + window.pageYOffset - offset;
    window.scrollTo({ top, behavior: "smooth" });
  };

  const renderHeading = (heading: Heading) => {
    const isActive = activeId === heading.id;
    const indent = `${(heading.level - 1) * 0.75}rem`;

    return (
      <div key={heading.id}>
        <button
          type="button"
          onClick={() => scrollToHeading(heading.id)}
          className={cn(
            "block w-full text-left text-sm py-1 pr-2 border-l transition-colors",
            isActive
              ? "border-purple-deep text-foreground"
              : "border-transparent text-muted hover:text-foreground",
          )}
          style={{ paddingLeft: `calc(0.75rem + ${indent})` }}
        >
          {heading.text}
        </button>
        {heading.children.length > 0 && (
          <div>{heading.children.map((child) => renderHeading(child))}</div>
        )}
      </div>
    );
  };

  if (headings.length === 0) {
    return null;
  }

  return (
    <nav className={cn("flex flex-col", className)} aria-label="On this page">
      <h3 className="eyebrow mb-3">On this page</h3>
      <div
        className="flex flex-col overflow-y-auto border-l border-line -ml-px"
        style={{ maxHeight: "calc(100vh - 260px)" }}
      >
        {headings.map((heading) => renderHeading(heading))}
      </div>
      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="mt-4 text-left text-sm text-muted hover:text-foreground transition-colors"
      >
        Back to top
      </button>
    </nav>
  );
};

export default TableOfContents;
