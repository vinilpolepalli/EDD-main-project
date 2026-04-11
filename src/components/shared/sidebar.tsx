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
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useGameState } from "@/hooks/use-game-state";
import { getLevel, getXpForCurrentLevel } from "@/components/dashboard/xp-bar";
import { createClient } from "@/lib/supabase/client";

function useDisplayName() {
  const [displayName, setDisplayName] = React.useState<string | null>(null);
  const [isGuest, setIsGuest] = React.useState(false);

  React.useEffect(() => {
    async function load() {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const name =
            (user.user_metadata?.display_name as string | undefined) ??
            user.email?.split("@")[0] ??
            "Player";
          setDisplayName(name);
          return;
        }
      } catch {
        // Supabase unavailable — fall through to localStorage
      }
      // Guest / localStorage fallback
      const stored = localStorage.getItem("cashquest-display-name");
      setDisplayName(stored ?? "Guest Player");
      setIsGuest(true);
    }
    load();
  }, []);

  return { displayName, isGuest };
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

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
  const { displayName, isGuest } = useDisplayName();

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
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white shadow-md shadow-primary/30">
              <Coins className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-extrabold text-green-900">
                CashQuest
              </span>
              <span className="text-xs font-medium text-green-600">
                Finance for the Future
              </span>
            </div>
          </div>

          {/* Divider */}
          <div className="mx-4 border-t border-green-200" />

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
                      : "text-green-700 hover:bg-green-200 hover:text-green-900"
                  )}
                  aria-current={active ? "page" : undefined}
                >
                  {link.icon}
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* User Profile */}
          {displayName && (
            <div className="mx-3 mb-2 flex items-center gap-3 rounded-xl bg-green-100 px-4 py-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-extrabold text-white shadow-sm">
                {getInitials(displayName)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-green-900">
                  {displayName}
                </p>
                <p className="text-xs text-green-600">
                  {isGuest ? "Guest" : `Level ${isLoaded ? getLevel(progress.totalXp) : 1}`}
                </p>
              </div>
              {!isGuest && (
                <button
                  type="button"
                  aria-label="Sign out"
                  onClick={async () => {
                    const supabase = createClient();
                    await supabase.auth.signOut();
                    window.location.href = "/login";
                  }}
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-green-500 transition-colors hover:bg-green-200 hover:text-green-800"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              )}
            </div>
          )}

          {/* Bottom Section: XP + Streak */}
          {isLoaded && (
            <div className="mx-3 mb-4 flex flex-col gap-3">
              {/* Streak Badge */}
              <div className="flex items-center gap-3 rounded-xl bg-green-100 px-4 py-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-100">
                  <Flame className="h-4 w-4 text-orange-500" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold tabular-nums text-green-900">
                    {progress.currentStreak} day streak
                  </span>
                  <span className="text-xs text-green-600">
                    {progress.currentStreak === 0
                      ? "Start today!"
                      : "Keep it going!"}
                  </span>
                </div>
              </div>

              {/* XP Progress */}
              <div className="rounded-xl bg-green-100 px-4 py-3">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-semibold text-green-700">
                    Level {level}
                  </span>
                  <span className="text-xs font-semibold tabular-nums text-green-700">
                    {current} / {required} XP
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-green-200">
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
