"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { LEVEL_XP_THRESHOLDS } from "@/lib/constants/game-balance";

interface XpBarProps {
  totalXp: number;
  /** If provided, shows a "+XP" pop when xpGain > 0 */
  xpGain?: number;
  className?: string;
}

const LEVEL_NAMES = [
  "Beginner",
  "Saver",
  "Earner",
  "Investor",
  "Trader",
  "Banker",
  "Analyst",
  "Advisor",
  "Mogul",
  "Tycoon",
  "Legend",
] as const;

function getLevel(xp: number): number {
  for (let i = LEVEL_XP_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_XP_THRESHOLDS[i]) return i;
  }
  return 0;
}

function getXpForCurrentLevel(xp: number): { current: number; required: number } {
  const level = getLevel(xp);
  const currentThreshold = LEVEL_XP_THRESHOLDS[level];
  const nextThreshold =
    level + 1 < LEVEL_XP_THRESHOLDS.length
      ? LEVEL_XP_THRESHOLDS[level + 1]
      : LEVEL_XP_THRESHOLDS[level] + 1000;
  return {
    current: xp - currentThreshold,
    required: nextThreshold - currentThreshold,
  };
}

function getLevelName(level: number): string {
  return LEVEL_NAMES[Math.min(level, LEVEL_NAMES.length - 1)];
}

const XpBar: React.FC<XpBarProps> = ({ totalXp, xpGain = 0, className }) => {
  const level = getLevel(totalXp);
  const { current, required } = getXpForCurrentLevel(totalXp);
  const percentage = Math.min((current / required) * 100, 100);
  const [showGain, setShowGain] = React.useState(false);

  React.useEffect(() => {
    if (xpGain > 0) {
      setShowGain(true);
      const timer = setTimeout(() => setShowGain(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [xpGain]);

  return (
    <div
      className={cn(
        "relative rounded-2xl bg-white p-5 shadow-sm",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-paper-2">
            <Zap className="h-5 w-5 text-accent" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-foreground">
              Level {level}
            </span>
            <span className="text-xs font-medium text-muted-foreground">
              {getLevelName(level)}
            </span>
          </div>
        </div>
        <span className="text-sm font-bold tabular-nums text-muted-foreground">
          {current} / {required} XP
        </span>
      </div>

      {/* Progress Bar */}
      <div className="mt-3 h-3 w-full overflow-hidden rounded-full bg-paper-2">
        <motion.div
          className="h-full rounded-full bg-accent"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ type: "spring", stiffness: 80, damping: 18 }}
        />
      </div>

      {/* +XP pop */}
      <AnimatePresence>
        {showGain && (
          <motion.span
            className="absolute -top-2 right-4 rounded-full bg-accent px-2.5 py-0.5 text-xs font-extrabold text-white shadow-md"
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: -8, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.6 }}
            transition={{ duration: 0.5 }}
          >
            +{xpGain} XP
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
};

export { XpBar, getLevel, getXpForCurrentLevel, getLevelName };
export type { XpBarProps };
