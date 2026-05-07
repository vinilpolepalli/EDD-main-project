"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  BookOpen,
  BarChart2,
  Gamepad2,
  HelpCircle,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUser, useClerk } from "@clerk/nextjs";

interface SidebarLink {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const sidebarLinks: SidebarLink[] = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/learn", label: "Learn", icon: BookOpen },
  { href: "/simulator", label: "Simulator", icon: BarChart2 },
  { href: "/minigames", label: "Mini-games", icon: Gamepad2 },
  { href: "/guide", label: "Guide", icon: HelpCircle },
];

const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { user } = useUser();
  const { signOut } = useClerk();

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Desktop — vertical icon rail */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-16 flex-col bg-ink lg:flex">
        <div className="flex h-full flex-col items-center py-5">
          {/* Wordmark / brand initial */}
          <Link
            href="/landing"
            aria-label="CashQuest home"
            className="flex h-10 w-10 items-center justify-center rounded-lg bg-white font-serif text-[1.125rem] text-ink"
          >
            c
          </Link>

          <nav
            aria-label="Main navigation"
            className="mt-10 flex flex-1 flex-col gap-2"
          >
            {sidebarLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-label={link.label}
                  aria-current={active ? "page" : undefined}
                  title={link.label}
                  className={cn(
                    "relative flex h-10 w-10 items-center justify-center rounded-lg transition-colors",
                    active
                      ? "bg-white text-ink"
                      : "text-white/60 hover:bg-white/10 hover:text-white",
                  )}
                >
                  <Icon className="h-[18px] w-[18px]" />
                  {active && (
                    <span
                      aria-hidden
                      className="absolute -left-1 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r-full bg-accent"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Sign out + avatar */}
          <div className="flex flex-col items-center gap-3">
            {user && (
              <button
                type="button"
                aria-label="Sign out"
                onClick={() => signOut({ redirectUrl: "/landing" })}
                className="flex h-10 w-10 items-center justify-center rounded-lg text-white/60 hover:bg-white/10 hover:text-white"
              >
                <LogOut className="h-[18px] w-[18px]" />
              </button>
            )}
            {user?.imageUrl && (
              <div className="h-9 w-9 overflow-hidden rounded-full ring-2 ring-white/10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={user.imageUrl}
                  alt={user.firstName ?? "Profile"}
                  className="h-full w-full object-cover"
                />
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Mobile bottom tab bar */}
      <nav
        className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-paper lg:hidden"
        aria-label="Mobile navigation"
      >
        <div className="flex items-center justify-around px-2 py-2">
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex min-h-[44px] min-w-[56px] flex-col items-center justify-center gap-0.5 rounded-lg px-2 py-1.5 font-sans text-[0.6875rem] font-medium transition-colors",
                  active ? "text-ink" : "text-muted hover:text-ink",
                )}
              >
                <Icon className="h-[18px] w-[18px]" />
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
