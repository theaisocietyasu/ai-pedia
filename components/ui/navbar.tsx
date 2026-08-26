"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  BookOpen,
  Home,
  Info,
  LogOut,
  Menu,
  User,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type React from "react";
import { useEffect, useState } from "react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
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

  // handle scroll events for navbar background
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // close mobile menu on route change
  // biome-ignore lint/correctness/useExhaustiveDependencies(pathname): the effect must re-run on every route change to close the mobile menu
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  // helper function to get icon component
  const getIcon = (iconName?: string | React.ReactNode) => {
    if (!iconName) return null;
    if (typeof iconName !== "string") return iconName;

    const icons: Record<string, React.ReactNode> = {
      Home: <Home size={18} />,
      BookOpen: <BookOpen size={18} />,
      Info: <Info size={18} />,
      Users: <Users size={18} />,
    };

    return icons[iconName] || null;
  };

  const renderNavLink = (item: NavItem, index: number, isMobile = false) => {
    const isActive = pathname === item.link;
    const icon = getIcon(item.icon);

    return (
      <motion.div
        key={`nav-${isMobile ? "mobile-" : ""}${index}`}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
      >
        <Link
          href={item.link}
          onClick={() => setIsMobileMenuOpen(false)}
          className={cn(
            "relative flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300",
            isMobile
              ? "text-lg font-medium hover:bg-purple/20"
              : "text-sm font-medium hover:text-light-gray",
            isActive
              ? isMobile
                ? "bg-purple/30 text-white"
                : "text-white"
              : "text-light-gray/80",
          )}
        >
          {icon && <span className="opacity-70">{icon}</span>}
          <span>{item.name}</span>
          {isActive && !isMobile && (
            <motion.span
              layoutId="navbar-indicator"
              className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-purple to-pink"
              initial={false}
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
            />
          )}
        </Link>
      </motion.div>
    );
  };

  return (
    <>
      <motion.header
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          isScrolled ? "navbar-glass-effect shadow-lg" : "bg-transparent",
        )}
      >
        <nav className="container mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex items-center justify-between h-16">
            {/* logo and brand */}
            <Link href="/" className="flex items-center gap-3 group">
              <img
                src="/logo.png"
                alt="AI Pedia Logo"
                className="w-10 h-10 rounded-lg object-cover"
              />
              <div className="flex flex-col">
                <span className="font-bold text-lg text-white group-hover:text-light-gray transition-colors">
                  AI Pedia
                </span>
                <span className="text-xs text-light-gray/60">
                  by The AI Society
                </span>
              </div>
            </Link>

            {/* desktop navigation */}
            <div className="hidden md:flex items-center gap-6 flex-1 justify-center">
              {navItems.map((item, index) => renderNavLink(item, index))}
            </div>

            {/* search bar and user button side by side with margin */}
            <div className="hidden md:flex items-center gap-4">
              <SearchBar />
              <ThemeToggle />
              {session?.user && (
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-purple/20 border border-purple/30">
                    {session.user.image ? (
                      <img
                        src={session.user.image}
                        alt={session.user.name || "User"}
                        className="w-6 h-6 rounded-full"
                      />
                    ) : (
                      <User size={16} className="text-purple-300" />
                    )}
                    <span className="text-sm text-purple-300">
                      {session.user.name || session.user.email}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="p-2 rounded-lg hover:bg-purple/20 text-light-gray hover:text-white transition-colors"
                    title="Sign out"
                  >
                    <LogOut size={18} />
                  </button>
                </div>
              )}
            </div>

            {/* mobile menu button */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-light-gray hover:bg-dark-gray/50 transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </nav>
      </motion.header>

      {/* mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* menu panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-sm bg-dark-gray glass-effect z-50 md:hidden"
            >
              <div className="flex flex-col h-full">
                {/* header */}
                <div className="flex items-center justify-between p-4 border-b border-white/10">
                  <span className="text-lg font-bold gradient-text">
                    Navigation
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 rounded-lg hover:bg-purple/20 transition-colors"
                    aria-label="Close menu"
                  >
                    <X size={24} />
                  </button>
                </div>

                {/* search bar for mobile */}
                <div className="p-4 border-b border-white/10">
                  <SearchBar
                    isMobile
                    onClose={() => setIsMobileMenuOpen(false)}
                  />
                </div>

                {/* navigation links */}
                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                  {navItems.map((item, index) => (
                    <div key={`mobile-nav-${item.name}`}>
                      {renderNavLink(item, index, true)}
                      {item.description && (
                        <p className="text-xs text-light-gray/60 px-4 mt-1">
                          {item.description}
                        </p>
                      )}
                    </div>
                  ))}
                </nav>

                {/* footer */}
                <div className="p-4 border-t border-white/10">
                  <div className="text-center text-sm text-light-gray/60">
                    <p>© 2025 The AI Society</p>
                    <p className="mt-1">Arizona State University</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* spacer for fixed navbar */}
      <div className="h-16" />
    </>
  );
}
