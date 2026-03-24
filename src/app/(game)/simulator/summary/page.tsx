"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Trophy,
  Calendar,
  DollarSign,
  CreditCard,
  Smile,
  Zap,
  RotateCcw,
  Home,
  TrendingUp,
  Star,
  Target,
  PiggyBank,
  ShieldCheck,
} from "lucide-react";
import { GameLayout } from "@/components/shared/game-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useGameState } from "@/hooks/use-game-state";
import { useLocalProgress } from "@/hooks/use-local-progress";
import type { SimulatorState } from "@/types/game";

const SIM_STORAGE_KEY = "cashquest-sim-state";

function formatMoney(amount: number): string {
  return `$${amount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

interface PerformanceRating {
  title: string;
  emoji: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

function getPerformanceRating(
  finalBalance: number,
  startingBalance: number
): PerformanceRating {
  if (finalBalance <= 0) {
    return {
      title: "Bankrupt",
      emoji: "💸",
      color: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-300",
    };
  }
  if (finalBalance > startingBalance * 2) {
    return {
      title: "Financial Wizard",
      emoji: "🧙",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-300",
    };
  }
  if (finalBalance > startingBalance) {
    return {
      title: "Money Smart",
      emoji: "🧠",
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-300",
    };
  }
  return {
    title: "Getting There",
    emoji: "📈",
    color: "text-yellow-600",
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-300",
  };
}

function getTips(state: SimulatorState, startingBalance: number): string[] {
  const tips: string[] = [];

  if (state.balance <= 0) {
    tips.push("Try building an emergency fund by saving at least 20% each month.");
  }

  if (state.savingsAllocation < state.spendingAllocation) {
    tips.push("Try saving more than you spend on wants — your future self will thank you!");
  }

  if (state.investments < state.salary) {
    tips.push("Investing even a small amount each month can grow your money over time through compound returns.");
  }

  if (state.creditScore < 650) {
    tips.push("Keep your credit score healthy by saving consistently and avoiding too much spending.");
  }

  if (state.happiness < 50) {
    tips.push("Don't forget to treat yourself sometimes — balance is key to financial happiness!");
  }

  if (tips.length === 0) {
    tips.push("Great job! Keep up the smart money habits.");
    tips.push("Try to beat your record by surviving more months with a higher balance!");
  }

  return tips;
}

/** Celebratory particle for good performance */
function CelebrationParticle({ index }: { index: number }) {
  const emojis = ["🌟", "✨", "💰", "🎉", "🏆", "💎", "🪙", "📈"];
  const emoji = emojis[index % emojis.length];
  const startX = (index * 43) % 100;
  const delay = (index * 0.15) % 2;
  const duration = 2.5 + (index * 0.3) % 1.5;

  return (
    <motion.span
      className="pointer-events-none absolute text-xl"
      style={{ left: `${startX}%` }}
      initial={{ y: 0, opacity: 1, scale: 0.5 }}
      animate={{
        y: -300 - (index * 20) % 200,
        opacity: 0,
        scale: 1.2,
        x: (index % 2 === 0 ? 1 : -1) * (30 + (index * 13) % 50),
        rotate: 360,
      }}
      transition={{
        duration,
        delay,
        ease: "easeOut",
      }}
    >
      {emoji}
    </motion.span>
  );
}

interface SummaryStatProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  delay: number;
}

function SummaryStat({ icon, label, value, delay }: SummaryStatProps) {
  return (
    <motion.div
      className="flex flex-col items-center gap-1 rounded-xl bg-white/80 p-3 shadow-sm"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, type: "spring", stiffness: 200, damping: 20 }}
    >
      {icon}
      <span className="text-lg font-extrabold tabular-nums text-foreground">
        {value}
      </span>
      <span className="text-[10px] font-bold text-muted-foreground">
        {label}
      </span>
    </motion.div>
  );
}

export default function SimulatorSummaryPage() {
  const router = useRouter();
  const { updateXp } = useGameState();
  const { addSimulatorRun } = useLocalProgress();
  const [state, setState] = useState<SimulatorState | null>(null);
  const [startingBalance, setStartingBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [xpAwarded, setXpAwarded] = useState(0);
  const hasAwardedRef = useRef(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(SIM_STORAGE_KEY);
      if (stored) {
        const parsed: unknown = JSON.parse(stored);
        if (
          parsed !== null &&
          typeof parsed === "object" &&
          "month" in parsed &&
          "balance" in parsed &&
          "salary" in parsed
        ) {
          const simState = parsed as SimulatorState;
          setState(simState);

          // Estimate starting balance from the initial generation formula
          // We don't have the original starting balance stored, so we use a reasonable default
          // The range is $1,000 - $5,000, so we use the midpoint as a rough estimate
          setStartingBalance(3000);
        } else {
          router.replace("/simulator");
          return;
        }
      } else {
        router.replace("/simulator");
        return;
      }
    } catch {
      router.replace("/simulator");
      return;
    }
    setIsLoading(false);
  }, [router]);

  // Award XP and save run once
  useEffect(() => {
    if (!state || hasAwardedRef.current) return;
    hasAwardedRef.current = true;

    const monthsSurvived = state.month - 1;
    const balanceBonus = state.balance > startingBalance * 2 ? 100 : state.balance > startingBalance ? 50 : 0;
    const totalXp = monthsSurvived * 20 + balanceBonus;

    setXpAwarded(totalXp);
    updateXp(totalXp);

    addSimulatorRun({
      runId: `sim-${Date.now()}`,
      monthsSurvived,
      finalBalance: state.balance,
      finalCreditScore: state.creditScore,
    });

    // Clean up sim state from localStorage
    try {
      localStorage.removeItem(SIM_STORAGE_KEY);
    } catch {
      // Ignore
    }
  }, [state, startingBalance, updateXp, addSimulatorRun]);

  if (isLoading || !state) {
    return (
      <GameLayout title="Summary" module="simulator" backHref="/simulator">
        <div className="flex flex-col gap-4 py-8">
          <Skeleton className="mx-auto h-20 w-20 rounded-2xl" />
          <Skeleton className="mx-auto h-8 w-48" />
          <Skeleton className="h-40 w-full rounded-xl" />
          <Skeleton className="h-32 w-full rounded-xl" />
        </div>
      </GameLayout>
    );
  }

  const monthsSurvived = state.month - 1;
  const rating = getPerformanceRating(state.balance, startingBalance);
  const tips = getTips(state, startingBalance);
  const showCelebration = state.balance > startingBalance;

  return (
    <GameLayout title="Summary" module="simulator" backHref="/simulator">
      <div className="relative flex flex-col items-center gap-8 overflow-hidden pb-8">
        {/* Celebration Particles */}
        {showCelebration && (
          <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
            {Array.from({ length: 16 }).map((_, i) => (
              <CelebrationParticle key={i} index={i} />
            ))}
          </div>
        )}

        {/* Performance Rating */}
        <motion.div
          className={`flex flex-col items-center gap-3 rounded-3xl border-2 ${rating.borderColor} ${rating.bgColor} px-8 py-6 text-center shadow-lg`}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
        >
          <motion.span
            className="text-5xl"
            initial={{ scale: 0, rotate: -30 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 300, damping: 12 }}
          >
            {rating.emoji}
          </motion.span>
          <motion.h2
            className={`text-2xl font-extrabold tracking-tight ${rating.color} sm:text-3xl`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {rating.title}
          </motion.h2>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Badge className="bg-white/80 text-purple-700 text-sm font-extrabold">
              +{xpAwarded} XP Earned
            </Badge>
          </motion.div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          className="grid w-full max-w-md grid-cols-2 gap-3 sm:grid-cols-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <SummaryStat
            icon={<Calendar className="h-5 w-5 text-purple-500" />}
            label="Months Survived"
            value={`${monthsSurvived}`}
            delay={0.4}
          />
          <SummaryStat
            icon={<DollarSign className="h-5 w-5 text-green-500" />}
            label="Final Balance"
            value={formatMoney(state.balance)}
            delay={0.5}
          />
          <SummaryStat
            icon={<CreditCard className="h-5 w-5 text-blue-500" />}
            label="Credit Score"
            value={`${state.creditScore}`}
            delay={0.6}
          />
          <SummaryStat
            icon={<Smile className="h-5 w-5 text-yellow-500" />}
            label="Happiness"
            value={`${state.happiness}%`}
            delay={0.7}
          />
          <SummaryStat
            icon={<TrendingUp className="h-5 w-5 text-blue-500" />}
            label="Investments"
            value={formatMoney(state.investments)}
            delay={0.8}
          />
          <SummaryStat
            icon={<Zap className="h-5 w-5 text-orange-500" />}
            label="Life Events"
            value={`${state.events.length}`}
            delay={0.9}
          />
        </motion.div>

        {/* Financial Tips */}
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <Card className="border-2 border-purple-200">
            <CardContent className="flex flex-col gap-3 p-5">
              <h3 className="flex items-center gap-2 text-base font-extrabold text-purple-700">
                <Target className="h-5 w-5" />
                Financial Tips
              </h3>
              {tips.map((tip, i) => (
                <motion.div
                  key={i}
                  className="flex items-start gap-3 rounded-xl bg-purple-50 p-3"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.1 + i * 0.1 }}
                >
                  <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-purple-200">
                    <Star className="h-3 w-3 text-purple-600" />
                  </div>
                  <p className="text-sm font-semibold leading-relaxed text-foreground">
                    {tip}
                  </p>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          className="flex w-full max-w-md flex-col gap-3 sm:flex-row"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3 }}
        >
          <Button
            size="lg"
            className="flex-1 bg-gradient-to-r from-purple-600 to-violet-600 text-white hover:from-purple-700 hover:to-violet-700"
            onClick={() => router.push("/simulator/setup")}
          >
            <RotateCcw className="h-5 w-5" />
            Play Again
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="flex-1 border-purple-300 text-purple-700 hover:bg-purple-50"
            onClick={() => router.push("/dashboard")}
          >
            <Home className="h-5 w-5" />
            Back to Dashboard
          </Button>
        </motion.div>
      </div>
    </GameLayout>
  );
}
