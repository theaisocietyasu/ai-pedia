"use client";

import type React from "react";
import { useEffect, useState } from "react";
import type { Heading } from "@/lib/markdown-utils";

interface TableOfContentsProps {
  headings: Heading[];
  className?: string;
}

const TableOfContents: React.FC<TableOfContentsProps> = ({
  headings,
  className = "",
}) => {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    // Track active heading based on scroll position
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-100px 0px -80% 0px",
        threshold: 0.1,
      },
    );

    // Observe all headings
    const headingElements = document.querySelectorAll("h1[id], h2[id], h3[id]");
    headingElements.forEach((element) => observer.observe(element));

    return () => {
      headingElements.forEach((element) => observer.unobserve(element));
    };
  }, [headings]);

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100; // Offset for fixed header
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  const renderHeading = (heading: Heading) => {
    const isActive = activeId === heading.id;
    const indent = `${(heading.level - 1) * 0.75}rem`; // Indentation based on level

    return (
      <div key={heading.id}>
        <button
          onClick={() => scrollToHeading(heading.id)}
          className={`
            text-sm font-medium transition-colors py-1.5 px-2 text-left w-full
            ${isActive ? "text-purple bg-purple/10 border-l-2 border-purple" : "text-gray-400 hover:text-gray-200"}
          `}
          style={{ paddingLeft: `calc(0.5rem + ${indent})` }}
        >
          {heading.text}
        </button>
        {/* Render children recursively */}
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
    <div className={`flex flex-col ${className}`}>
      {/* Fixed Header Section */}
      <h3 className="font-semibold mb-3 text-light-gray text-sm uppercase tracking-wide">
        Quick Navigation
      </h3>

      {/* Back to Top button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="text-sm font-medium transition-colors py-1.5 px-2 text-left text-gray-400 hover:text-gray-200 mb-2"
      >
        ↑ Back to Top
      </button>

      <div className="border-t border-gray-700 pt-2 mb-1" />

      {/* Scrollable Headings Container */}
      <div
        className="flex flex-col gap-0.5 overflow-y-auto pr-2"
        style={{
          maxHeight: "calc(100vh - 300px)",
          scrollbarWidth: "thin",
          scrollbarColor: "var(--purple) var(--dark-gray)",
        }}
      >
        {/* Render all headings */}
        {headings.map((heading) => renderHeading(heading))}
      </div>

      {/* Custom Webkit Scrollbar Styles */}
      <style jsx>{`
        .overflow-y-auto::-webkit-scrollbar {
          width: 6px;
        }

        .overflow-y-auto::-webkit-scrollbar-track {
          background: var(--dark-gray);
          border-radius: 3px;
        }

        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: var(--purple);
          border-radius: 3px;
          transition: background 0.3s ease;
        }

        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: var(--pink);
        }
      `}</style>
    </div>
  );
};

export default TableOfContents;
