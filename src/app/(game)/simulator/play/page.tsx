"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  DollarSign,
  CreditCard,
  Smile,
  TrendingUp,
  Calendar,
  ArrowRight,
  LogOut,
  ChevronDown,
  Wallet,
  Receipt,
} from "lucide-react";
import { GameLayout } from "@/components/shared/game-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { AllocationSlider } from "@/components/game/allocation-slider";
import { MonthSummary } from "@/components/game/month-summary";
import { EventCard } from "@/components/game/event-card";
import { BankruptScreen } from "@/components/game/bankrupt-screen";
import { processMonth } from "@/lib/game-engine/simulator";
import type { SimulatorState, MonthAllocation, MonthResult } from "@/types/game";

const SIM_STORAGE_KEY = "cashquest-sim-state";

type Phase = "allocate" | "summary" | "bankrupt";

function formatMoney(amount: number): string {
  return `$${amount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

function getCreditScoreColor(score: number): string {
  if (score < 580) return "text-red-500";
  if (score < 670) return "text-yellow-500";
  return "text-green-500";
}

function getCreditScoreLabel(score: number): string {
  if (score < 580) return "Poor";
  if (score < 670) return "Fair";
  if (score < 740) return "Good";
  return "Excellent";
}

function getCreditScoreProgressColor(score: number): string {
  if (score < 580) return "bg-red-500";
  if (score < 670) return "bg-yellow-500";
  return "bg-green-500";
}

function StatCard({
  icon,
  label,
  value,
  subValue,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  subValue?: string;
  color: string;
}) {
  return (
    <div className={`flex flex-col items-center gap-1 rounded-xl ${color} p-3`}>
      {icon}
      <span className="text-lg font-extrabold tabular-nums text-foreground">
        {value}
      </span>
      <span className="text-[10px] font-bold text-muted-foreground">
        {label}
      </span>
      {subValue && (
        <span className="text-[10px] font-bold text-muted-foreground">
          {subValue}
        </span>
      )}
    </div>
  );
}

export default function SimulatorPlayPage() {
  const router = useRouter();
  const [state, setState] = useState<SimulatorState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [phase, setPhase] = useState<Phase>("allocate");
  const [monthResult, setMonthResult] = useState<MonthResult | null>(null);
  const [allocation, setAllocation] = useState({ savings: 34, spending: 33, investing: 33 });

  // Load state from localStorage
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
          router.replace("/simulator/setup");
          return;
        }
      } else {
        router.replace("/simulator/setup");
        return;
      }
    } catch {
      router.replace("/simulator/setup");
      return;
    }
    setIsLoading(false);
  }, [router]);

  const saveState = useCallback((newState: SimulatorState) => {
    try {
      localStorage.setItem(SIM_STORAGE_KEY, JSON.stringify(newState));
    } catch {
      // Storage full — continue anyway
    }
  }, []);

  const handleEndMonth = useCallback(() => {
    if (!state) return;

    const discretionaryIncome = state.salary - state.monthlyExpenses;

    const dollarAllocation: MonthAllocation = {
      savings: Math.round((allocation.savings / 100) * discretionaryIncome),
      spending: Math.round((allocation.spending / 100) * discretionaryIncome),
      investing: Math.round((allocation.investing / 100) * discretionaryIncome),
    };

    const eventSeed = Date.now() + state.month;
    const { newState, result } = processMonth(state, dollarAllocation, eventSeed);

    setMonthResult(result);
    setState(newState);
    saveState(newState);

    if (result.isBankrupt) {
      setPhase("bankrupt");
    } else {
      setPhase("summary");
    }
  }, [state, allocation, saveState]);

  const handleNextMonth = useCallback(() => {
    setPhase("allocate");
    setMonthResult(null);
    // Reset allocation to default
    setAllocation({ savings: 34, spending: 33, investing: 33 });
  }, []);

  const handleEndSimulation = useCallback(() => {
    router.push("/simulator/summary");
  }, [router]);

  const handleRetry = useCallback(() => {
    localStorage.removeItem(SIM_STORAGE_KEY);
    router.push("/simulator/setup");
  }, [router]);

  const handleBackToDashboard = useCallback(() => {
    router.push("/dashboard");
  }, [router]);

  if (isLoading || !state) {
    return (
      <GameLayout title="Life Simulator" module="simulator" backHref="/simulator">
        <div className="flex flex-col gap-4 py-8">
          <Skeleton className="h-32 w-full rounded-xl" />
          <Skeleton className="h-48 w-full rounded-xl" />
          <Skeleton className="h-24 w-full rounded-xl" />
        </div>
      </GameLayout>
    );
  }

  const discretionaryIncome = state.salary - state.monthlyExpenses;
  const creditScorePercent = ((state.creditScore - 300) / (850 - 300)) * 100;

  return (
    <GameLayout title="Life Simulator" module="simulator" backHref="/simulator">
      <div className="flex flex-col gap-6 pb-8">
        {/* Stats Dashboard */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
        >
          <Card className="border-2 border-purple-200 shadow-md">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-base text-purple-700">
                  <Calendar className="h-4 w-4" />
                  Month {state.month}
                </CardTitle>
                <Badge className="bg-purple-100 text-purple-700 font-extrabold">
                  Age {state.age}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {/* Main Stats Grid */}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <StatCard
                  icon={<DollarSign className="h-4 w-4 text-green-500" />}
                  label="Balance"
                  value={formatMoney(state.balance)}
                  color="bg-green-50"
                />
                <StatCard
                  icon={<CreditCard className="h-4 w-4 text-purple-500" />}
                  label="Credit Score"
                  value={`${state.creditScore}`}
                  subValue={getCreditScoreLabel(state.creditScore)}
                  color="bg-purple-50"
                />
                <StatCard
                  icon={<Smile className="h-4 w-4 text-yellow-500" />}
                  label="Happiness"
                  value={`${state.happiness}%`}
                  color="bg-yellow-50"
                />
                <StatCard
                  icon={<TrendingUp className="h-4 w-4 text-blue-500" />}
                  label="Investments"
                  value={formatMoney(state.investments)}
                  color="bg-blue-50"
                />
              </div>

              {/* Credit Score Bar */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-muted-foreground">Credit Score</span>
                  <span className={getCreditScoreColor(state.creditScore)}>
                    {state.creditScore} / 850
                  </span>
                </div>
                <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
                  <motion.div
                    className={`h-full rounded-full ${getCreditScoreProgressColor(state.creditScore)}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${creditScorePercent}%` }}
                    transition={{ type: "spring", stiffness: 100, damping: 20 }}
                  />
                </div>
              </div>

              {/* Happiness Bar */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-muted-foreground">Happiness</span>
                  <span className="text-yellow-500">{state.happiness} / 100</span>
                </div>
                <Progress value={state.happiness} className="h-3" />
              </div>

              {/* Debt Indicator */}
              {state.debt > 0 && (
                <motion.div
                  className="flex items-center gap-2 rounded-xl bg-red-50 p-3 text-sm font-bold text-red-600"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <Wallet className="h-4 w-4" />
                  Debt: {formatMoney(state.debt)}
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Game Phase Content */}
        <AnimatePresence mode="wait">
          {phase === "allocate" && (
            <motion.div
              key="allocate"
              className="flex flex-col gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
              {/* Income & Expenses Overview */}
              <Card className="border-2 border-purple-100">
                <CardContent className="flex flex-col gap-3 p-4">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-sm font-bold text-green-600">
                      <DollarSign className="h-4 w-4" />
                      Monthly Salary
                    </span>
                    <span className="text-sm font-extrabold tabular-nums text-green-600">
                      +{formatMoney(state.salary)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-sm font-bold text-red-500">
                      <Receipt className="h-4 w-4" />
                      Fixed Expenses
                    </span>
                    <span className="text-sm font-extrabold tabular-nums text-red-500">
                      -{formatMoney(state.monthlyExpenses)}
                    </span>
                  </div>
                  <div className="border-t border-purple-100 pt-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-extrabold text-purple-700">
                        Discretionary Income
                      </span>
                      <span className="text-lg font-extrabold tabular-nums text-purple-700">
                        {formatMoney(discretionaryIncome)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Allocation Sliders */}
              <Card className="border-2 border-purple-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base text-purple-700">
                    How will you split your money?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <AllocationSlider
                    savings={allocation.savings}
                    spending={allocation.spending}
                    investing={allocation.investing}
                    totalAmount={discretionaryIncome}
                    onChange={(newAlloc) => setAllocation(newAlloc)}
                  />
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                  size="lg"
                  className="flex-1 bg-gradient-to-r from-purple-600 to-violet-600 text-white hover:from-purple-700 hover:to-violet-700"
                  onClick={handleEndMonth}
                  disabled={allocation.savings + allocation.spending + allocation.investing !== 100}
                >
                  <ArrowRight className="h-5 w-5" />
                  End Month
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-purple-300 text-purple-700 hover:bg-purple-50"
                  onClick={handleEndSimulation}
                >
                  <LogOut className="h-5 w-5" />
                  End Simulation
                </Button>
              </div>
            </motion.div>
          )}

          {phase === "summary" && monthResult && (
            <motion.div
              key="summary"
              className="flex flex-col gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
              {/* Month Summary */}
              <MonthSummary result={monthResult} month={state.month - 1} />

              {/* Event Card (if an event occurred) */}
              {monthResult.event && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <EventCard event={monthResult.event} />
                </motion.div>
              )}

              {/* Next Month Button */}
              <Button
                size="lg"
                className="w-full bg-gradient-to-r from-purple-600 to-violet-600 text-white hover:from-purple-700 hover:to-violet-700"
                onClick={handleNextMonth}
              >
                <ArrowRight className="h-5 w-5" />
                Next Month
              </Button>
            </motion.div>
          )}

          {phase === "bankrupt" && (
            <motion.div
              key="bankrupt"
              className="flex flex-col items-center gap-6"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
              <BankruptScreen
                monthsSurvived={state.month - 1}
                finalCreditScore={state.creditScore}
                totalEvents={state.events.length}
                deathCause={
                  monthResult?.event
                    ? `The "${monthResult.event.name}" event pushed you over the edge.`
                    : "Your expenses exceeded your income and savings."
                }
                onRetry={handleRetry}
                onBackToDashboard={handleBackToDashboard}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </GameLayout>
  );
}
