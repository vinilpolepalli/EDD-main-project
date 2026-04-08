"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  DollarSign,
  CreditCard,
  Smile,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { LifeEvent, EventChoice } from "@/types/game";

const categoryStyles: Record<
  LifeEvent["category"],
  { border: string; bg: string; icon: React.ReactNode; label: string }
> = {
  positive: {
    border: "border-emerald-400",
    bg: "bg-emerald-50",
    icon: <TrendingUp className="h-5 w-5 text-emerald-500" />,
    label: "Good News!",
  },
  negative: {
    border: "border-red-400",
    bg: "bg-red-50",
    icon: <TrendingDown className="h-5 w-5 text-destructive" />,
    label: "Uh oh!",
  },
  neutral: {
    border: "border-blue-300",
    bg: "bg-blue-50",
    icon: <Minus className="h-5 w-5 text-blue-500" />,
    label: "Life happens!",
  },
};

interface EventCardProps {
  event: LifeEvent;
  /** Called when the player selects a choice. Only relevant for choice events. */
  onChoiceSelect?: (choiceId: string) => void;
  /** If true, show the choice buttons in a more prominent modal-like style */
  isModal?: boolean;
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
          isPositive ? "text-emerald-600" : "text-destructive"
        )}
      >
        {display}
      </span>
    </div>
  );
};

function ChoiceEffectPreview({ choice }: { choice: EventChoice }) {
  const fx = choice.effects;
  const effects: Array<{ label: string; value: number; format: "money" | "score" }> = [];

  if (fx.balance && fx.balance !== 0) effects.push({ label: "Balance", value: fx.balance, format: "money" });
  if (fx.debt && fx.debt !== 0) effects.push({ label: "Debt", value: fx.debt > 0 ? fx.debt : fx.debt, format: "money" });
  if (fx.creditScore && fx.creditScore !== 0) effects.push({ label: "Credit", value: fx.creditScore, format: "score" });
  if (fx.happiness && fx.happiness !== 0) effects.push({ label: "Happiness", value: fx.happiness, format: "score" });
  if (fx.salaryMod && fx.salaryMod !== 0) effects.push({ label: "Salary", value: fx.salaryMod, format: "money" });
  if (fx.expensesMod && fx.expensesMod !== 0) effects.push({ label: "Expenses", value: fx.expensesMod, format: "money" });

  if (effects.length === 0) return null;

  return (
    <div className="mt-1 flex flex-wrap gap-1.5">
      {effects.map((eff) => {
        const isPos = eff.value > 0;
        const display =
          eff.format === "money"
            ? `${isPos ? "+" : ""}$${Math.abs(eff.value).toLocaleString()}`
            : `${isPos ? "+" : ""}${eff.value}`;

        return (
          <span
            key={eff.label}
            className={cn(
              "rounded px-1.5 py-0.5 text-[10px] font-bold",
              isPos ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
            )}
          >
            {eff.label}: {display}
          </span>
        );
      })}
    </div>
  );
}

const EventCard: React.FC<EventCardProps> = ({
  event,
  onChoiceSelect,
  isModal = false,
  className,
}) => {
  const style = categoryStyles[event.category];
  const hasChoices = event.choices && event.choices.length > 0;

  return (
    <motion.div
      className={cn(
        "flex flex-col gap-4 rounded-2xl border-2 p-5 shadow-md",
        style.border,
        style.bg,
        isModal && "shadow-2xl",
        className
      )}
      initial={{ opacity: 0, y: 30, scale: isModal ? 0.95 : 1 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
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

      {/* Auto-apply effects (no choices) */}
      {!hasChoices && (
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
      )}

      {/* Choice buttons */}
      {hasChoices && event.choices && onChoiceSelect && (
        <div className="flex flex-col gap-3">
          <p className="text-center text-xs font-extrabold text-muted-foreground">
            WHAT WILL YOU DO?
          </p>
          {event.choices.map((choice, index) => (
            <motion.div
              key={choice.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + index * 0.1 }}
            >
              <Button
                variant="outline"
                className="h-auto w-full flex-col items-start gap-1 rounded-xl border-2 p-4 text-left hover:border-purple-400 hover:bg-purple-50"
                onClick={() => onChoiceSelect(choice.id)}
              >
                <div className="flex w-full items-center justify-between">
                  <span className="text-sm font-extrabold text-foreground">
                    {choice.label}
                  </span>
                  <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                </div>
                <ChoiceEffectPreview choice={choice} />
              </Button>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export { EventCard };
export type { EventCardProps };
