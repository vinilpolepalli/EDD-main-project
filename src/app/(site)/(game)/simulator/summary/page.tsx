"use client";

import { useState, useEffect, useRef, useMemo } from "react";
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
  ShieldAlert,
} from "lucide-react";
import { GameLayout } from "@/components/shared/game-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useGameState } from "@/hooks/use-game-state";
import { useLocalProgress } from "@/hooks/use-local-progress";
import { SIMULATOR_GOALS } from "@/lib/constants/scenarios";
import type { SimulatorState, ActivityEntry } from "@/types/game";

const SIM_STORAGE_KEY = "cashquest-sim-state";

function formatMoney(amount: number): string {
  return `$${Math.round(amount).toLocaleString()}`;
}

interface PerformanceRating {
  title: string;
  emoji: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

function getPerformanceRating(state: SimulatorState): PerformanceRating {
  const netWorth =
    state.balance + state.emergencyFund + state.investments - state.debt;

  if (state.balance <= 0 || netWorth < -10000) {
    return {
      title: "Bankrupt",
      emoji: "\uD83D\uDCB8",
      color: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-300",
    };
  }
  if (netWorth > 50000) {
    return {
      title: "Financial Wizard",
      emoji: "\uD83E\uDDD9",
      color: "text-ink",
      bgColor: "bg-paper-2",
      borderColor: "border-paper-2",
    };
  }
  if (netWorth > 20000) {
    return {
      title: "Wealth Builder",
      emoji: "\uD83D\uDCB0",
      color: "text-accent",
      bgColor: "bg-accent-soft",
      borderColor: "border-accent-soft",
    };
  }
  if (netWorth > state.startingBalance) {
    return {
      title: "Money Smart",
      emoji: "\uD83E\uDDE0",
      color: "text-accent",
      bgColor: "bg-accent-soft",
      borderColor: "border-accent-soft",
    };
  }
  return {
    title: "Getting There",
    emoji: "\uD83D\uDCC8",
    color: "text-accent",
    bgColor: "bg-paper-2",
    borderColor: "border-paper-2",
  };
}

function getTips(state: SimulatorState): string[] {
  const tips: string[] = [];
  const netWorth =
    state.balance + state.emergencyFund + state.investments - state.debt;

  if (state.emergencyFund < state.monthlyExpenses * 3) {
    tips.push(
      "Build your emergency fund to cover at least 3 months of expenses \u2014 it's your financial safety net!"
    );
  }

  if (state.debt > 0) {
    tips.push(
      "Focus on paying off high-interest debt first. Every dollar in interest is money lost!"
    );
  }

  if (state.investments < state.salary * 2) {
    tips.push(
      "Investing even a small amount each month lets compound interest work its magic over time."
    );
  }

  if (state.creditScore < 650) {
    tips.push(
      "Boost your credit score by paying bills on time, keeping debt low, and saving consistently."
    );
  }

  if (state.happiness < 50) {
    tips.push(
      "Don't forget to treat yourself sometimes! Financial health includes mental health."
    );
  }

  if (tips.length === 0) {
    tips.push("Great job! You made smart financial decisions.");
    tips.push(
      "Try a different scenario next time to learn new financial skills!"
    );
  }

  return tips;
}

/** Simple SVG sparkline chart for net worth history */
function NetWorthSparkline({
  data,
  className,
}: {
  data: number[];
  className?: string;
}) {
  if (data.length < 2) return null;

  const width = 400;
  const height = 100;
  const padding = 10;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points = data
    .map((value, index) => {
      const x =
        padding +
        (index / (data.length - 1)) * (width - padding * 2);
      const y =
        height -
        padding -
        ((value - min) / range) * (height - padding * 2);
      return `${x},${y}`;
    })
    .join(" ");

  // Create area fill path
  const firstX = padding;
  const lastX =
    padding + ((data.length - 1) / (data.length - 1)) * (width - padding * 2);
  const areaPath = `M ${firstX},${height - padding} L ${points
    .split(" ")
    .map((p) => `L ${p}`)
    .join(" ")} L ${lastX},${height - padding} Z`;

  const lastValue = data[data.length - 1];
  const isPositive = lastValue >= 0;

  return (
    <div className={className}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full"
        aria-label={`Net worth trend: ${data.length} months, ending at $${Math.round(lastValue).toLocaleString()}`}
      >
        {/* Zero line */}
        {min < 0 && max > 0 && (
          <line
            x1={padding}
            y1={
              height -
              padding -
              ((0 - min) / range) * (height - padding * 2)
            }
            x2={width - padding}
            y2={
              height -
              padding -
              ((0 - min) / range) * (height - padding * 2)
            }
            stroke="#d1d5db"
            strokeWidth="1"
            strokeDasharray="4,4"
          />
        )}

        {/* Area fill */}
        <path
          d={areaPath}
          fill={isPositive ? "rgba(16, 185, 129, 0.15)" : "rgba(239, 68, 68, 0.15)"}
        />

        {/* Line */}
        <polyline
          points={points}
          fill="none"
          stroke={isPositive ? "#10b981" : "#ef4444"}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* End dot */}
        {data.length > 0 && (
          <circle
            cx={lastX}
            cy={
              height -
              padding -
              ((lastValue - min) / range) * (height - padding * 2)
            }
            r="4"
            fill={isPositive ? "#10b981" : "#ef4444"}
          />
        )}
      </svg>
    </div>
  );
}

/** Celebratory particle for good performance */
function CelebrationParticle({ index }: { index: number }) {
  const emojis = [
    "\uD83C\uDF1F",
    "\u2728",
    "\uD83D\uDCB0",
    "\uD83C\uDF89",
    "\uD83C\uDFC6",
    "\uD83D\uDC8E",
    "\uD83E\uDE99",
    "\uD83D\uDCC8",
  ];
  const emoji = emojis[index % emojis.length];
  const startX = (index * 43) % 100;
  const delay = (index * 0.15) % 2;
  const duration = 2.5 + ((index * 0.3) % 1.5);

  return (
    <motion.span
      className="pointer-events-none absolute text-xl"
      style={{ left: `${startX}%` }}
      initial={{ y: 0, opacity: 1, scale: 0.5 }}
      animate={{
        y: -300 - ((index * 20) % 200),
        opacity: 0,
        scale: 1.2,
        x: (index % 2 === 0 ? 1 : -1) * (30 + ((index * 13) % 50)),
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
          setState(parsed as SimulatorState);
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
    const netWorth =
      state.balance + state.emergencyFund + state.investments - state.debt;
    const balanceBonus =
      netWorth > state.startingBalance * 2
        ? 100
        : netWorth > state.startingBalance
          ? 50
          : 0;
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
  }, [state, updateXp, addSimulatorRun]);

  const goal = useMemo(() => {
    if (!state) return null;
    return SIMULATOR_GOALS.find((g) => g.id === state.goalId) ?? null;
  }, [state]);

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
  const netWorth =
    state.balance + state.emergencyFund + state.investments - state.debt;
  const rating = getPerformanceRating(state);
  const tips = getTips(state);
  const showCelebration = netWorth > state.startingBalance;

  const goalProgress = goal ? goal.progressValue(state) : 0;
  const goalComplete = goal ? goal.isComplete(state) : false;

  // Get last 5 activity log entries
  const recentActivity = (state.activityLog || [])
    .filter((e: ActivityEntry) => e.type === "choice" || e.type === "milestone")
    .slice(-5)
    .reverse();

  return (
    <GameLayout title="Summary" module="simulator" backHref="/simulator">
      <div className="relative flex flex-col items-center gap-8 overflow-hidden pb-8">
        {/* Celebration Particles */}
        {showCelebration && (
          <div
            className="pointer-events-none absolute inset-0 overflow-hidden"
            aria-hidden="true"
          >
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
            transition={{
              delay: 0.2,
              type: "spring",
              stiffness: 300,
              damping: 12,
            }}
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
            className="flex flex-col items-center gap-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Badge className="bg-white/80 text-sm font-extrabold text-ink">
              +{xpAwarded} XP Earned
            </Badge>
            <span className="text-xs font-bold text-muted-foreground">
              Life Stage: {state.lifeStage}
            </span>
          </motion.div>
        </motion.div>

        {/* Goal Status */}
        {goal && (
          <motion.div
            className={`w-full max-w-md rounded-2xl border-2 p-5 ${
              goalComplete
                ? "border-accent bg-accent-soft"
                : "border-paper-2 bg-paper-2"
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm font-extrabold">
                <Target
                  className={`h-5 w-5 ${goalComplete ? "text-accent" : "text-ink"}`}
                />
                {goal.label}
              </span>
              {goalComplete ? (
                <Badge className="bg-accent text-white">
                  {"\uD83C\uDF89"} ACHIEVED!
                </Badge>
              ) : (
                <span className="text-sm font-extrabold tabular-nums text-ink">
                  {goalProgress}%
                </span>
              )}
            </div>
            <Progress
              value={goalProgress}
              className={`mt-2 h-3 ${goalComplete ? "[&>div]:bg-accent" : "[&>div]:bg-ink"}`}
            />
          </motion.div>
        )}

        {/* Net Worth Sparkline */}
        {state.netWorthHistory && state.netWorthHistory.length >= 2 && (
          <motion.div
            className="w-full max-w-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="border-2 border-border">
              <CardContent className="flex flex-col gap-2 p-5">
                <div className="flex items-center justify-between">
                  <h3 className="flex items-center gap-2 text-sm font-extrabold text-foreground">
                    <TrendingUp className="h-4 w-4 text-ink" />
                    Net Worth Over Time
                  </h3>
                  <span
                    className={`text-sm font-extrabold tabular-nums ${
                      netWorth >= 0 ? "text-accent" : "text-red-600"
                    }`}
                  >
                    {formatMoney(netWorth)}
                  </span>
                </div>
                <NetWorthSparkline data={state.netWorthHistory} />
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Stats Grid */}
        <motion.div
          className="grid w-full max-w-md grid-cols-2 gap-3 sm:grid-cols-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <SummaryStat
            icon={<Calendar className="h-5 w-5 text-ink" />}
            label="Months Survived"
            value={`${monthsSurvived}`}
            delay={0.5}
          />
          <SummaryStat
            icon={<DollarSign className="h-5 w-5 text-accent" />}
            label="Final Balance"
            value={formatMoney(state.balance)}
            delay={0.55}
          />
          <SummaryStat
            icon={<CreditCard className="h-5 w-5 text-ink" />}
            label="Credit Score"
            value={`${state.creditScore}`}
            delay={0.6}
          />
          <SummaryStat
            icon={<Smile className="h-5 w-5 text-accent" />}
            label="Happiness"
            value={`${state.happiness}%`}
            delay={0.65}
          />
          <SummaryStat
            icon={<ShieldAlert className="h-5 w-5 text-accent" />}
            label="Emergency Fund"
            value={formatMoney(state.emergencyFund)}
            delay={0.7}
          />
          <SummaryStat
            icon={<TrendingUp className="h-5 w-5 text-ink" />}
            label="Investments"
            value={formatMoney(state.investments)}
            delay={0.75}
          />
        </motion.div>

        {/* Recent Decisions */}
        {recentActivity.length > 0 && (
          <motion.div
            className="w-full max-w-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Card className="border-2 border-paper-2">
              <CardContent className="flex flex-col gap-3 p-5">
                <h3 className="flex items-center gap-2 text-sm font-extrabold text-ink">
                  <Zap className="h-4 w-4" />
                  Key Decisions Made
                </h3>
                {recentActivity.map((entry: ActivityEntry, i: number) => (
                  <motion.div
                    key={i}
                    className={`flex items-start gap-2.5 rounded-xl border px-3 py-2 ${
                      entry.positivity === "positive"
                        ? "border-accent-soft bg-accent-soft"
                        : entry.positivity === "negative"
                          ? "border-red-200 bg-red-50"
                          : "border-paper-2 bg-paper-2"
                    }`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.85 + i * 0.05 }}
                  >
                    <span className="mt-0.5 text-base">{entry.emoji}</span>
                    <p className="text-xs font-semibold leading-relaxed text-foreground">
                      {entry.text}
                    </p>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Financial Tips */}
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <Card className="border-2 border-paper-2">
            <CardContent className="flex flex-col gap-3 p-5">
              <h3 className="flex items-center gap-2 text-base font-extrabold text-ink">
                <Target className="h-5 w-5" />
                Financial Tips
              </h3>
              {tips.map((tip, i) => (
                <motion.div
                  key={i}
                  className="flex items-start gap-3 rounded-xl bg-paper-2 p-3"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.05 + i * 0.1 }}
                >
                  <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-paper-2">
                    <Star className="h-3 w-3 text-ink" />
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
            className="flex-1 bg-paper-2 from-ink to-ink text-white hover:from-ink hover:to-ink"
            onClick={() => router.push("/simulator/setup")}
          >
            <RotateCcw className="h-5 w-5" />
            Play Again
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="flex-1 border-paper-2 text-ink hover:bg-paper-2"
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
