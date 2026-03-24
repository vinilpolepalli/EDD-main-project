"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface ComboMeterProps {
  /** Current combo multiplier, e.g. 1, 1.25, 1.5, ... */
  multiplier: number;
  /** Maximum multiplier for visual scaling */
  maxMultiplier?: number;
  className?: string;
}

const ComboMeter: React.FC<ComboMeterProps> = ({
  multiplier,
  maxMultiplier = 5,
  className,
}) => {
  const intensity = Math.min((multiplier - 1) / (maxMultiplier - 1), 1);
  const isActive = multiplier > 1;
  const isHot = multiplier >= 2;
  const isFire = multiplier >= 3.5;

  const glowColor = isFire
    ? "shadow-red-500/50"
    : isHot
      ? "shadow-orange-500/40"
      : "shadow-accent/30";

  return (
    <motion.div
      className={cn(
        "flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 shadow-sm transition-shadow",
        isActive && `shadow-lg ${glowColor}`,
        className
      )}
      animate={
        isActive
          ? { scale: [1, 1.04, 1] }
          : {}
      }
      transition={{
        duration: 0.6,
        repeat: isActive ? Infinity : 0,
        ease: "easeInOut",
      }}
    >
      <motion.div
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-lg",
          isFire
            ? "bg-red-500"
            : isHot
              ? "bg-orange-500"
              : isActive
                ? "bg-accent"
                : "bg-muted"
        )}
        animate={
          isActive
            ? {
                rotate: [0, -8, 8, 0],
                scale: [1, 1.1 + intensity * 0.2, 1],
              }
            : {}
        }
        transition={{
          duration: 0.5,
          repeat: isActive ? Infinity : 0,
        }}
      >
        <Zap
          className={cn(
            "h-5 w-5",
            isActive ? "text-white" : "text-muted-foreground"
          )}
        />
      </motion.div>
      <div className="flex flex-col">
        <motion.span
          className={cn(
            "text-lg font-extrabold tabular-nums",
            isFire
              ? "text-red-500"
              : isHot
                ? "text-orange-500"
                : isActive
                  ? "text-accent"
                  : "text-muted-foreground"
          )}
          key={multiplier}
          initial={{ scale: 1.4 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 12 }}
        >
          {multiplier.toFixed(2)}x
        </motion.span>
        <span className="text-[10px] font-bold text-muted-foreground">
          Combo
        </span>
      </div>
    </motion.div>
  );
};

export { ComboMeter };
export type { ComboMeterProps };
