"use client";

import { AnimatePresence, motion } from "framer-motion";
import { LogOut, Menu, User, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { signOut, useSession } from "@/lib/auth/auth-client";
import { navItems } from "@/lib/constants";
import type { NavItem } from "@/lib/types";
import { cn } from "@/lib/utils";
import { SearchBar } from "./search-bar";

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();

  const handleSignOut = async () => {
    await signOut();
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 8);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // biome-ignore lint/correctness/useExhaustiveDependencies(pathname): the effect must re-run on every route change to close the mobile menu
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  const renderNavLink = (item: NavItem, isMobile = false) => {
    const isActive =
      item.link === "/" ? pathname === "/" : pathname.startsWith(item.link);

    return (
      <Link
        key={`nav-${isMobile ? "mobile-" : ""}${item.name}`}
        href={item.link}
        onClick={() => setIsMobileMenuOpen(false)}
        className={cn(
          "relative transition-colors duration-200",
          isMobile ? "block py-3 font-display text-2xl" : "py-1 text-[0.95rem]",
          isActive ? "text-foreground" : "text-muted hover:text-foreground",
        )}
      >
        {item.name}
        {isActive && !isMobile && (
          <motion.span
            layoutId="navbar-indicator"
            className="absolute -bottom-0.5 left-0 right-0 h-px bg-purple-deep"
            initial={false}
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
          />
        )}
      </Link>
    );
  };

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-colors duration-200 border-b",
          isScrolled
            ? "bg-background/90 backdrop-blur border-line"
            : "bg-transparent border-transparent",
        )}
      >
        <nav className="container">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-3 group">
              <img
                src="/logo.png"
                alt="AI Pedia logo"
                className="w-8 h-8 rounded-sm object-cover"
              />
              <span className="font-display text-xl leading-none text-foreground">
                AI Pedia
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              {navItems.map((item) => renderNavLink(item))}
            </div>

            <div className="hidden md:flex items-center gap-3">
              <SearchBar />
              {session?.user && (
                <div className="flex items-center gap-1">
                  <div className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full border border-line bg-surface">
                    {session.user.image ? (
                      <img
                        src={session.user.image}
                        alt={session.user.name || "User"}
                        className="w-6 h-6 rounded-full"
                      />
                    ) : (
                      <User size={16} className="text-muted" />
                    )}
                    <span className="text-sm text-ink-2 max-w-[10rem] truncate">
                      {session.user.name || session.user.email}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="p-2 rounded-md text-muted hover:text-foreground hover:bg-surface transition-colors"
                    title="Sign out"
                  >
                    <LogOut size={17} />
                  </button>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-md text-foreground hover:bg-surface transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-foreground/20 z-40 md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-sm bg-background border-l border-line z-50 md:hidden"
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between h-16 px-5 border-b border-line">
                  <span className="font-display text-xl">AI Pedia</span>
                  <button
                    type="button"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 rounded-md hover:bg-surface transition-colors"
                    aria-label="Close menu"
                  >
                    <X size={22} />
                  </button>
                </div>

                <div className="p-5 border-b border-line">
                  <SearchBar
                    isMobile
                    onClose={() => setIsMobileMenuOpen(false)}
                  />
                </div>

                <nav className="flex-1 p-5 overflow-y-auto">
                  {navItems.map((item) => (
                    <div key={`mobile-nav-${item.name}`}>
                      {renderNavLink(item, true)}
                      {item.description && (
                        <p className="text-sm text-muted -mt-1 mb-3">
                          {item.description}
                        </p>
                      )}
                    </div>
                  ))}
                  {session?.user && (
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="mt-6 inline-flex items-center gap-2 text-sm text-muted hover:text-foreground"
                    >
                      <LogOut size={16} /> Sign out
                    </button>
                  )}
                </nav>

                <div className="p-5 border-t border-line text-sm text-muted">
                  <p>The AI Society</p>
                  <p>Arizona State University</p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="h-16" />
    </>
  );
}
