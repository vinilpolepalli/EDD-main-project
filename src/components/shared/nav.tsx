"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Coins,
  LayoutDashboard,
  BookOpen,
  Gamepad2,
  TrendingUp,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavLink {
  href: string;
  label: string;
  icon: React.ReactNode;
  color: string;
}

const navLinks: NavLink[] = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: <LayoutDashboard className="h-5 w-5" />,
    color: "text-primary",
  },
  {
    href: "/learn",
    label: "Learn",
    icon: <BookOpen className="h-5 w-5" />,
    color: "text-learn",
  },
  {
    href: "/simulator",
    label: "Simulator",
    icon: <TrendingUp className="h-5 w-5" />,
    color: "text-simulator",
  },
  {
    href: "/arcade",
    label: "Arcade",
    icon: <Gamepad2 className="h-5 w-5" />,
    color: "text-arcade",
  },
];

const Nav: React.FC = () => {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card/95 shadow-sm backdrop-blur-sm">
      <nav
        className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-xl font-extrabold"
        >
          <motion.span
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent text-white shadow-md"
            whileHover={{ rotate: 15 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Coins className="h-5 w-5" />
          </motion.span>
          <span className="hidden sm:inline">
            <span className="text-primary">Cash</span>
            <span className="text-accent">Quest</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative flex min-h-[44px] items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold transition-colors",
                  active
                    ? cn(link.color, "bg-muted")
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
                aria-current={active ? "page" : undefined}
              >
                {active && (
                  <motion.span
                    layoutId="nav-active-bg"
                    className="absolute inset-0 rounded-lg bg-muted"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  {link.icon}
                  {link.label}
                </span>
              </Link>
            );
          })}
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          className="flex h-11 w-11 items-center justify-center rounded-lg text-foreground hover:bg-muted md:hidden"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((prev) => !prev)}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="border-t border-border bg-card md:hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex flex-col gap-1 p-3">
              {navLinks.map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex min-h-[44px] items-center gap-3 rounded-lg px-4 py-3 text-base font-bold transition-colors",
                      active
                        ? cn(link.color, "bg-muted")
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                    aria-current={active ? "page" : undefined}
                  >
                    {link.icon}
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export { Nav };
