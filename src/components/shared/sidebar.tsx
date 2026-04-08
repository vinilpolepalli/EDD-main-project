"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  Home,
  BookOpen,
  BarChart2,
  Flame,
  Coins,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useGameState } from "@/hooks/use-game-state";
import { getLevel, getXpForCurrentLevel } from "@/components/dashboard/xp-bar";

interface SidebarLink {
  href: string;
  label: string;
  icon: React.ReactNode;
}

const sidebarLinks: SidebarLink[] = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: <Home className="h-5 w-5" />,
  },
  {
    href: "/learn",
    label: "Learn",
    icon: <BookOpen className="h-5 w-5" />,
  },
  {
    href: "/simulator",
    label: "Life Simulator",
    icon: <BarChart2 className="h-5 w-5" />,
  },
];

const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { progress, isLoaded } = useGameState();

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  const level = isLoaded ? getLevel(progress.totalXp) : 0;
  const { current, required } = isLoaded
    ? getXpForCurrentLevel(progress.totalXp)
    : { current: 0, required: 100 };
  const xpPercent = Math.min((current / required) * 100, 100);

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col bg-sidebar lg:flex">
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex items-center gap-3 px-6 py-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white">
              <Coins className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-extrabold text-white">
                CashQuest
              </span>
              <span className="text-xs font-medium text-slate-400">
                Finance for the Future
              </span>
            </div>
          </div>

          {/* Divider */}
          <div className="mx-4 border-t border-slate-700/50" />

          {/* Navigation Links */}
          <nav className="mt-4 flex flex-1 flex-col gap-1 px-3" aria-label="Main navigation">
            {sidebarLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative flex min-h-[44px] items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200",
                    active
                      ? "bg-primary text-white shadow-lg shadow-primary/25"
                      : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                  )}
                  aria-current={active ? "page" : undefined}
                >
                  {link.icon}
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Bottom Section: XP + Streak */}
          {isLoaded && (
            <div className="mx-3 mb-4 flex flex-col gap-3">
              {/* Streak Badge */}
              <div className="flex items-center gap-3 rounded-xl bg-slate-800/50 px-4 py-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500/20">
                  <Flame className="h-4 w-4 text-orange-400" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold tabular-nums text-white">
                    {progress.currentStreak} day streak
                  </span>
                  <span className="text-xs text-slate-400">
                    {progress.currentStreak === 0
                      ? "Start today!"
                      : "Keep it going!"}
                  </span>
                </div>
              </div>

              {/* XP Progress */}
              <div className="rounded-xl bg-slate-800/50 px-4 py-3">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400">
                    Level {level}
                  </span>
                  <span className="text-xs font-semibold tabular-nums text-slate-400">
                    {current} / {required} XP
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-700">
                  <motion.div
                    className="h-full rounded-full bg-primary"
                    initial={{ width: 0 }}
                    animate={{ width: `${xpPercent}%` }}
                    transition={{ type: "spring", stiffness: 80, damping: 18 }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Mobile Bottom Tab Bar */}
      <nav
        className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.06)] lg:hidden"
        aria-label="Mobile navigation"
      >
        <div className="flex items-center justify-around px-2 py-1">
          {sidebarLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex min-h-[44px] min-w-[64px] flex-col items-center justify-center gap-0.5 rounded-xl px-3 py-2 text-xs font-semibold transition-colors",
                  active
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
                aria-current={active ? "page" : undefined}
              >
                <span className={cn(active && "text-primary")}>
                  {link.icon}
                </span>
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
};

export { Sidebar };
