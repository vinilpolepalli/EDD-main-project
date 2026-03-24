"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { PiggyBank, ShoppingBag, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface AllocationSliderProps {
  /** Percentage 0-100 allocated to savings */
  savings: number;
  /** Percentage 0-100 allocated to spending */
  spending: number;
  /** Percentage 0-100 allocated to investing */
  investing: number;
  /** The dollar amount that will be divided. Used for display only. */
  totalAmount: number;
  /** Called whenever any allocation changes */
  onChange: (allocation: { savings: number; spending: number; investing: number }) => void;
  className?: string;
}

interface CategoryConfig {
  key: "savings" | "spending" | "investing";
  label: string;
  icon: React.ReactNode;
  color: string;
  thumbColor: string;
  bgColor: string;
}

const categories: CategoryConfig[] = [
  {
    key: "savings",
    label: "Savings",
    icon: <PiggyBank className="h-4 w-4" />,
    color: "text-success",
    thumbColor: "bg-success",
    bgColor: "bg-learn-light",
  },
  {
    key: "spending",
    label: "Spending",
    icon: <ShoppingBag className="h-4 w-4" />,
    color: "text-orange-500",
    thumbColor: "bg-orange-500",
    bgColor: "bg-orange-100",
  },
  {
    key: "investing",
    label: "Investing",
    icon: <TrendingUp className="h-4 w-4" />,
    color: "text-blue-500",
    thumbColor: "bg-blue-500",
    bgColor: "bg-blue-100",
  },
];

const AllocationSlider: React.FC<AllocationSliderProps> = ({
  savings,
  spending,
  investing,
  totalAmount,
  onChange,
  className,
}) => {
  const values: Record<string, number> = { savings, spending, investing };

  const handleChange = (key: "savings" | "spending" | "investing", newValue: number) => {
    const clamped = Math.max(0, Math.min(100, Math.round(newValue)));
    const currentValues = { savings, spending, investing };
    const oldValue = currentValues[key];
    const delta = clamped - oldValue;

    if (delta === 0) return;

    // Determine the other two keys and distribute the delta
    const otherKeys = categories
      .map((c) => c.key)
      .filter((k) => k !== key) as Array<"savings" | "spending" | "investing">;

    const otherTotal = otherKeys.reduce((sum, k) => sum + currentValues[k], 0);
    const newOther: Record<string, number> = {};

    if (otherTotal === 0) {
      // Split evenly
      const each = Math.floor(-delta / 2);
      newOther[otherKeys[0]] = Math.max(0, currentValues[otherKeys[0]] + each);
      newOther[otherKeys[1]] = 100 - clamped - newOther[otherKeys[0]];
    } else {
      // Distribute proportionally
      for (const k of otherKeys) {
        const ratio = currentValues[k] / otherTotal;
        newOther[k] = Math.max(0, Math.round(currentValues[k] - delta * ratio));
      }
      // Correct rounding errors
      const total = clamped + newOther[otherKeys[0]] + newOther[otherKeys[1]];
      if (total !== 100) {
        newOther[otherKeys[1]] += 100 - total;
        newOther[otherKeys[1]] = Math.max(0, newOther[otherKeys[1]]);
      }
    }

    onChange({
      savings: key === "savings" ? clamped : (newOther.savings ?? savings),
      spending: key === "spending" ? clamped : (newOther.spending ?? spending),
      investing: key === "investing" ? clamped : (newOther.investing ?? investing),
    });
  };

  const formatDollar = (pct: number) =>
    `$${Math.round((pct / 100) * totalAmount).toLocaleString()}`;

  return (
    <div className={cn("flex flex-col gap-5", className)}>
      {/* Summary bar */}
      <div className="flex h-4 w-full overflow-hidden rounded-full">
        <motion.div
          className="bg-success"
          style={{ width: `${savings}%` }}
          layout
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        />
        <motion.div
          className="bg-orange-500"
          style={{ width: `${spending}%` }}
          layout
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        />
        <motion.div
          className="bg-blue-500"
          style={{ width: `${investing}%` }}
          layout
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        />
      </div>

      {/* Individual sliders */}
      {categories.map((cat) => {
        const pct = values[cat.key];
        const fillPct = Math.max(0, Math.min(100, pct));

        return (
          <div key={cat.key} className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className={cn("flex items-center gap-1.5 text-sm font-bold", cat.color)}>
                {cat.icon}
                {cat.label}
              </span>
              <div className="flex items-center gap-2">
                <span className={cn("rounded-md px-2 py-0.5 text-sm font-extrabold tabular-nums", cat.bgColor, cat.color)}>
                  {pct}%
                </span>
                <span className="text-xs font-bold text-muted-foreground tabular-nums">
                  {formatDollar(pct)}
                </span>
              </div>
            </div>
            <div className="relative flex items-center">
              <div className="absolute h-3 w-full rounded-full bg-muted" />
              <div
                className={cn("absolute h-3 rounded-full", cat.thumbColor)}
                style={{ width: `${fillPct}%` }}
              />
              <input
                type="range"
                min={0}
                max={100}
                step={1}
                value={pct}
                onChange={(e) => handleChange(cat.key, Number(e.target.value))}
                aria-label={`${cat.label} allocation`}
                className={cn(
                  "relative z-10 h-8 w-full cursor-pointer appearance-none bg-transparent",
                  "[&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-md",
                  `[&::-webkit-slider-thumb]:${cat.thumbColor}`,
                  "[&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:shadow-md",
                  `[&::-moz-range-thumb]:${cat.thumbColor}`
                )}
              />
            </div>
          </div>
        );
      })}

      {/* Total check */}
      {savings + spending + investing !== 100 && (
        <p className="text-center text-xs font-bold text-destructive">
          Allocations must add up to 100% (currently {savings + spending + investing}%)
        </p>
      )}
    </div>
  );
};

export { AllocationSlider };
export type { AllocationSliderProps };
