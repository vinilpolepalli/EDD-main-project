"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Value between 0 and 100 */
  value: number;
  /** Tailwind bg color class for the filled portion, e.g. "bg-xp" */
  color?: string;
  /** Height class, e.g. "h-3" */
  height?: string;
  /** Whether to show the percentage label inside the bar */
  showLabel?: boolean;
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  (
    {
      className,
      value,
      color = "bg-primary",
      height = "h-3",
      showLabel = false,
      ...props
    },
    ref
  ) => {
    const clampedValue = Math.max(0, Math.min(100, value));

    return (
      <div
        ref={ref}
        role="progressbar"
        aria-valuenow={clampedValue}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${clampedValue}% complete`}
        className={cn(
          "relative w-full overflow-hidden rounded-full bg-muted",
          height,
          className
        )}
        {...props}
      >
        <motion.div
          className={cn("h-full rounded-full", color)}
          initial={{ width: 0 }}
          animate={{ width: `${clampedValue}%` }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
        />
        {showLabel && clampedValue > 10 && (
          <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white drop-shadow-sm">
            {Math.round(clampedValue)}%
          </span>
        )}
      </div>
    );
  }
);
Progress.displayName = "Progress";

export { Progress };
export type { ProgressProps };
