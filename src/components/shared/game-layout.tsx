"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { LegalDisclaimer } from "@/components/shared/legal-disclaimer";

type ModuleColor = "learn" | "simulator" | "arcade" | "default";

const moduleColorMap: Record<ModuleColor, string> = {
  learn: "bg-learn",
  simulator: "bg-simulator",
  arcade: "bg-arcade",
  default: "bg-primary",
};

const moduleTextMap: Record<ModuleColor, string> = {
  learn: "text-white",
  simulator: "text-white",
  arcade: "text-white",
  default: "text-primary-foreground",
};

interface GameLayoutProps {
  title: string;
  /** Which module color to use for the header bar */
  module?: ModuleColor;
  /** URL for the back button. If omitted, no back button is shown. */
  backHref?: string;
  /** Label for the back link (for accessibility) */
  backLabel?: string;
  children: React.ReactNode;
  /** Optional right-side header content (e.g., timer, score) */
  headerRight?: React.ReactNode;
  className?: string;
}

const GameLayout: React.FC<GameLayoutProps> = ({
  title,
  module = "default",
  backHref,
  backLabel = "Go back",
  children,
  headerRight,
  className,
}) => {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Colored header bar */}
      <motion.header
        className={cn(
          "sticky top-0 z-30 shadow-md",
          moduleColorMap[module],
          moduleTextMap[module]
        )}
        initial={{ y: -60 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      >
        <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4">
          <div className="flex items-center gap-3">
            {backHref && (
              <Link
                href={backHref}
                className="flex h-10 w-10 items-center justify-center rounded-lg transition-colors hover:bg-white/20"
                aria-label={backLabel}
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
            )}
            <h1 className="text-lg font-extrabold tracking-tight">{title}</h1>
          </div>
          {headerRight && <div className="flex items-center gap-2">{headerRight}</div>}
        </div>
      </motion.header>

      {/* Page content */}
      <div className={cn("mx-auto w-full max-w-4xl flex-1 px-4 py-6", className)}>
        {children}
      </div>

      {/* Legal disclaimer */}
      <div className="border-t border-border px-4 py-3">
        <LegalDisclaimer />
      </div>
    </div>
  );
};

export { GameLayout };
export type { GameLayoutProps, ModuleColor };
