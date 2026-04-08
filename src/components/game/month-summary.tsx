"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  DollarSign,
  CreditCard,
  Smile,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  AlertTriangle,
  ShieldAlert,
  Receipt,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { MonthResult } from "@/types/game";

interface MonthSummaryProps {
  result: MonthResult;
  month: number;
  emergencyFundBalance?: number;
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
        <span className="text-xs tabular-nums text-muted-foreground">
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
              isPositive
                ? "bg-emerald-50 text-emerald-600"
                : "bg-red-50 text-destructive"
            )}
          >
            {formatDiff()}
          </span>
        )}
      </div>
    </motion.div>
  );
};

interface DetailRowProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  isPositive?: boolean;
  delay: number;
}

const DetailRow: React.FC<DetailRowProps> = ({
  icon,
  label,
  value,
  isPositive,
  delay,
}) => (
  <motion.div
    className="flex items-center justify-between text-sm"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay }}
  >
    <span className="flex items-center gap-1.5 font-semibold text-foreground">
      {icon}
      {label}
    </span>
    <span
      className={cn(
        "font-extrabold tabular-nums",
        isPositive === true
          ? "text-emerald-600"
          : isPositive === false
            ? "text-destructive"
            : "text-foreground"
      )}
    >
      {value}
    </span>
  </motion.div>
);

const MonthSummary: React.FC<MonthSummaryProps> = ({
  result,
  month,
  emergencyFundBalance = 0,
  className,
}) => {
  const netWorthChange =
    result.netWorth -
    (result.balanceBefore + (emergencyFundBalance || 0));

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

      {/* Main stat changes */}
      <div className="flex flex-col gap-2">
        <SummaryRow
          icon={<DollarSign className="h-4 w-4 text-emerald-500" />}
          label="Balance"
          before={result.balanceBefore}
          after={result.balanceAfter}
          format="money"
          delay={0.1}
        />
        <SummaryRow
          icon={<CreditCard className="h-4 w-4 text-purple-500" />}
          label="Credit Score"
          before={result.creditScoreBefore}
          after={result.creditScoreAfter}
          format="score"
          delay={0.2}
        />
        <SummaryRow
          icon={<Smile className="h-4 w-4 text-yellow-500" />}
          label="Happiness"
          before={result.happinessBefore}
          after={result.happinessAfter}
          format="score"
          delay={0.3}
        />
      </div>

      {/* Detailed breakdown */}
      <div className="flex flex-col gap-2 rounded-xl bg-muted p-3">
        {/* Taxes withheld */}
        {result.taxesThisMonth > 0 && (
          <DetailRow
            icon={<Receipt className="h-4 w-4 text-red-400" />}
            label="Taxes Withheld"
            value={`-$${result.taxesThisMonth.toLocaleString()}`}
            isPositive={false}
            delay={0.35}
          />
        )}

        {/* Debt interest */}
        {result.debtInterestThisMonth > 0 && (
          <DetailRow
            icon={<AlertTriangle className="h-4 w-4 text-red-500" />}
            label="Debt Interest"
            value={`-$${Math.round(result.debtInterestThisMonth).toLocaleString()}`}
            isPositive={false}
            delay={0.4}
          />
        )}

        {/* Emergency fund used */}
        {result.emergencyFundUsed > 0 && (
          <DetailRow
            icon={<ShieldAlert className="h-4 w-4 text-teal-500" />}
            label="Emergency Fund Used"
            value={`$${result.emergencyFundUsed.toLocaleString()}`}
            isPositive={true}
            delay={0.42}
          />
        )}

        {/* Savings interest */}
        {result.interestEarned > 0 && (
          <DetailRow
            icon={<PiggyBank className="h-4 w-4 text-emerald-500" />}
            label="Savings Interest"
            value={`+$${result.interestEarned.toLocaleString()}`}
            isPositive={true}
            delay={0.45}
          />
        )}

        {/* Investment return */}
        {result.investmentReturn !== 0 && (
          <DetailRow
            icon={<TrendingUp className="h-4 w-4 text-blue-500" />}
            label="Investment Return"
            value={`${result.investmentReturn > 0 ? "+" : ""}$${result.investmentReturn.toLocaleString()}`}
            isPositive={result.investmentReturn > 0}
            delay={0.5}
          />
        )}

        {/* Net worth change */}
        <motion.div
          className="mt-1 flex items-center justify-between border-t border-border pt-2 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55 }}
        >
          <span className="flex items-center gap-1.5 font-extrabold text-foreground">
            {netWorthChange >= 0 ? (
              <ArrowUpRight className="h-4 w-4 text-emerald-500" />
            ) : (
              <ArrowDownRight className="h-4 w-4 text-red-500" />
            )}
            Net Worth
          </span>
          <span
            className={cn(
              "font-extrabold tabular-nums",
              netWorthChange >= 0 ? "text-emerald-600" : "text-destructive"
            )}
          >
            ${Math.round(result.netWorth).toLocaleString()}
          </span>
        </motion.div>
      </div>

      {/* Event */}
      {result.event && !result.pendingChoice && (
        <motion.div
          className={cn(
            "rounded-xl border p-3 text-sm",
            result.event.category === "positive"
              ? "border-emerald-300 bg-emerald-50"
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

      {/* Choice explanation */}
      {result.choiceExplanation && (
        <motion.div
          className="rounded-xl border border-blue-200 bg-blue-50 p-3 text-sm"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.65 }}
        >
          <span className="font-extrabold text-blue-700">Lesson learned: </span>
          <span className="text-blue-800">{result.choiceExplanation}</span>
        </motion.div>
      )}

      {/* Debt spiral warning */}
      {result.debtSpiral && (
        <motion.div
          className="flex items-center gap-2 rounded-xl bg-orange-50 p-3 text-sm font-bold text-orange-700"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <AlertTriangle className="h-5 w-5 shrink-0" />
          Debt spiral! You borrowed emergency credit at high interest.
        </motion.div>
      )}

      {/* Bankrupt warning */}
      {result.isBankrupt && (
        <motion.div
          className="flex items-center gap-2 rounded-xl bg-destructive/10 p-3 text-sm font-bold text-destructive"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.75 }}
        >
          <AlertTriangle className="h-5 w-5 shrink-0" />
          Your debt exceeded 3x your monthly salary. You went bankrupt!
        </motion.div>
      )}
    </motion.div>
  );
};

export { MonthSummary };
export type { MonthSummaryProps };
