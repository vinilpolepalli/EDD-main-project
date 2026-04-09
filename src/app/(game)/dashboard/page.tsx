"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Sparkles,
  Rocket,
  Lightbulb,
} from "lucide-react";
import { XpBar } from "@/components/dashboard/xp-bar";
import { StreakCounter } from "@/components/dashboard/streak-counter";
import { ModuleCards } from "@/components/dashboard/module-cards";
import { StatsOverview } from "@/components/dashboard/stats-overview";
import { Skeleton } from "@/components/ui/skeleton";
import { useGameState } from "@/hooks/use-game-state";
import { useLocalProgress } from "@/hooks/use-local-progress";

/** Financial tips that rotate daily */
const DAILY_TIPS = [
  "The earlier you start saving, the more your money grows thanks to compound interest!",
  "A budget is a plan for your money — it tells every dollar where to go.",
  "Your credit score is like a report card for how you handle money.",
  "Paying bills on time is one of the best ways to build a strong credit score.",
  "An emergency fund is money saved for unexpected expenses, like a flat tire.",
  "The difference between needs and wants is key to smart spending.",
  "Investing means putting money to work so it can grow over time.",
  "Taxes help pay for schools, roads, and other public services we all use.",
  "A good rule of thumb: save at least 20% of your income each month.",
  "Diversifying investments means not putting all your eggs in one basket!",
] as const;

function getDailyTip(): string {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  );
  return DAILY_TIPS[dayOfYear % DAILY_TIPS.length];
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

/** Staggered child animation variants */
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
} as const;

const item = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 200, damping: 20 },
  },
};

export default function DashboardPage() {
  const { progress, isLoaded: gameLoaded, updateStreak } = useGameState();
  const {
    completedLessons,
    simulatorRuns,
    arcadeScores,
    isLoaded: localLoaded,
    getTopicProgress,
    getSimulatorBest,
  } = useLocalProgress();

  const [dailyTip] = useState(getDailyTip);

  // Update streak on dashboard visit
  useEffect(() => {
    if (gameLoaded) {
      updateStreak();
    }
  }, [gameLoaded, updateStreak]);

  const isLoaded = gameLoaded && localLoaded;
  const isFirstVisit =
    isLoaded &&
    progress.totalXp === 0 &&
    completedLessons.length === 0 &&
    simulatorRuns.length === 0 &&
    arcadeScores.length === 0;

  // Calculate module progress
  const moduleProgress = useMemo(() => {
    const creditProgress = getTopicProgress("credit");
    const taxesProgress = getTopicProgress("taxes");
    const budgetingProgress = getTopicProgress("budgeting");
    const totalLessonCount = 5;
    const learnPercent = Math.round(
      ((creditProgress.completedCount +
        taxesProgress.completedCount +
        budgetingProgress.completedCount) /
        (totalLessonCount * 3)) *
        100
    );
    const simBest = getSimulatorBest();
    const simPercent = simBest
      ? Math.min(Math.round((simBest.monthsSurvived / 24) * 100), 100)
      : 0;

    return {
      learn: learnPercent,
      simulator: simPercent,
    };
  }, [getTopicProgress, getSimulatorBest]);

  const simulatorBest = useMemo(() => getSimulatorBest(), [getSimulatorBest]);
  const arcadeHighScore = useMemo(() => {
    if (arcadeScores.length === 0) return 0;
    return arcadeScores.reduce(
      (max, s) => (s.score > max ? s.score : max),
      0
    );
  }, [arcadeScores]);

  // Loading state
  if (!isLoaded) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-8 w-64 rounded-xl" />
          <Skeleton className="h-5 w-40 rounded-lg" />
        </div>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <Skeleton className="h-20 rounded-2xl" />
          <Skeleton className="h-20 rounded-2xl" />
          <Skeleton className="h-20 rounded-2xl" />
          <Skeleton className="h-20 rounded-2xl" />
        </div>
        <Skeleton className="h-20 rounded-2xl" />
        <div className="grid gap-5 sm:grid-cols-2">
          <Skeleton className="h-72 rounded-2xl" />
          <Skeleton className="h-72 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="flex flex-col gap-6"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {/* Welcome Banner */}
      <motion.div variants={item}>
        <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
          {getGreeting()}! <span className="inline-block">&#x1F44B;</span>
        </h1>
        {progress.currentStreak > 0 ? (
          <p className="mt-1 text-sm font-medium text-muted-foreground">
            You are on a {progress.currentStreak}-day streak!{" "}
            <Sparkles className="inline h-4 w-4 text-amber-500" />
          </p>
        ) : (
          <p className="mt-1 text-sm font-medium text-muted-foreground">
            Ready to start learning?
          </p>
        )}
      </motion.div>

      {/* First Visit Welcome */}
      {isFirstVisit && (
        <motion.div
          variants={item}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-green-500 to-green-600 p-6 text-white shadow-lg"
        >
          <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-white/10" />
          <div className="absolute -bottom-2 right-12 h-12 w-12 rounded-full bg-white/5" />
          <div className="relative z-10 flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
              <Rocket className="h-6 w-6" />
            </div>
            <div className="flex flex-col gap-1">
              <h2 className="text-lg font-extrabold">
                Welcome to CashQuest!
              </h2>
              <p className="text-sm leading-relaxed text-white/90">
                Start with the{" "}
                <Link
                  href="/learn"
                  className="font-extrabold underline decoration-2 underline-offset-2 hover:text-white"
                >
                  Learn Path
                </Link>{" "}
                to earn XP and level up your financial skills.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Quick Stats Grid */}
      <motion.div variants={item}>
        <StatsOverview
          totalXp={progress.totalXp}
          currentStreak={progress.currentStreak}
          lessonsCompleted={completedLessons.length}
          simulatorBestMonths={simulatorBest?.monthsSurvived ?? 0}
        />
      </motion.div>

      {/* XP + Streak Row */}
      <motion.div
        variants={item}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2"
      >
        <XpBar totalXp={progress.totalXp} />
        <StreakCounter streak={progress.currentStreak} />
      </motion.div>

      {/* Module Cards */}
      <motion.div variants={item}>
        <h2 className="mb-3 text-lg font-extrabold text-foreground">
          Continue Learning
        </h2>
        <ModuleCards
          progress={moduleProgress}
          simulatorLastMonth={simulatorBest?.monthsSurvived}
        />
      </motion.div>

      {/* Financial Tip of the Day */}
      <motion.div
        variants={item}
        className="rounded-2xl bg-amber-50 p-5 shadow-sm"
      >
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100">
            <Lightbulb className="h-5 w-5 text-amber-600" />
          </div>
          <div className="flex flex-col gap-1">
            <h3 className="text-sm font-bold text-amber-900">
              Did you know?
            </h3>
            <p className="text-sm leading-relaxed text-amber-800">
              {dailyTip}
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
