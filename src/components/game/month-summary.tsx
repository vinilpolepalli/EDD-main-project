"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  DollarSign,
  CreditCard,
  Smile,
  TrendingUp,
  PiggyBank,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { MonthResult } from "@/types/game";

interface MonthSummaryProps {
  result: MonthResult;
  month: number;
  className?: string;
}

interface SummaryRowProps {
  icon: React.ReactNode;
  label: string;
  before: number;
  after: number;
  format?: "money" | "score";
  delay: number;
}

const SummaryRow: React.FC<SummaryRowProps> = ({
  icon,
  label,
  before,
  after,
  format = "money",
  delay,
}) => {
  const diff = after - before;
  const isPositive = diff > 0;
  const isNeutral = diff === 0;

  const formatVal = (v: number) =>
    format === "money" ? `$${Math.abs(v).toLocaleString()}` : `${v}`;

  const formatDiff = () => {
    const sign = isPositive ? "+" : "";
    return format === "money"
      ? `${sign}$${diff.toLocaleString()}`
      : `${sign}${diff}`;
  };

  return (
    <motion.div
      className="flex items-center justify-between rounded-lg bg-white/60 px-3 py-2.5"
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, type: "spring", stiffness: 200, damping: 20 }}
    >
      <span className="flex items-center gap-2 text-sm font-bold text-foreground">
        {icon}
        {label}
      </span>
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground tabular-nums">
          {formatVal(before)}
        </span>
        <span className="text-muted-foreground">&rarr;</span>
        <span className="text-sm font-extrabold tabular-nums text-foreground">
          {formatVal(after)}
        </span>
        {!isNeutral && (
          <span
            className={cn(
              "rounded-md px-1.5 py-0.5 text-xs font-extrabold tabular-nums",
              isPositive ? "bg-learn-light text-success" : "bg-red-50 text-destructive"
            )}
          >
            {formatDiff()}
          </span>
        )}
      </div>
    </motion.div>
  );
};

const MonthSummary: React.FC<MonthSummaryProps> = ({
  result,
  month,
  className,
}) => {
  return (
    <motion.div
      className={cn(
        "flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 shadow-md",
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
    >
      <h3 className="text-center text-lg font-extrabold text-foreground">
        Month {month} Summary
      </h3>

      <div className="flex flex-col gap-2">
        <SummaryRow
          icon={<DollarSign className="h-4 w-4 text-success" />}
          label="Balance"
          before={result.balanceBefore}
          after={result.balanceAfter}
          format="money"
          delay={0.1}
        />
        <SummaryRow
          icon={<CreditCard className="h-4 w-4 text-primary" />}
          label="Credit Score"
          before={result.creditScoreBefore}
          after={result.creditScoreAfter}
          format="score"
          delay={0.2}
        />
        <SummaryRow
          icon={<Smile className="h-4 w-4 text-accent" />}
          label="Happiness"
          before={result.happinessBefore}
          after={result.happinessAfter}
          format="score"
          delay={0.3}
        />
      </div>

      {/* Extra earnings */}
      {(result.interestEarned > 0 || result.investmentReturn !== 0) && (
        <div className="flex flex-col gap-2 rounded-xl bg-muted p-3">
          {result.interestEarned > 0 && (
            <motion.div
              className="flex items-center justify-between text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <span className="flex items-center gap-1.5 font-semibold text-foreground">
                <PiggyBank className="h-4 w-4 text-success" />
                Savings Interest
              </span>
              <span className="font-extrabold text-success tabular-nums">
                +${result.interestEarned.toLocaleString()}
              </span>
            </motion.div>
          )}
          {result.investmentReturn !== 0 && (
            <motion.div
              className="flex items-center justify-between text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <span className="flex items-center gap-1.5 font-semibold text-foreground">
                <TrendingUp className="h-4 w-4 text-blue-500" />
                Investment Return
              </span>
              <span
                className={cn(
                  "font-extrabold tabular-nums",
                  result.investmentReturn > 0 ? "text-success" : "text-destructive"
                )}
              >
                {result.investmentReturn > 0 ? "+" : ""}$
                {result.investmentReturn.toLocaleString()}
              </span>
            </motion.div>
          )}
        </div>
      )}

      {/* Event */}
      {result.event && (
        <motion.div
          className={cn(
            "rounded-xl border p-3 text-sm",
            result.event.category === "positive"
              ? "border-success bg-learn-light"
              : result.event.category === "negative"
                ? "border-destructive bg-red-50"
                : "border-border bg-secondary"
          )}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
        >
          <span className="font-extrabold">Event: </span>
          {result.event.name} &mdash; {result.event.description}
        </motion.div>
      )}

      {/* Bankrupt warning */}
      {result.isBankrupt && (
        <motion.div
          className="flex items-center gap-2 rounded-xl bg-destructive/10 p-3 text-sm font-bold text-destructive"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <AlertTriangle className="h-5 w-5 shrink-0" />
          Your balance hit zero. You went bankrupt!
        </motion.div>
      )}
    </motion.div>
  );
};

export { MonthSummary };
export type { MonthSummaryProps };
