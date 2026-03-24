"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface TimerProps {
  /** Seconds remaining */
  timeLeft: number;
  /** Total duration in seconds (for progress calculation) */
  totalTime: number;
  className?: string;
}

const Timer: React.FC<TimerProps> = ({ timeLeft, totalTime, className }) => {
  const fraction = totalTime > 0 ? timeLeft / totalTime : 0;
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - fraction);

  const ringColor =
    fraction > 0.5
      ? "stroke-success"
      : fraction > 0.2
        ? "stroke-accent"
        : "stroke-destructive";

  const textColor =
    fraction > 0.5
      ? "text-success"
      : fraction > 0.2
        ? "text-accent"
        : "text-destructive";

  return (
    <div
      className={cn("relative inline-flex items-center justify-center", className)}
      role="timer"
      aria-label={`${timeLeft} seconds remaining`}
    >
      <svg width="96" height="96" viewBox="0 0 96 96" className="-rotate-90">
        {/* Background ring */}
        <circle
          cx="48"
          cy="48"
          r={radius}
          fill="none"
          strokeWidth="6"
          className="stroke-muted"
        />
        {/* Progress ring */}
        <motion.circle
          cx="48"
          cy="48"
          r={radius}
          fill="none"
          strokeWidth="6"
          strokeLinecap="round"
          className={ringColor}
          strokeDasharray={circumference}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <motion.span
          className={cn("text-2xl font-extrabold tabular-nums", textColor)}
          key={timeLeft}
          initial={timeLeft <= 10 ? { scale: 1.3 } : { scale: 1 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 15 }}
        >
          {timeLeft}
        </motion.span>
        <span className="text-[10px] font-bold text-muted-foreground">sec</span>
      </div>
    </div>
  );
};

export { Timer };
export type { TimerProps };
