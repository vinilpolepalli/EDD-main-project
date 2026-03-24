"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Play,
  Calendar,
  DollarSign,
  CreditCard,
  Target,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { GameLayout } from "@/components/shared/game-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useLocalProgress } from "@/hooks/use-local-progress";
import type { SimulatorRunRecord } from "@/types/game";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 200, damping: 20 } },
} as const;

function formatMoney(amount: number): string {
  return `$${Math.abs(amount).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

function RunCard({ run, index }: { run: SimulatorRunRecord; index: number }) {
  const date = new Date(run.endedAt);
  const formattedDate = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  const isBankrupt = run.finalBalance <= 0;

  return (
    <motion.div
      variants={itemVariants}
      className="group"
    >
      <Card className="overflow-hidden border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-white transition-shadow hover:shadow-lg">
        <CardContent className="flex items-center gap-4 p-4">
          <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${isBankrupt ? "bg-red-100" : "bg-purple-100"}`}>
            <span className="text-xl font-extrabold tabular-nums text-purple-700">
              #{index + 1}
            </span>
          </div>
          <div className="flex flex-1 flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-extrabold text-foreground">
                {run.monthsSurvived} months
              </span>
              {isBankrupt && (
                <Badge className="bg-red-100 text-red-700 text-[10px] font-bold">
                  BANKRUPT
                </Badge>
              )}
              {!isBankrupt && run.finalBalance > 5000 && (
                <Badge className="bg-purple-100 text-purple-700 text-[10px] font-bold">
                  STRONG
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <DollarSign className="h-3 w-3" />
                {formatMoney(run.finalBalance)}
              </span>
              <span className="flex items-center gap-1">
                <CreditCard className="h-3 w-3" />
                {run.finalCreditScore}
              </span>
              <span>{formattedDate}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function RunsSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <Skeleton key={i} className="h-20 w-full rounded-xl" />
      ))}
    </div>
  );
}

export default function SimulatorPage() {
  const { simulatorRuns, isLoaded } = useLocalProgress();

  const sortedRuns = [...simulatorRuns].sort(
    (a, b) => new Date(b.endedAt).getTime() - new Date(a.endedAt).getTime()
  );

  return (
    <GameLayout title="Life Simulator" module="simulator" backHref="/dashboard">
      <motion.div
        className="flex flex-col gap-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Hero Section */}
        <motion.div
          variants={itemVariants}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-600 via-purple-500 to-violet-600 p-6 text-white shadow-xl sm:p-8"
        >
          {/* Background decoration */}
          <div className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/10" />
          <div className="pointer-events-none absolute -bottom-12 -left-12 h-48 w-48 rounded-full bg-white/5" />

          <div className="relative flex flex-col gap-4">
            <motion.div
              className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 shadow-lg backdrop-blur-sm"
              initial={{ rotate: -15, scale: 0.8 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
            >
              <TrendingUp className="h-8 w-8" />
            </motion.div>

            <div className="flex flex-col gap-2">
              <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
                Life Simulator
              </h2>
              <p className="max-w-md text-sm leading-relaxed text-purple-100 sm:text-base">
                Can you manage your money through real life? Make smart choices
                about saving, spending, and investing each month. Watch out for
                surprise events!
              </p>
            </div>

            <Link href="/simulator/setup">
              <Button
                size="lg"
                className="mt-2 w-full bg-white text-purple-700 hover:bg-purple-50 sm:w-auto"
              >
                <Play className="h-5 w-5" />
                Start New Simulation
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Rules Card */}
        <motion.div variants={itemVariants}>
          <Card className="border-2 border-purple-100">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg text-purple-700">
                <Target className="h-5 w-5" />
                How It Works
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {[
                { icon: <Sparkles className="h-4 w-4 text-purple-500" />, text: "You get a random age, salary, and starting balance" },
                { icon: <DollarSign className="h-4 w-4 text-green-500" />, text: "Each month, split your extra money between savings, spending, and investing" },
                { icon: <Calendar className="h-4 w-4 text-blue-500" />, text: "Random life events happen — car repairs, bonuses, medical bills!" },
                { icon: <CreditCard className="h-4 w-4 text-orange-500" />, text: "Your credit score changes based on your decisions" },
                { icon: <TrendingUp className="h-4 w-4 text-red-500" />, text: "If your balance hits $0 with debt, it's GAME OVER" },
              ].map((rule, i) => (
                <motion.div
                  key={i}
                  className="flex items-start gap-3 rounded-xl bg-purple-50/60 p-3"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.08 }}
                >
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm">
                    {rule.icon}
                  </div>
                  <p className="text-sm font-semibold leading-relaxed text-foreground">
                    {rule.text}
                  </p>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Previous Runs Section */}
        <motion.div variants={itemVariants} className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-extrabold text-foreground">
              Previous Runs
            </h3>
            {sortedRuns.length > 0 && (
              <Badge className="bg-purple-100 text-purple-700">
                {sortedRuns.length} {sortedRuns.length === 1 ? "run" : "runs"}
              </Badge>
            )}
          </div>

          {!isLoaded ? (
            <RunsSkeleton />
          ) : sortedRuns.length === 0 ? (
            <Card className="border-2 border-dashed border-purple-200">
              <CardContent className="flex flex-col items-center gap-3 py-8 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-100">
                  <TrendingUp className="h-7 w-7 text-purple-400" />
                </div>
                <p className="text-sm font-bold text-muted-foreground">
                  No runs yet! Start your first simulation above.
                </p>
              </CardContent>
            </Card>
          ) : (
            <motion.div
              className="flex flex-col gap-3"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {sortedRuns.map((run, index) => (
                <RunCard key={run.runId} run={run} index={index} />
              ))}
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </GameLayout>
  );
}
