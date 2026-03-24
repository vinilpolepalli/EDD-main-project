"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Coins } from "lucide-react";
import { cn } from "@/lib/utils";

interface TokenDisplayProps {
  tokens: number;
  /** Set to a positive number to trigger the coin-flip animation */
  tokensGained?: number;
  className?: string;
}

const TokenDisplay: React.FC<TokenDisplayProps> = ({
  tokens,
  tokensGained = 0,
  className,
}) => {
  const [showGain, setShowGain] = React.useState(false);
  const [flipKey, setFlipKey] = React.useState(0);

  React.useEffect(() => {
    if (tokensGained > 0) {
      setShowGain(true);
      setFlipKey((k) => k + 1);
      const timer = setTimeout(() => setShowGain(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [tokensGained]);

  return (
    <div
      className={cn(
        "relative flex items-center gap-3 rounded-xl border border-border bg-card p-4 shadow-sm",
        className
      )}
    >
      <motion.div
        key={flipKey}
        className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent shadow-sm"
        animate={
          tokensGained > 0
            ? { rotateY: [0, 360] }
            : {}
        }
        transition={{ duration: 0.6, ease: "easeInOut" }}
      >
        <Coins className="h-6 w-6 text-white" />
      </motion.div>
      <div className="flex flex-col">
        <span className="text-2xl font-extrabold tabular-nums text-foreground">
          {tokens}
        </span>
        <span className="text-xs font-bold text-muted-foreground">
          Arcade Tokens
        </span>
      </div>

      <AnimatePresence>
        {showGain && (
          <motion.span
            className="absolute -top-2 right-3 rounded-full bg-accent px-2 py-0.5 text-xs font-extrabold text-white shadow-md"
            initial={{ opacity: 0, y: 8, scale: 0.7 }}
            animate={{ opacity: 1, y: -6, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.6 }}
            transition={{ duration: 0.5 }}
          >
            +{tokensGained}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
};

export { TokenDisplay };
export type { TokenDisplayProps };
