"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { LEVEL_XP_THRESHOLDS } from "@/lib/constants/game-balance";

interface XpBarProps {
  totalXp: number;
  /** If provided, shows a "+XP" pop when xpGain > 0 */
  xpGain?: number;
  className?: string;
}

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
    <div className={cn("relative flex flex-col gap-2", className)}>
      {/* Level + label */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-xp font-extrabold text-white text-sm shadow-sm">
            {level}
          </span>
          <span className="text-sm font-bold text-foreground">
            Level {level}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-sm font-bold text-muted-foreground">
          <Sparkles className="h-4 w-4 text-xp" />
          <span className="tabular-nums">
            {current} / {required} XP
          </span>
        </div>
      </div>

      {/* Bar */}
      <div className="relative h-4 w-full overflow-hidden rounded-full bg-xp-light">
        <motion.div
          className="h-full rounded-full bg-xp"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ type: "spring", stiffness: 80, damping: 18 }}
        />
      </div>

      {/* +XP pop */}
      <AnimatePresence>
        {showGain && (
          <motion.span
            className="absolute -top-2 right-0 rounded-full bg-xp px-2 py-0.5 text-xs font-extrabold text-white shadow-md"
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

export { XpBar, getLevel, getXpForCurrentLevel };
export type { XpBarProps };
