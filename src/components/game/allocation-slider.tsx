"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  PiggyBank,
  ShoppingBag,
  TrendingUp,
  ShieldAlert,
  Banknote,
} from "lucide-react";
import { cn } from "@/lib/utils";

type BucketKey =
  | "emergencyFund"
  | "savings"
  | "investing"
  | "spending"
  | "debtPayment";

interface AllocationSliderProps {
  /** Percentage 0-100 for each bucket */
  emergencyFund: number;
  savings: number;
  spending: number;
  investing: number;
  debtPayment: number;
  /** Whether to show the debt payment slider */
  showDebtPayment: boolean;
  /** The dollar amount that will be divided. Used for display only. */
  totalAmount: number;
  /** Called whenever any allocation changes */
  onChange: (allocation: {
    emergencyFund: number;
    savings: number;
    spending: number;
    investing: number;
    debtPayment: number;
  }) => void;
  className?: string;
}

interface CategoryConfig {
  key: BucketKey;
  label: string;
  icon: React.ReactNode;
  color: string;
  thumbColor: string;
  bgColor: string;
  emoji: string;
}

const allCategories: CategoryConfig[] = [
  {
    key: "emergencyFund",
    label: "Emergency Fund",
    icon: <ShieldAlert className="h-4 w-4" />,
    color: "text-red-500",
    thumbColor: "bg-red-500",
    bgColor: "bg-red-100",
    emoji: "\uD83D\uDEA8",
  },
  {
    key: "savings",
    label: "Savings",
    icon: <PiggyBank className="h-4 w-4" />,
    color: "text-emerald-500",
    thumbColor: "bg-emerald-500",
    bgColor: "bg-emerald-100",
    emoji: "\uD83D\uDC37",
  },
  {
    key: "investing",
    label: "Investing",
    icon: <TrendingUp className="h-4 w-4" />,
    color: "text-blue-500",
    thumbColor: "bg-blue-500",
    bgColor: "bg-blue-100",
    emoji: "\uD83D\uDCC8",
  },
  {
    key: "spending",
    label: "Spending",
    icon: <ShoppingBag className="h-4 w-4" />,
    color: "text-orange-500",
    thumbColor: "bg-orange-500",
    bgColor: "bg-orange-100",
    emoji: "\uD83D\uDECD\uFE0F",
  },
  {
    key: "debtPayment",
    label: "Debt Extra Payment",
    icon: <Banknote className="h-4 w-4" />,
    color: "text-purple-500",
    thumbColor: "bg-purple-500",
    bgColor: "bg-purple-100",
    emoji: "\uD83D\uDCB3",
  },
];

const AllocationSlider: React.FC<AllocationSliderProps> = ({
  emergencyFund,
  savings,
  spending,
  investing,
  debtPayment,
  showDebtPayment,
  totalAmount,
  onChange,
  className,
}) => {
  const categories = showDebtPayment
    ? allCategories
    : allCategories.filter((c) => c.key !== "debtPayment");

  const values: Record<BucketKey, number> = {
    emergencyFund,
    savings,
    spending,
    investing,
    debtPayment,
  };

  const handleChange = (key: BucketKey, newValue: number) => {
    const clamped = Math.max(0, Math.min(100, Math.round(newValue)));
    const currentValues = { emergencyFund, savings, spending, investing, debtPayment };
    const oldValue = currentValues[key];
    const delta = clamped - oldValue;

    if (delta === 0) return;

    // Determine the other keys and distribute the delta proportionally
    const activeKeys = categories.map((c) => c.key).filter((k) => k !== key);
    const otherTotal = activeKeys.reduce(
      (sum, k) => sum + currentValues[k],
      0
    );

    const newValues: Record<BucketKey, number> = { ...currentValues };
    newValues[key] = clamped;

    if (otherTotal === 0) {
      // Split evenly among others
      const remaining = 100 - clamped;
      const each = Math.floor(remaining / activeKeys.length);
      for (let i = 0; i < activeKeys.length; i++) {
        newValues[activeKeys[i]] = each;
      }
      // Fix rounding: add remainder to last key
      const distributed = each * activeKeys.length;
      if (remaining - distributed > 0) {
        newValues[activeKeys[activeKeys.length - 1]] += remaining - distributed;
      }
    } else {
      // Distribute proportionally
      for (const k of activeKeys) {
        const ratio = currentValues[k] / otherTotal;
        newValues[k] = Math.max(
          0,
          Math.round(currentValues[k] - delta * ratio)
        );
      }
      // Correct rounding errors
      const totalNow = categories.reduce(
        (sum, cat) => sum + newValues[cat.key],
        0
      );
      if (totalNow !== 100) {
        // Adjust the last "other" key
        const lastKey = activeKeys[activeKeys.length - 1];
        newValues[lastKey] += 100 - totalNow;
        newValues[lastKey] = Math.max(0, newValues[lastKey]);
      }
    }

    onChange(newValues);
  };

  const formatDollar = (pct: number) =>
    `$${Math.round((pct / 100) * totalAmount).toLocaleString()}`;

  // Calculate total for the summary bar (only active categories)
  const activeTotal = categories.reduce((sum, cat) => sum + values[cat.key], 0);

  return (
    <div className={cn("flex flex-col gap-5", className)}>
      {/* Summary bar */}
      <div className="flex h-4 w-full overflow-hidden rounded-full bg-muted">
        {categories.map((cat) => {
          const pct = values[cat.key];
          if (pct <= 0) return null;
          return (
            <motion.div
              key={cat.key}
              className={cat.thumbColor}
              style={{ width: `${pct}%` }}
              layout
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            />
          );
        })}
      </div>

      {/* Individual sliders */}
      {categories.map((cat) => {
        const pct = values[cat.key];
        const fillPct = Math.max(0, Math.min(100, pct));

        return (
          <div key={cat.key} className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span
                className={cn(
                  "flex items-center gap-1.5 text-sm font-bold",
                  cat.color
                )}
              >
                {cat.icon}
                {cat.label}
              </span>
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "rounded-md px-2 py-0.5 text-sm font-extrabold tabular-nums",
                    cat.bgColor,
                    cat.color
                  )}
                >
                  {pct}%
                </span>
                <span className="text-xs font-bold tabular-nums text-muted-foreground">
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
      {activeTotal !== 100 && (
        <p className="text-center text-xs font-bold text-destructive">
          Allocations must add up to 100% (currently {activeTotal}%)
        </p>
      )}
    </div>
  );
};

export { AllocationSlider };
export type { AllocationSliderProps };
