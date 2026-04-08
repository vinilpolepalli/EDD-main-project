"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Sparkles,
  Rocket,
  BookOpen,
  TrendingUp,
  Gamepad2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AvatarDisplay } from "@/components/shared/avatar-display";
import { XpBar } from "@/components/dashboard/xp-bar";
import { StreakCounter } from "@/components/dashboard/streak-counter";
import { TokenDisplay } from "@/components/dashboard/token-display";
import { ModuleCards } from "@/components/dashboard/module-cards";
import { StatsOverview } from "@/components/dashboard/stats-overview";
import { LegalDisclaimer } from "@/components/shared/legal-disclaimer";
import { Skeleton } from "@/components/ui/skeleton";
import { useGameState } from "@/hooks/use-game-state";
import { useLocalProgress } from "@/hooks/use-local-progress";
import type { AvatarConfig } from "@/types/game";

const DEFAULT_AVATAR: AvatarConfig = {
  skinColor: "#F5D0A9",
  hairStyle: "short",
  hairColor: "#4A2C0A",
  outfit: "t-shirt",
  accessory: "none",
};

const AVATAR_STORAGE_KEY = "cashquest-avatar";

function loadAvatar(): AvatarConfig {
  if (typeof window === "undefined") return DEFAULT_AVATAR;

  try {
    const stored = localStorage.getItem(AVATAR_STORAGE_KEY);
    if (stored) {
      const parsed: unknown = JSON.parse(stored);
      if (
        parsed !== null &&
        typeof parsed === "object" &&
        "skinColor" in parsed &&
        "hairStyle" in parsed
      ) {
        return parsed as AvatarConfig;
      }
    }
  } catch {
    // Corrupted storage
  }

  return DEFAULT_AVATAR;
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

  const [avatar, setAvatar] = useState<AvatarConfig>(DEFAULT_AVATAR);

  useEffect(() => {
    setAvatar(loadAvatar());
  }, []);

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

  // Calculate module progress percentages for ModuleCards
  const moduleProgress = useMemo(() => {
    const creditProgress = getTopicProgress("credit");
    const taxesProgress = getTopicProgress("taxes");
    const budgetingProgress = getTopicProgress("budgeting");
    const totalLessonCount = 5; // 5 lessons per topic
    const learnPercent = Math.round(
      ((creditProgress.completedCount +
        taxesProgress.completedCount +
        budgetingProgress.completedCount) /
        (totalLessonCount * 3)) *
        100
    );
    const simBest = getSimulatorBest();
    // Simulator progress: percentage of 24 months (2 years) survived
    const simPercent = simBest
      ? Math.min(Math.round((simBest.monthsSurvived / 24) * 100), 100)
      : 0;
    // Arcade progress: based on total games played, max at 30 games
    const arcadePercent = Math.min(
      Math.round((arcadeScores.length / 30) * 100),
      100
    );

    return {
      learn: learnPercent,
      simulator: simPercent,
      arcade: arcadePercent,
    };
  }, [getTopicProgress, getSimulatorBest, arcadeScores.length]);

  // Stats for StatsOverview
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
      <div className="flex min-h-screen flex-col">
        <div className="mx-auto w-full max-w-4xl flex-1 px-4 py-6">
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <Skeleton className="h-16 w-16 rounded-full" />
              <div className="flex flex-col gap-2">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
            <Skeleton className="h-16 w-full rounded-xl" />
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-24 rounded-xl" />
              <Skeleton className="h-24 rounded-xl" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Skeleton className="h-56 rounded-2xl" />
              <Skeleton className="h-56 rounded-2xl" />
              <Skeleton className="h-56 rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <motion.div
        className="mx-auto w-full max-w-4xl flex-1 px-4 py-6"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <div className="flex flex-col gap-6">
          {/* Greeting Section */}
          <motion.div
            variants={item}
            className="flex items-center gap-4"
          >
            <AvatarDisplay config={avatar} size="lg" />
            <div className="flex flex-col gap-1">
              <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
                Hey there!
              </h1>
              <p className="text-sm font-bold text-muted-foreground sm:text-base">
                Ready to level up?{" "}
                <Sparkles className="inline h-4 w-4 text-xp" />
              </p>
            </div>
          </motion.div>

          {/* Welcome Banner for first-time users */}
          {isFirstVisit && (
            <motion.div
              variants={item}
              className="relative overflow-hidden rounded-2xl border-2 border-learn bg-learn-light p-5 shadow-md"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-learn text-white shadow-sm">
                  <Rocket className="h-5 w-5" />
                </div>
                <div className="flex flex-col gap-1">
                  <h2 className="text-lg font-extrabold text-foreground">
                    Welcome to CashQuest!
                  </h2>
                  <p className="text-sm font-semibold leading-relaxed text-muted-foreground">
                    Start with the{" "}
                    <Link
                      href="/learn"
                      className="font-extrabold text-learn underline decoration-2 underline-offset-2 hover:text-learn/80"
                    >
                      Learn Path
                    </Link>{" "}
                    to earn XP and tokens. Then use your tokens in the Arcade!
                  </p>
                </div>
              </div>
              {/* Decorative dots */}
              <div className="absolute -right-3 -top-3 h-16 w-16 rounded-full bg-learn/10" />
              <div className="absolute -bottom-2 right-8 h-10 w-10 rounded-full bg-learn/10" />
            </motion.div>
          )}

          {/* XP Bar */}
          <motion.div variants={item}>
            <XpBar totalXp={progress.totalXp} />
          </motion.div>

          {/* Stats Row: Streak */}
          <motion.div
            variants={item}
            className="grid grid-cols-1 gap-4 sm:grid-cols-2"
          >
            <StreakCounter streak={progress.currentStreak} />
            <TokenDisplay tokens={0} />
          </motion.div>

          {/* Module Cards */}
          <motion.div variants={item}>
            <h2 className="mb-3 flex items-center gap-2 text-lg font-extrabold text-foreground">
              <Gamepad2 className="h-5 w-5 text-arcade" />
              Game Modes
            </h2>
            <ModuleCards progress={moduleProgress} />
          </motion.div>

          {/* Stats Overview */}
          <motion.div variants={item}>
            <h2 className="mb-3 flex items-center gap-2 text-lg font-extrabold text-foreground">
              <TrendingUp className="h-5 w-5 text-simulator" />
              Your Stats
            </h2>
            <StatsOverview
              totalXp={progress.totalXp}
              currentStreak={progress.currentStreak}
              lessonsCompleted={completedLessons.length}
              simulatorBestMonths={simulatorBest?.monthsSurvived ?? 0}
              arcadeHighScore={arcadeHighScore}
            />
          </motion.div>
        </div>
      </motion.div>

      {/* Legal Disclaimer */}
      <div className="border-t border-border px-4 py-3">
        <LegalDisclaimer />
      </div>
    </div>
  );
}
