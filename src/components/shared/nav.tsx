"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface NavProps {
  /** Optional page title override */
  title?: string;
  /** Optional right-side content (e.g. avatar, settings) */
  rightContent?: React.ReactNode;
  className?: string;
}

const pathTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/learn": "Learn Path",
  "/simulator": "Life Simulator",
  "/arcade": "Arcade",
};

function resolveTitle(pathname: string): string {
  for (const [path, title] of Object.entries(pathTitles)) {
    if (pathname === path || pathname.startsWith(`${path}/`)) {
      return title;
    }
  }
  return "CashQuest";
}

const Nav: React.FC<NavProps> = ({ title, rightContent, className }) => {
  const pathname = usePathname();
  const displayTitle = title ?? resolveTitle(pathname);

  return (
    <header
      className={cn(
        "mb-2 flex items-center justify-between",
        className
      )}
    >
      <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
        {displayTitle}
      </h1>
      {rightContent && (
        <div className="flex items-center gap-3">{rightContent}</div>
      )}
    </header>
  );
};

export { Nav };
export type { NavProps };
