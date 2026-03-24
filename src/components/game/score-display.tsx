"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface ScoreDisplayProps {
  score: number;
  className?: string;
}

const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ score, className }) => {
  const [displayScore, setDisplayScore] = React.useState(score);
  const [isIncreasing, setIsIncreasing] = React.useState(false);

  React.useEffect(() => {
    if (score === displayScore) return;

    setIsIncreasing(score > displayScore);
    const diff = Math.abs(score - displayScore);
    const step = Math.max(1, Math.floor(diff / 15));
    const interval = setInterval(() => {
      setDisplayScore((prev) => {
        if (score > prev) {
          return Math.min(prev + step, score);
        }
        if (score < prev) {
          return Math.max(prev - step, score);
        }
        clearInterval(interval);
        return prev;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [score, displayScore]);

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <motion.div
        className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent shadow-sm"
        animate={isIncreasing ? { rotate: [0, 15, -15, 0] } : {}}
        transition={{ duration: 0.4 }}
      >
        <Star className="h-5 w-5 text-white" />
      </motion.div>
      <AnimatePresence mode="wait">
        <motion.span
          key={displayScore}
          className="text-2xl font-extrabold tabular-nums text-foreground"
          initial={{ y: isIncreasing ? 10 : -10, opacity: 0.5 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.15 }}
        >
          {displayScore.toLocaleString()}
        </motion.span>
      </AnimatePresence>
    </div>
  );
};

export { ScoreDisplay };
export type { ScoreDisplayProps };
