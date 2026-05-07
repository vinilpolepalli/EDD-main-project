"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  Calendar,
  CreditCard,
  Zap,
  RotateCcw,
  Home,
  ShieldAlert,
  TrendingDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type BankruptPhase = "warning" | "spiral" | "bankrupt";

interface BankruptScreenProps {
  phase: BankruptPhase;
  monthsSurvived: number;
  finalCreditScore: number;
  totalEvents: number;
  debt?: number;
  /** Optional explanation of what went wrong */
  deathCause?: string;
  onRetry: () => void;
  onBackToDashboard: () => void;
  /** Called when the player wants to continue despite warning/spiral */
  onContinue?: () => void;
  className?: string;
}

const phaseConfig: Record<
  BankruptPhase,
  {
    title: string;
    icon: React.ReactNode;
    iconBg: string;
    borderColor: string;
    bgColor: string;
    textColor: string;
    description: string;
    tip: string;
  }
> = {
  warning: {
    title: "FINANCIAL WARNING",
    icon: <ShieldAlert className="h-10 w-10 text-white" />,
    iconBg: "bg-accent",
    borderColor: "border-paper-2",
    bgColor: "bg-orange-950",
    textColor: "text-muted",
    description:
      "Your balance is dangerously low! You're one bad event away from a debt spiral. Consider building an emergency fund to protect yourself.",
    tip: "Emergency funds should cover 3-6 months of expenses. Even $500 saved can prevent a financial crisis!",
  },
  spiral: {
    title: "DEBT SPIRAL",
    icon: <TrendingDown className="h-10 w-10 text-white" />,
    iconBg: "bg-red-600",
    borderColor: "border-red-500",
    bgColor: "bg-red-950",
    textColor: "text-red-400",
    description:
      "Your balance went negative! You had to borrow $1,000 in emergency credit at 24% APR. High-interest debt grows fast and can trap you.",
    tip: "Emergency credit at 24% APR means you'll owe $240 in interest per year on just $1,000. Always try to avoid high-interest debt!",
  },
  bankrupt: {
    title: "BANKRUPT",
    icon: <AlertTriangle className="h-10 w-10 text-white" />,
    iconBg: "bg-destructive",
    borderColor: "border-destructive",
    bgColor: "bg-foreground",
    textColor: "text-destructive",
    description:
      "Your debt exceeded 3x your monthly salary. In real life, this means you can't pay your bills, rent, or buy food. Financial planning helps prevent this!",
    tip: "The keys to avoiding bankruptcy: emergency fund, living below your means, paying off high-interest debt first, and avoiding lifestyle creep.",
  },
};

const BankruptScreen: React.FC<BankruptScreenProps> = ({
  phase,
  monthsSurvived,
  finalCreditScore,
  totalEvents,
  debt = 0,
  deathCause,
  onRetry,
  onBackToDashboard,
  onContinue,
  className,
}) => {
  const config = phaseConfig[phase];

  return (
    <motion.div
      className={cn(
        "flex w-full max-w-md flex-col items-center gap-6 rounded-2xl border-2 p-8 shadow-2xl",
        config.borderColor,
        config.bgColor,
        className
      )}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
    >
      {/* Icon */}
      <motion.div
        className={cn(
          "flex h-20 w-20 items-center justify-center rounded-2xl shadow-lg",
          config.iconBg
        )}
        animate={{
          scale: [1, 1.08, 1],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {config.icon}
      </motion.div>

      <div className="flex flex-col items-center gap-2">
        <motion.h2
          className={cn(
            "text-3xl font-extrabold tracking-tight",
            config.textColor
          )}
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
        >
          {config.title}
        </motion.h2>
        <p className="max-w-sm text-center text-sm leading-relaxed text-gray-400">
          {config.description}
        </p>
      </div>

      {/* Stats */}
      <div className="grid w-full max-w-xs grid-cols-3 gap-3">
        <motion.div
          className="flex flex-col items-center gap-1 rounded-xl bg-gray-800 p-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Calendar className="h-4 w-4 text-gray-400" />
          <span className="text-xl font-extrabold tabular-nums text-white">
            {monthsSurvived}
          </span>
          <span className="text-[10px] font-bold text-gray-500">Months</span>
        </motion.div>
        <motion.div
          className="flex flex-col items-center gap-1 rounded-xl bg-gray-800 p-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <CreditCard className="h-4 w-4 text-gray-400" />
          <span className="text-xl font-extrabold tabular-nums text-white">
            {finalCreditScore}
          </span>
          <span className="text-[10px] font-bold text-gray-500">Credit</span>
        </motion.div>
        <motion.div
          className="flex flex-col items-center gap-1 rounded-xl bg-gray-800 p-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Zap className="h-4 w-4 text-gray-400" />
          <span className="text-xl font-extrabold tabular-nums text-white">
            {totalEvents}
          </span>
          <span className="text-[10px] font-bold text-gray-500">Events</span>
        </motion.div>
      </div>

      {/* Debt amount for spiral/bankrupt */}
      {phase !== "warning" && debt > 0 && (
        <motion.div
          className="w-full max-w-xs rounded-xl border border-red-800 bg-red-900/50 p-3 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55 }}
        >
          <p className="text-xs font-bold text-red-300">Total Debt</p>
          <p className="text-2xl font-extrabold tabular-nums text-red-400">
            ${Math.round(debt).toLocaleString()}
          </p>
        </motion.div>
      )}

      {/* Explanation */}
      {deathCause && (
        <motion.div
          className="w-full max-w-xs rounded-xl border border-gray-700 bg-gray-800 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <p className="text-center text-sm font-semibold leading-relaxed text-gray-300">
            <span className={cn("font-extrabold", config.textColor)}>
              What happened:{" "}
            </span>
            {deathCause}
          </p>
        </motion.div>
      )}

      {/* Tip */}
      <motion.p
        className="max-w-xs text-center text-xs font-bold text-gray-500"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        Tip: {config.tip}
      </motion.p>

      {/* Actions */}
      <div className="flex w-full max-w-xs flex-col gap-3 sm:flex-row">
        {phase !== "bankrupt" && onContinue && (
          <Button
            className={cn(
              "flex-1",
              phase === "warning"
                ? "bg-accent hover:bg-accent"
                : "bg-red-600 hover:bg-red-700"
            )}
            onClick={onContinue}
          >
            Continue Playing
          </Button>
        )}
        <Button
          variant={phase === "bankrupt" ? "destructive" : "outline"}
          className={cn(
            "flex-1",
            phase !== "bankrupt" &&
              "border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white"
          )}
          onClick={onRetry}
        >
          <RotateCcw className="h-4 w-4" />
          Try Again
        </Button>
        <Button
          variant="outline"
          className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white"
          onClick={onBackToDashboard}
        >
          <Home className="h-4 w-4" />
          Dashboard
        </Button>
      </div>
    </motion.div>
  );
};

export { BankruptScreen };
export type { BankruptScreenProps, BankruptPhase };
