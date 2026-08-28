"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import type React from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { navItems } from "@/lib/constants";
import type { SearchEntry } from "@/lib/content";
import { cn } from "@/lib/utils";

type SearchResult = SearchEntry;

interface SearchDropdownProps {
  index: SearchEntry[];
  isMobile?: boolean;
  onClose?: () => void;
}

export function SearchBar({
  index,
  isMobile = false,
  onClose,
}: SearchDropdownProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // nav pages first, then the build-time content index
  const searchableData = useMemo<SearchResult[]>(
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

  // Search function
  const searchContent = (searchQuery: string): SearchResult[] => {
    if (!searchQuery.trim()) return [];

    const query = searchQuery.toLowerCase();
    return searchableData
      .filter(
        (item) =>
          item.title.toLowerCase().includes(query) ||
          item.description?.toLowerCase().includes(query) ||
          item.category?.toLowerCase().includes(query),
      )
      .slice(0, 8); // Limit to 8 results
  };

  // Handle input change
  // biome-ignore lint/correctness/useExhaustiveDependencies: searchContent is recreated every render and only reads searchableData, which is already a dependency; listing the function itself would re-run the effect on every render
  useEffect(() => {
    const searchResults = searchContent(query);
    setResults(searchResults);
    setSelectedIndex(-1);
    setIsOpen(searchResults.length > 0 && query.trim().length > 0);
  }, [query, searchableData]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < results.length - 1 ? prev + 1 : prev,
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && results[selectedIndex]) {
          handleResultClick(results[selectedIndex]);
        }
        break;
      case "Escape":
        setIsOpen(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  // Handle result click
  const handleResultClick = (result: SearchResult) => {
    router.push(result.path);
    setQuery("");
    setIsOpen(false);
    setSelectedIndex(-1);
    onClose?.();
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Get result type badge
  const getTypeBadge = (type: SearchResult["type"]) => {
    const badges = {
      page: { label: "Page", color: "bg-surface-2 text-ink-2" },
      category: {
        label: "Category",
        color: "bg-purple-wash text-purple-deep",
      },
      article: { label: "Article", color: "bg-purple-wash text-purple-deep" },
    };

    const badge = badges[type];
    return (
      <span
        className={cn(
          "px-2 py-0.5 rounded-full text-[0.7rem] font-medium",
          badge.color,
        )}
      >
        {badge.label}
      </span>
    );
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="flex items-center">
        <Search size={16} className="absolute left-3 text-muted z-10" />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (query.trim() && results.length > 0) {
              setIsOpen(true);
            }
          }}
          className={cn(
            "pl-9 pr-4 py-2 rounded-full text-sm",
            "bg-surface border border-line",
            "text-foreground placeholder:text-muted",
            "focus:outline-none focus:border-purple focus:bg-background",
            "transition-all duration-300",
            isMobile ? "w-full py-3" : "w-56",
          )}
        />
      </div>

      {/* Dropdown Results */}
      <AnimatePresence>
        {isOpen && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={cn(
              "absolute top-full left-0 right-0 mt-2 z-50",
              "bg-background border border-line rounded-lg shadow-lg shadow-foreground/5",
              "max-h-96 overflow-y-auto",
            )}
          >
            <div className="p-2">
              {results.map((result, index) => (
                <motion.div
                  key={`${result.type}-${result.path}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handleResultClick(result)}
                  className={cn(
                    "flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all duration-200",
                    selectedIndex === index
                      ? "bg-purple-wash text-foreground"
                      : "hover:bg-surface text-ink-2",
                  )}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium truncate">{result.title}</h4>
                      {getTypeBadge(result.type)}
                    </div>
                    {result.description && (
                      <p
                        className="text-xs text-muted overflow-hidden text-ellipsis line-clamp-2"
                        style={{
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                        }}
                      >
                        {result.description}
                      </p>
                    )}
                    {result.category && (
                      <p className="text-xs text-purple-deep mt-1">
                        in {result.category}
                      </p>
                    )}
                  </div>
                  <ChevronRight
                    size={16}
                    className="text-muted ml-2 flex-shrink-0"
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* No results message */}
      <AnimatePresence>
        {isOpen && query.trim() && results.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={cn(
              "absolute top-full left-0 right-0 mt-2 z-50",
              "bg-background border border-line rounded-lg shadow-lg shadow-foreground/5",
            )}
          >
            <div className="p-4 text-center text-muted">
              <Search size={24} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm">No results found for "{query}"</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
