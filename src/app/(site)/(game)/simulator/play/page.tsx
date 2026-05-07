"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
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
  Wallet,
  Receipt,
  ShieldAlert,
  Target,
  Star,
  Zap,
  AlertTriangle,
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
import { SIMULATOR_GOALS } from "@/lib/constants/scenarios";
import { SIMULATOR_TAX_RATE } from "@/lib/constants/game-balance";
import type {
  SimulatorState,
  MonthAllocation,
  MonthResult,
  ActivityEntry,
} from "@/types/game";

const SIM_STORAGE_KEY = "cashquest-sim-state";

type Phase = "allocate" | "choice" | "summary" | "warning" | "spiral" | "bankrupt" | "won";

function formatMoney(amount: number): string {
  return `$${Math.round(amount).toLocaleString()}`;
}

function getCreditScoreColor(score: number): string {
  if (score < 580) return "text-red-500";
  if (score < 670) return "text-accent";
  return "text-accent";
}

function getCreditScoreLabel(score: number): string {
  if (score < 580) return "Poor";
  if (score < 670) return "Fair";
  if (score < 740) return "Good";
  return "Excellent";
}

function getLifeStageEmoji(stage: string): string {
  const emojiMap: Record<string, string> = {
    "Just Starting Out": "\uD83C\uDF31",
    "Finding My Footing": "\uD83D\uDEB6",
    "Building Momentum": "\uD83D\uDE80",
    "Getting Established": "\uD83C\uDFD7\uFE0F",
    "Building Wealth": "\uD83D\uDCB0",
    "Financial Wizard": "\uD83E\uDDD9",
    "Surviving": "\uD83D\uDCAA",
  };
  return emojiMap[stage] ?? "\u2B50";
}

function getEmergencyFundStatus(
  fund: number,
  monthlyExpenses: number
): { label: string; color: string; bgColor: string } {
  const monthsCovered = monthlyExpenses > 0 ? fund / monthlyExpenses : 0;
  if (monthsCovered >= 3) {
    return {
      label: `${Math.floor(monthsCovered)}mo covered`,
      color: "text-accent",
      bgColor: "bg-accent-soft",
    };
  }
  if (monthsCovered >= 1) {
    return {
      label: `${Math.floor(monthsCovered)}mo covered`,
      color: "text-accent",
      bgColor: "bg-paper-2",
    };
  }
  return {
    label: "Build it up!",
    color: "text-red-600",
    bgColor: "bg-red-50",
  };
}

// Activity feed entry component
function ActivityFeedEntry({ entry }: { entry: ActivityEntry }) {
  const bgColor =
    entry.positivity === "positive"
      ? "bg-accent-soft border-accent-soft"
      : entry.positivity === "negative"
        ? "bg-red-50 border-red-200"
        : "bg-paper-2 border-paper-2";

  return (
    <div
      className={`flex items-start gap-2.5 rounded-xl border px-3 py-2 ${bgColor}`}
    >
      <span className="mt-0.5 text-base">{entry.emoji}</span>
      <div className="flex flex-col gap-0.5">
        <span className="text-[10px] font-bold text-muted-foreground">
          Month {entry.month}
        </span>
        <p className="text-xs font-semibold leading-relaxed text-foreground">
          {entry.text}
        </p>
      </div>
    </div>
  );
}

export default function SimulatorPlayPage() {
  const router = useRouter();
  const [state, setState] = useState<SimulatorState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [phase, setPhase] = useState<Phase>("allocate");
  const [monthResult, setMonthResult] = useState<MonthResult | null>(null);
  const [allocation, setAllocation] = useState({
    emergencyFund: 20,
    savings: 20,
    spending: 30,
    investing: 20,
    debtPayment: 10,
  });

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
          // Cast to Record first for migration check, then to SimulatorState
          const rawState = parsed as Record<string, unknown>;

          // Migrate old state format if needed (backward compat)
          const needsMigration = !("emergencyFund" in rawState);

          if (needsMigration) {
            const simState = parsed as SimulatorState;
            const migrated: SimulatorState = {
              ...simState,
              emergencyFund: 0,
              taxesWithheld: 0,
              netWorthHistory: [],
              activityLog: [],
              scenarioId: "surprise",
              goalId: "survive-24",
              temporaryIncomeMod: 1.0,
              temporaryIncomeDuration: 0,
              housingType: "renting",
              pendingChoiceEvent: null,
              lifeStage: "Just Starting Out",
              debtLabel: "",
              debtInterestRate: 0.005,
              startingBalance: (rawState.balance as number) ?? 0,
            };
            setState(migrated);
          } else {
            setState(parsed as SimulatorState);
          }

          // If there's a pending choice event, go to choice phase
          if (
            rawState.pendingChoiceEvent &&
            typeof rawState.pendingChoiceEvent === "object" &&
            rawState.pendingChoiceEvent !== null &&
            "choices" in rawState.pendingChoiceEvent
          ) {
            setPhase("choice");
          }
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

  // Set initial allocation based on whether debt exists
  useEffect(() => {
    if (!state) return;
    if (state.debt > 0) {
      setAllocation({
        emergencyFund: 15,
        savings: 15,
        spending: 25,
        investing: 15,
        debtPayment: 30,
      });
    } else {
      setAllocation({
        emergencyFund: 25,
        savings: 25,
        spending: 30,
        investing: 20,
        debtPayment: 0,
      });
    }
  }, [state?.debt]);

  const saveState = useCallback((newState: SimulatorState) => {
    try {
      localStorage.setItem(SIM_STORAGE_KEY, JSON.stringify(newState));
    } catch {
      // Storage full — continue anyway
    }
  }, []);

  const goal = useMemo(() => {
    if (!state) return null;
    return SIMULATOR_GOALS.find((g) => g.id === state.goalId) ?? null;
  }, [state]);

  const handleEndMonth = useCallback(() => {
    if (!state) return;

    const grossIncome = state.salary * (state.temporaryIncomeDuration > 0 ? state.temporaryIncomeMod : 1);
    const netIncome = grossIncome * (1 - SIMULATOR_TAX_RATE);
    const discretionaryIncome = Math.max(0, netIncome - state.monthlyExpenses);

    const dollarAllocation: MonthAllocation = {
      savings: Math.round((allocation.savings / 100) * discretionaryIncome),
      spending: Math.round((allocation.spending / 100) * discretionaryIncome),
      investing: Math.round(
        (allocation.investing / 100) * discretionaryIncome
      ),
      emergencyFund: Math.round(
        (allocation.emergencyFund / 100) * discretionaryIncome
      ),
      debtPayment: Math.round(
        (allocation.debtPayment / 100) * discretionaryIncome
      ),
    };

    const eventSeed = Date.now() + state.month;
    const { newState, result } = processMonth(
      state,
      dollarAllocation,
      eventSeed
    );

    setMonthResult(result);
    setState(newState);
    saveState(newState);

    // Check what phase to go to
    if (result.isBankrupt) {
      setPhase("bankrupt");
    } else if (result.pendingChoice) {
      setPhase("choice");
    } else if (result.debtSpiral) {
      setPhase("spiral");
    } else if (
      newState.balance < newState.monthlyExpenses * 0.5 &&
      newState.emergencyFund < newState.monthlyExpenses
    ) {
      // Low balance warning
      setPhase("summary"); // Show summary first, then they can see the warning
    } else {
      setPhase("summary");
    }

    // Check goal completion
    if (goal && goal.isComplete(newState)) {
      // Will show in the summary
    }
  }, [state, allocation, saveState, goal]);

  const handleChoiceSelect = useCallback(
    (choiceId: string) => {
      if (!state) return;

      const eventSeed = Date.now() + state.month;

      // Use a no-op allocation since we're just resolving the choice
      const noopAllocation: MonthAllocation = {
        savings: 0,
        spending: 0,
        investing: 0,
        emergencyFund: 0,
        debtPayment: 0,
      };

      const { newState, result } = processMonth(
        state,
        noopAllocation,
        eventSeed,
        choiceId
      );

      setMonthResult(result);
      setState(newState);
      saveState(newState);

      if (result.isBankrupt) {
        setPhase("bankrupt");
      } else {
        setPhase("summary");
      }
    },
    [state, saveState]
  );

  const handleNextMonth = useCallback(() => {
    setPhase("allocate");
    setMonthResult(null);
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

  const handleContinueFromWarning = useCallback(() => {
    setPhase("allocate");
  }, []);

  if (isLoading || !state) {
    return (
      <GameLayout
        title="Life Simulator"
        module="simulator"
        backHref="/simulator"
      >
        <div className="flex flex-col gap-4 py-8">
          <Skeleton className="h-20 w-full rounded-xl" />
          <Skeleton className="h-32 w-full rounded-xl" />
          <Skeleton className="h-48 w-full rounded-xl" />
          <Skeleton className="h-24 w-full rounded-xl" />
        </div>
      </GameLayout>
    );
  }

  // Calculate derived values
  const effectiveSalary =
    state.temporaryIncomeDuration > 0
      ? Math.round(state.salary * state.temporaryIncomeMod)
      : state.salary;
  const taxesThisMonth = Math.round(effectiveSalary * SIMULATOR_TAX_RATE);
  const netIncome = effectiveSalary - taxesThisMonth;
  const discretionaryIncome = Math.max(0, netIncome - state.monthlyExpenses);
  const debtInterest =
    state.debt > 0
      ? Math.round(state.debt * state.debtInterestRate * 100) / 100
      : 0;
  const creditScorePercent = ((state.creditScore - 300) / (850 - 300)) * 100;
  const netWorth =
    state.balance + state.emergencyFund + state.investments - state.debt;

  const efStatus = getEmergencyFundStatus(
    state.emergencyFund,
    state.monthlyExpenses
  );

  const goalProgress = goal ? goal.progressValue(state) : 0;
  const goalComplete = goal ? goal.isComplete(state) : false;

  // Get total for allocation validation
  const allocationTotal =
    allocation.emergencyFund +
    allocation.savings +
    allocation.spending +
    allocation.investing +
    allocation.debtPayment;

  return (
    <GameLayout
      title="Life Simulator"
      module="simulator"
      backHref="/simulator"
    >
      <div className="flex flex-col gap-5 pb-8">
        {/* Life Stage Banner */}
        <motion.div
          className="flex items-center justify-between rounded-2xl bg-paper-2 from-ink to-ink px-5 py-4 text-white shadow-lg"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
        >
          <div className="flex items-center gap-3">
            <span className="text-3xl">
              {getLifeStageEmoji(state.lifeStage)}
            </span>
            <div className="flex flex-col">
              <span className="text-lg font-extrabold tracking-tight">
                {state.lifeStage}
              </span>
              <span className="text-xs font-bold text-muted">
                Month {state.month} &bull; Age {state.age}
              </span>
            </div>
          </div>
          {state.temporaryIncomeDuration > 0 && (
            <Badge className="bg-red-500/80 text-xs font-bold text-white">
              Reduced Income ({state.temporaryIncomeDuration}mo left)
            </Badge>
          )}
        </motion.div>

        {/* Stats Row - BitLife style */}
        {(() => {
          const monthlyNetFlow = Math.round(netIncome - state.monthlyExpenses - debtInterest);
          const isPositiveFlow = monthlyNetFlow >= 0;
          return (
            <motion.div
              className="grid grid-cols-2 gap-3 sm:grid-cols-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              {/* Balance */}
              <div className="flex flex-col items-center gap-1 rounded-xl bg-accent-soft p-3">
                <DollarSign className="h-4 w-4 text-accent" />
                <span className="text-lg font-extrabold tabular-nums text-foreground">
                  {formatMoney(state.balance)}
                </span>
                <span className="text-[10px] font-bold text-muted-foreground">
                  Balance
                </span>
              </div>

              {/* Emergency Fund */}
              <div
                className={`flex flex-col items-center gap-1 rounded-xl p-3 ${efStatus.bgColor}`}
              >
                <ShieldAlert className={`h-4 w-4 ${efStatus.color}`} />
                <span className="text-lg font-extrabold tabular-nums text-foreground">
                  {formatMoney(state.emergencyFund)}
                </span>
                <span className={`text-[10px] font-bold ${efStatus.color}`}>
                  {efStatus.label}
                </span>
              </div>

              {/* Credit Score */}
              <div className="flex flex-col items-center gap-1 rounded-xl bg-paper-2 p-3">
                <CreditCard className="h-4 w-4 text-ink" />
                <span
                  className={`text-lg font-extrabold tabular-nums ${getCreditScoreColor(state.creditScore)}`}
                >
                  {state.creditScore}
                </span>
                <span className="text-[10px] font-bold text-muted-foreground">
                  {getCreditScoreLabel(state.creditScore)}
                </span>
              </div>

              {/* Happiness */}
              <div className="flex flex-col items-center gap-1 rounded-xl bg-paper-2 p-3">
                <Smile className="h-4 w-4 text-accent" />
                <span className="text-lg font-extrabold tabular-nums text-foreground">
                  {state.happiness}%
                </span>
                <span className="text-[10px] font-bold text-muted-foreground">
                  Happiness
                </span>
              </div>

              {/* Monthly Net Flow — spans full width on mobile */}
              <div className={`col-span-2 sm:col-span-2 flex flex-col items-center gap-1 rounded-xl p-3 ${isPositiveFlow ? "bg-paper-2" : "bg-paper-2"}`}>
                <TrendingUp className={`h-4 w-4 ${isPositiveFlow ? "text-ink" : "text-accent"}`} />
                <span className={`text-lg font-extrabold tabular-nums ${isPositiveFlow ? "text-ink" : "text-accent"}`}>
                  {isPositiveFlow ? "+" : ""}{formatMoney(monthlyNetFlow)}
                </span>
                <span className="text-[10px] font-bold text-muted-foreground">
                  Monthly Net Flow
                </span>
              </div>
            </motion.div>
          );
        })()}

        {/* Credit Score & Happiness bars */}
        <motion.div
          className="flex flex-col gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
        >
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-muted-foreground">Credit Score</span>
              <span className={getCreditScoreColor(state.creditScore)}>
                {state.creditScore} / 850
              </span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
              <motion.div
                className={`h-full rounded-full ${
                  state.creditScore < 580
                    ? "bg-red-500"
                    : state.creditScore < 670
                      ? "bg-accent"
                      : "bg-accent"
                }`}
                initial={{ width: 0 }}
                animate={{ width: `${creditScorePercent}%` }}
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
              />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-muted-foreground">Happiness</span>
              <span className="text-accent">{state.happiness} / 100</span>
            </div>
            <Progress value={state.happiness} className="h-2.5" />
          </div>
        </motion.div>

        {/* Debt Indicator */}
        {state.debt > 0 && (
          <motion.div
            className="flex items-center justify-between rounded-xl bg-red-50 p-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <span className="flex items-center gap-2 text-sm font-bold text-red-600">
              <Wallet className="h-4 w-4" />
              {state.debtLabel || "Debt"}: {formatMoney(state.debt)}
            </span>
            <span className="text-xs font-bold text-red-400">
              {Math.round(state.debtInterestRate * 12 * 100)}% APR
            </span>
          </motion.div>
        )}

        {/* Goal Progress */}
        {goal && (
          <motion.div
            className="flex flex-col gap-2 rounded-xl border-2 border-paper-2 bg-paper-2 p-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-xs font-extrabold text-ink">
                <Target className="h-3.5 w-3.5" />
                {goal.label}
              </span>
              {goalComplete ? (
                <Badge className="bg-accent text-white text-xs">
                  COMPLETE!
                </Badge>
              ) : (
                <span className="text-xs font-extrabold tabular-nums text-ink">
                  {goalProgress}%
                </span>
              )}
            </div>
            <Progress
              value={goalProgress}
              className={`h-2 ${goalComplete ? "[&>div]:bg-accent" : "[&>div]:bg-ink"}`}
            />
          </motion.div>
        )}

        {/* Game Phase Content */}
        <AnimatePresence mode="wait">
          {phase === "allocate" && (
            <motion.div
              key="allocate"
              className="flex flex-col gap-5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
              {/* Income Breakdown */}
              <Card className="border-2 border-paper-2">
                <CardContent className="flex flex-col gap-2.5 p-4">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-sm font-bold text-accent">
                      <DollarSign className="h-4 w-4" />
                      Gross Salary
                    </span>
                    <span className="text-sm font-extrabold tabular-nums text-accent">
                      +{formatMoney(effectiveSalary)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-sm font-bold text-red-500">
                      <Receipt className="h-4 w-4" />
                      Taxes Withheld (22%)
                    </span>
                    <span className="text-sm font-extrabold tabular-nums text-red-500">
                      -{formatMoney(taxesThisMonth)}
                    </span>
                  </div>
                  <div className="border-t border-muted pt-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-foreground">
                        Net Income
                      </span>
                      <span className="text-sm font-extrabold tabular-nums text-foreground">
                        {formatMoney(netIncome)}
                      </span>
                    </div>
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
                  {debtInterest > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2 text-sm font-bold text-accent">
                        <AlertTriangle className="h-4 w-4" />
                        Debt Interest
                      </span>
                      <span className="text-sm font-extrabold tabular-nums text-accent">
                        -{formatMoney(debtInterest)}
                      </span>
                    </div>
                  )}
                  <div className="border-t border-paper-2 pt-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-extrabold text-ink">
                        Discretionary Income
                      </span>
                      <span className="text-lg font-extrabold tabular-nums text-ink">
                        {formatMoney(discretionaryIncome)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Allocation Sliders */}
              <Card className="border-2 border-paper-2">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base text-ink">
                    How will you split your money?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <AllocationSlider
                    emergencyFund={allocation.emergencyFund}
                    savings={allocation.savings}
                    spending={allocation.spending}
                    investing={allocation.investing}
                    debtPayment={allocation.debtPayment}
                    showDebtPayment={state.debt > 0}
                    totalAmount={discretionaryIncome}
                    onChange={(newAlloc) => setAllocation(newAlloc)}
                  />
                </CardContent>
              </Card>

              {/* Next Month Button - BitLife style */}
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                  size="lg"
                  className="flex-1 bg-paper-2 from-ink to-ink py-6 text-lg font-extrabold text-white hover:from-ink hover:to-ink"
                  onClick={handleEndMonth}
                  disabled={allocationTotal !== 100}
                >
                  <ArrowRight className="h-6 w-6" />
                  Next Month &rarr;
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-paper-2 text-ink hover:bg-paper-2"
                  onClick={handleEndSimulation}
                >
                  <LogOut className="h-5 w-5" />
                  End
                </Button>
              </div>
            </motion.div>
          )}

          {phase === "choice" && state.pendingChoiceEvent && (
            <motion.div
              key="choice"
              className="flex flex-col gap-6"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
              <EventCard
                event={state.pendingChoiceEvent}
                onChoiceSelect={handleChoiceSelect}
                isModal
              />
            </motion.div>
          )}

          {phase === "summary" && monthResult && (
            <motion.div
              key="summary"
              className="flex flex-col gap-5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
              {/* Goal completion banner */}
              {goalComplete && goal && (
                <motion.div
                  className="flex flex-col items-center gap-2 rounded-2xl border-2 border-accent bg-accent-soft p-5 text-center"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                >
                  <span className="text-4xl">
                    {"\uD83C\uDF89"}
                  </span>
                  <h3 className="text-xl font-extrabold text-accent">
                    GOAL ACHIEVED!
                  </h3>
                  <p className="text-sm font-bold text-accent">
                    {goal.label}
                  </p>
                </motion.div>
              )}

              <MonthSummary
                result={monthResult}
                month={state.month - 1}
                emergencyFundBalance={state.emergencyFund}
              />

              {/* Auto-apply event card */}
              {monthResult.event &&
                !monthResult.pendingChoice &&
                !monthResult.event.choices && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <EventCard event={monthResult.event} />
                  </motion.div>
                )}

              {/* Net worth */}
              <div className="flex items-center justify-between rounded-xl bg-muted p-3">
                <span className="flex items-center gap-2 text-sm font-bold text-foreground">
                  <TrendingUp className="h-4 w-4 text-ink" />
                  Net Worth
                </span>
                <span
                  className={`text-lg font-extrabold tabular-nums ${netWorth >= 0 ? "text-accent" : "text-red-600"}`}
                >
                  {formatMoney(netWorth)}
                </span>
              </div>

              {/* Next Month button */}
              <Button
                size="lg"
                className="w-full bg-paper-2 from-ink to-ink py-6 text-lg font-extrabold text-white hover:from-ink hover:to-ink"
                onClick={handleNextMonth}
              >
                <ArrowRight className="h-6 w-6" />
                Next Month &rarr;
              </Button>
            </motion.div>
          )}

          {(phase === "warning" || phase === "spiral") && (
            <motion.div
              key="warning-spiral"
              className="flex flex-col items-center gap-6"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
              <BankruptScreen
                phase={phase}
                monthsSurvived={state.month - 1}
                finalCreditScore={state.creditScore}
                totalEvents={state.events.length}
                debt={state.debt}
                onRetry={handleRetry}
                onBackToDashboard={handleBackToDashboard}
                onContinue={handleContinueFromWarning}
              />
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
                phase="bankrupt"
                monthsSurvived={state.month - 1}
                finalCreditScore={state.creditScore}
                totalEvents={state.events.length}
                debt={state.debt}
                deathCause={
                  monthResult?.event
                    ? `The "${monthResult.event.name}" event pushed you over the edge.`
                    : "Your debt exceeded 3x your monthly salary."
                }
                onRetry={handleRetry}
                onBackToDashboard={handleBackToDashboard}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Activity Feed - always visible below */}
        {state.activityLog.length > 1 && phase === "allocate" && (
          <motion.div
            className="flex flex-col gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="flex items-center gap-2 text-sm font-extrabold text-muted-foreground">
              <Zap className="h-4 w-4" />
              Activity Feed
            </h3>
            <div className="flex max-h-64 flex-col gap-2 overflow-y-auto rounded-xl border border-border bg-card p-3">
              {[...state.activityLog]
                .reverse()
                .slice(0, 20)
                .map((entry, i) => (
                  <ActivityFeedEntry key={`${entry.month}-${i}`} entry={entry} />
                ))}
            </div>
          </motion.div>
        )}
      </div>
    </GameLayout>
  );
}
