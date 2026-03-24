"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface SliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "type" | "value"> {
  value: number;
  onValueChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  /** Tailwind accent class for the slider track, e.g. "accent-primary" */
  color?: string;
  showValue?: boolean;
  formatValue?: (value: number) => string;
}

const Slider: React.FC<SliderProps> = ({
  value,
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
  label,
  color = "accent-primary",
  showValue = true,
  formatValue,
  className,
  ...props
}) => {
  const percentage = ((value - min) / (max - min)) * 100;
  const displayValue = formatValue ? formatValue(value) : `${value}`;

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {(label || showValue) && (
        <div className="flex items-center justify-between text-sm font-bold">
          {label && <span>{label}</span>}
          {showValue && (
            <span className="rounded-md bg-muted px-2 py-0.5 tabular-nums">
              {displayValue}
            </span>
          )}
        </div>
      )}
      <div className="relative flex items-center">
        <div className="absolute h-3 w-full rounded-full bg-muted" />
        <div
          className={cn("absolute h-3 rounded-full bg-primary", color.replace("accent-", "bg-"))}
          style={{ width: `${percentage}%` }}
        />
        <input
          type="range"
          role="slider"
          aria-label={label ?? "Slider"}
          aria-valuenow={value}
          aria-valuemin={min}
          aria-valuemax={max}
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onValueChange(Number(e.target.value))}
          className={cn(
            "relative z-10 h-8 w-full cursor-pointer appearance-none bg-transparent",
            "[&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:shadow-md",
            "[&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:bg-primary [&::-moz-range-thumb]:shadow-md"
          )}
          {...props}
        />
      </div>
    </div>
  );
};
Slider.displayName = "Slider";

export { Slider };
export type { SliderProps };
