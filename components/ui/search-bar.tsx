"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { fetchAllCategories, fetchModulesByCategory } from "@/lib/api/learn";
import { navItems } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface SearchResult {
  title: string;
  description?: string;
  path: string;
  type: "page" | "category" | "model";
  category?: string;
}

interface SearchDropdownProps {
  isMobile?: boolean;
  onClose?: () => void;
}

export function SearchBar({ isMobile = false, onClose }: SearchDropdownProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [searchableData, setSearchableData] = useState<SearchResult[]>([]);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch searchable data from MongoDB
  useEffect(() => {
    const loadSearchableData = async () => {
      try {
        const data: SearchResult[] = [];

        // Add main navigation pages
        navItems.forEach((item) => {
          data.push({
            title: item.name,
            description: item.description,
            path: item.link,
            type: "page",
          });
        });

        // Fetch categories from MongoDB
        const categories = await fetchAllCategories();

        // Process each category
        for (const category of categories) {
          const categorySlug = category.name.toLowerCase().replace(/\s+/g, "-");

          // Add category itself
          data.push({
            title: category.name,
            description: category.description,
            path: `/learn/${categorySlug}`,
            type: "category",
          });

          // Fetch modules for this category
          try {
            const modules = await fetchModulesByCategory(categorySlug);

            // Add each module
            modules.forEach((module) => {
              data.push({
                title: module.title,
                description: module.description,
                path: `/learn/${categorySlug}/${module.slug}`,
                type: "model",
                category: category.name,
              });
            });
          } catch (error) {
            console.error(`Error loading modules for ${categorySlug}:`, error);
          }
        }

        setSearchableData(data);
      } catch (error) {
        console.error("Error loading search data:", error);

        // Fallback to just nav items if MongoDB fails
        const fallbackData: SearchResult[] = navItems.map((item) => ({
          title: item.name,
          description: item.description,
          path: item.link,
          type: "page",
        }));
        setSearchableData(fallbackData);
      }
    };

    loadSearchableData();
  }, []);

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
  const getTypeBadge = (type: string) => {
    const badges = {
      page: { label: "Page", color: "bg-blue-500/20 text-blue-300" },
      category: {
        label: "Category",
        color: "bg-purple-500/20 text-purple-300",
      },
      model: { label: "Model", color: "bg-purple/20 text-purple-light" },
    };

    const badge = badges[type as keyof typeof badges];
    return (
      <span
        className={cn(
          "px-2 py-1 rounded-full text-xs font-medium",
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
        <Search size={18} className="absolute left-3 text-light-gray/60 z-10" />
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
            "pl-10 pr-4 py-2 rounded-lg text-sm",
            "bg-dark-gray/50 border border-white/10",
            "text-white placeholder-light-gray/60",
            "focus:outline-none focus:ring-2 focus:ring-purple/50 focus:border-transparent",
            "transition-all duration-300",
            isMobile ? "w-full py-3" : "w-64",
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
              "bg-dark-gray/95 backdrop-blur-xl border border-white/10 rounded-lg shadow-xl",
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
                      ? "bg-purple/20 text-white"
                      : "hover:bg-white/5 text-light-gray",
                  )}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium truncate">{result.title}</h4>
                      {getTypeBadge(result.type)}
                    </div>
                    {result.description && (
                      <p
                        className="text-xs text-light-gray/60 overflow-hidden text-ellipsis line-clamp-2"
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
                      <p className="text-xs text-purple-300 mt-1">
                        in {result.category}
                      </p>
                    )}
                  </div>
                  <ChevronRight
                    size={16}
                    className="text-light-gray/40 ml-2 flex-shrink-0"
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
              "bg-dark-gray/95 backdrop-blur-xl border border-white/10 rounded-lg shadow-xl",
            )}
          >
            <div className="p-4 text-center text-light-gray/60">
              <Search size={24} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm">No results found for "{query}"</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
