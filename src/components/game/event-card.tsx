"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus, DollarSign, CreditCard, Smile } from "lucide-react";
import { cn } from "@/lib/utils";
import type { LifeEvent } from "@/types/game";

const categoryStyles: Record<
  LifeEvent["category"],
  { border: string; bg: string; icon: React.ReactNode; label: string }
> = {
  positive: {
    border: "border-success",
    bg: "bg-learn-light",
    icon: <TrendingUp className="h-5 w-5 text-success" />,
    label: "Good News!",
  },
  negative: {
    border: "border-destructive",
    bg: "bg-red-50",
    icon: <TrendingDown className="h-5 w-5 text-destructive" />,
    label: "Uh oh!",
  },
  neutral: {
    border: "border-primary",
    bg: "bg-secondary",
    icon: <Minus className="h-5 w-5 text-primary" />,
    label: "Life happens!",
  },
};

interface EventCardProps {
  event: LifeEvent;
  className?: string;
}

const EffectRow: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: number;
  format?: "money" | "score" | "percent";
}> = ({ icon, label, value, format = "money" }) => {
  if (value === 0) return null;
  const isPositive = value > 0;
  let display: string;

  switch (format) {
    case "money":
      display = `${isPositive ? "+" : ""}$${Math.abs(value).toLocaleString()}`;
      break;
    case "score":
      display = `${isPositive ? "+" : ""}${value}`;
      break;
    case "percent":
      display = `${isPositive ? "+" : ""}${value}%`;
      break;
  }

  return (
    <div className="flex items-center justify-between text-sm">
      <span className="flex items-center gap-1.5 font-semibold text-foreground">
        {icon}
        {label}
      </span>
      <span
        className={cn(
          "font-extrabold tabular-nums",
          isPositive ? "text-success" : "text-destructive"
        )}
      >
        {display}
      </span>
    </div>
  );
};

const EventCard: React.FC<EventCardProps> = ({ event, className }) => {
  const style = categoryStyles[event.category];

  return (
    <motion.div
      className={cn(
        "flex flex-col gap-4 rounded-2xl border-2 p-5 shadow-md",
        style.border,
        style.bg,
        className
      )}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm">
          {style.icon}
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-bold text-muted-foreground">
            {style.label}
          </span>
          <span className="text-lg font-extrabold text-foreground">
            {event.name}
          </span>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm leading-relaxed text-foreground">
        {event.description}
      </p>

      {/* Effects */}
      <div className="flex flex-col gap-2 rounded-xl bg-white/60 p-3">
        <EffectRow
          icon={<DollarSign className="h-4 w-4" />}
          label="Balance"
          value={event.balanceEffect}
          format="money"
        />
        <EffectRow
          icon={<CreditCard className="h-4 w-4" />}
          label="Credit Score"
          value={event.creditScoreEffect}
          format="score"
        />
        <EffectRow
          icon={<Smile className="h-4 w-4" />}
          label="Happiness"
          value={event.happinessEffect}
          format="score"
        />
      </div>
    </motion.div>
  );
};

export { EventCard };
export type { EventCardProps };
