"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  DollarSign,
  PiggyBank,
  CreditCard,
  Receipt,
  Rocket,
  Target,
  Briefcase,
} from "lucide-react";
import { GameLayout } from "@/components/shared/game-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { generateInitialState } from "@/lib/game-engine/simulator";
import { SCENARIOS, SIMULATOR_GOALS } from "@/lib/constants/scenarios";
import type { LifeScenario, ScenarioId } from "@/types/game";

const SIM_STORAGE_KEY = "cashquest-sim-state";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariant = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring" as const, stiffness: 200, damping: 18 },
  },
};

function formatMoney(amount: number): string {
  return `$${amount.toLocaleString()}`;
}

interface ScenarioCardProps {
  scenario: LifeScenario;
  isSelected: boolean;
  onSelect: () => void;
}

function ScenarioCard({ scenario, isSelected, onSelect }: ScenarioCardProps) {
  const goal = SIMULATOR_GOALS.find((g) => g.id === scenario.goalId);
  const isSurprise = scenario.id === "surprise";

  return (
    <motion.div variants={cardVariant}>
      <Card
        className={`cursor-pointer border-2 transition-all ${
          isSelected
            ? "border-accent shadow-lg  ring-2 ring-accent-soft"
            : "border-border hover:border-accent-soft hover:shadow-md"
        }`}
        onClick={onSelect}
        role="radio"
        aria-checked={isSelected}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onSelect();
          }
        }}
      >
        <CardContent className="flex flex-col gap-3 p-5">
          {/* Emoji + Title */}
          <div className="flex items-center gap-3">
            <motion.span
              className="text-4xl"
              animate={
                isSurprise && isSelected
                  ? { rotate: [0, 10, -10, 10, 0] }
                  : {}
              }
              transition={{ duration: 0.5, repeat: isSurprise && isSelected ? Infinity : 0, repeatDelay: 1 }}
            >
              {scenario.emoji}
            </motion.span>
            <div className="flex flex-col">
              <span className="text-lg font-extrabold text-foreground">
                {scenario.label}
              </span>
              <span className="text-xs font-semibold text-muted-foreground">
                {scenario.description}
              </span>
            </div>
          </div>

          {/* Key stats (hidden for surprise until selected) */}
          {!isSurprise && (
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center gap-2 rounded-lg bg-muted px-2.5 py-1.5">
                <Briefcase className="h-3.5 w-3.5 text-accent" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-muted-foreground">
                    Age
                  </span>
                  <span className="text-sm font-extrabold tabular-nums text-foreground">
                    {scenario.age}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-muted px-2.5 py-1.5">
                <DollarSign className="h-3.5 w-3.5 text-accent" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-muted-foreground">
                    Salary
                  </span>
                  <span className="text-sm font-extrabold tabular-nums text-foreground">
                    {formatMoney(scenario.salary)}/mo
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-muted px-2.5 py-1.5">
                <PiggyBank className="h-3.5 w-3.5 text-ink" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-muted-foreground">
                    Savings
                  </span>
                  <span className="text-sm font-extrabold tabular-nums text-foreground">
                    {formatMoney(scenario.startingBalance)}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-muted px-2.5 py-1.5">
                <CreditCard className="h-3.5 w-3.5 text-red-500" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-muted-foreground">
                    {scenario.debtLabel}
                  </span>
                  <span className="text-sm font-extrabold tabular-nums text-foreground">
                    {formatMoney(scenario.startingDebt)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {isSurprise && (
            <div className="flex items-center justify-center rounded-xl border-2 border-dashed border-accent-soft bg-accent-soft p-4">
              <p className="text-center text-sm font-bold text-accent">
                Random age, salary, debt, and life situation!
              </p>
            </div>
          )}

          {/* Goal badge */}
          {goal && (
            <div className="flex items-center gap-2">
              <Target className="h-3.5 w-3.5 text-accent" />
              <span className="text-xs font-bold text-accent">
                Goal: {goal.label}
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function SimulatorSetupPage() {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState<ScenarioId | null>(null);
  const [seed] = useState(() => Date.now());

  const handleBegin = useCallback(() => {
    if (!selectedId) return;

    const scenario = SCENARIOS.find((s) => s.id === selectedId);
    if (!scenario) return;

    const state = generateInitialState(scenario, seed);

    try {
      localStorage.setItem(SIM_STORAGE_KEY, JSON.stringify(state));
      sessionStorage.setItem(
        "cashquest-sim-seed",
        JSON.stringify({ seed, scenarioId: selectedId })
      );
      router.push("/simulator/play");
    } catch {
      // If storage fails, still try to navigate
      router.push("/simulator/play");
    }
  }, [selectedId, seed, router]);

  return (
    <GameLayout title="Life Simulator" module="simulator" backHref="/simulator">
      <div className="flex flex-col items-center gap-8 py-4">
        {/* Title */}
        <motion.div
          className="flex flex-col items-center gap-2 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
        >
          <h2 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
            Choose Your Life
          </h2>
          <p className="max-w-sm text-sm text-muted-foreground">
            Pick a starting scenario. Each one teaches different financial skills!
          </p>
        </motion.div>

        {/* Scenario Cards Grid */}
        <motion.div
          className="grid w-full max-w-2xl grid-cols-1 gap-4 sm:grid-cols-2"
          variants={container}
          initial="hidden"
          animate="show"
          role="radiogroup"
          aria-label="Choose a life scenario"
        >
          {SCENARIOS.map((scenario) => (
            <ScenarioCard
              key={scenario.id}
              scenario={scenario}
              isSelected={selectedId === scenario.id}
              onSelect={() => setSelectedId(scenario.id)}
            />
          ))}
        </motion.div>

        {/* Start Button */}
        <motion.div
          className="w-full max-w-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Button
            size="lg"
            className="w-full bg-paper-2 from-accent to-accent text-white hover:from-accent hover:to-ink disabled:opacity-50"
            onClick={handleBegin}
            disabled={!selectedId}
          >
            <Rocket className="h-5 w-5" />
            {selectedId
              ? `Start as ${SCENARIOS.find((s) => s.id === selectedId)?.label ?? "..."}`
              : "Select a Scenario to Begin"}
          </Button>
        </motion.div>
      </div>
    </GameLayout>
  );
}
