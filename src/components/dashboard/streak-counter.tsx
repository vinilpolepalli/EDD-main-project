"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Flame } from "lucide-react";
import { cn } from "@/lib/utils";

interface StreakCounterProps {
  streak: number;
  className?: string;
}

function getStreakMessage(streak: number): string {
  if (streak === 0) return "Start your streak today!";
  if (streak === 1) return "Great start! Come back tomorrow.";
  if (streak < 5) return "Keep it going!";
  if (streak < 10) return "You're on fire!";
  if (streak < 30) return "Incredible dedication!";
  return "Legendary streak!";
}

const StreakCounter: React.FC<StreakCounterProps> = ({ streak, className }) => {
  const flameScale = Math.min(1 + streak * 0.03, 1.4);

  return (
    <div
      className={cn(
        "flex items-center gap-4 rounded-2xl bg-white p-5 shadow-sm",
        className
      )}
    >
      <motion.div
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-100"
        animate={{
          scale: [flameScale, flameScale * 0.94, flameScale],
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <Flame className="h-6 w-6 text-orange-500" />
      </motion.div>
      <div className="flex flex-col">
        <span className="text-2xl font-extrabold tabular-nums text-foreground">
          {streak}
        </span>
        <span className="text-xs font-semibold text-muted-foreground">
          {streak === 1 ? "day streak" : "day streak"}
        </span>
        <span className="mt-0.5 text-xs font-medium text-orange-500">
          {getStreakMessage(streak)}
        </span>
      </div>
    </div>
  );
};

export { StreakCounter };
export type { StreakCounterProps };
