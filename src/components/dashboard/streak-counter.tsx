"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Flame } from "lucide-react";
import { cn } from "@/lib/utils";

interface StreakCounterProps {
  streak: number;
  className?: string;
}

const StreakCounter: React.FC<StreakCounterProps> = ({ streak, className }) => {
  const flameScale = Math.min(1 + streak * 0.05, 1.6);
  const isHot = streak >= 7;

  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-xl border border-border bg-card p-4 shadow-sm",
        className
      )}
    >
      <motion.div
        className={cn(
          "flex h-12 w-12 items-center justify-center rounded-xl shadow-sm",
          isHot ? "bg-orange-500" : "bg-orange-400"
        )}
        animate={{
          scale: [flameScale, flameScale * 0.92, flameScale],
        }}
        transition={{
          duration: 0.8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <Flame className="h-6 w-6 text-white" />
      </motion.div>
      <div className="flex flex-col">
        <span className="text-2xl font-extrabold tabular-nums text-foreground">
          {streak}
        </span>
        <span className="text-xs font-bold text-muted-foreground">
          {streak === 0
            ? "Start your streak!"
            : streak === 1
              ? "1 day streak"
              : `${streak} day streak`}
        </span>
        {streak >= 3 && (
          <motion.span
            className="mt-0.5 text-xs font-bold text-orange-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            Keep it going!
          </motion.span>
        )}
      </div>
    </div>
  );
};

export { StreakCounter };
export type { StreakCounterProps };
