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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface BankruptScreenProps {
  monthsSurvived: number;
  finalCreditScore: number;
  totalEvents: number;
  /** Optional explanation of what went wrong */
  deathCause?: string;
  onRetry: () => void;
  onBackToDashboard: () => void;
  className?: string;
}

const BankruptScreen: React.FC<BankruptScreenProps> = ({
  monthsSurvived,
  finalCreditScore,
  totalEvents,
  deathCause,
  onRetry,
  onBackToDashboard,
  className,
}) => {
  return (
    <motion.div
      className={cn(
        "flex flex-col items-center gap-6 rounded-2xl border-2 border-destructive bg-foreground p-8 shadow-2xl",
        className
      )}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
    >
      {/* Icon */}
      <motion.div
        className="flex h-20 w-20 items-center justify-center rounded-2xl bg-destructive shadow-lg"
        animate={{
          scale: [1, 1.08, 1],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <AlertTriangle className="h-10 w-10 text-white" />
      </motion.div>

      <div className="flex flex-col items-center gap-2">
        <motion.h2
          className="text-3xl font-extrabold tracking-tight text-destructive"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
        >
          BANKRUPT
        </motion.h2>
        <p className="max-w-sm text-center text-sm leading-relaxed text-gray-400">
          Your balance hit $0. In real life, running out of money means you
          cannot pay rent, buy food, or handle emergencies. Financial planning
          helps prevent this!
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

      {/* Explanation */}
      {deathCause && (
        <motion.div
          className="w-full max-w-xs rounded-xl border border-gray-700 bg-gray-800 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <p className="text-center text-sm font-semibold leading-relaxed text-gray-300">
            <span className="font-extrabold text-destructive">What happened: </span>
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
        Tip: Try saving more and building an emergency fund next time! Even
        small amounts add up with compound interest.
      </motion.p>

      {/* Actions */}
      <div className="flex w-full max-w-xs flex-col gap-3 sm:flex-row">
        <Button
          variant="destructive"
          className="flex-1"
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
export type { BankruptScreenProps };
