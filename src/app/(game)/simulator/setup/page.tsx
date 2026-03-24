"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  DollarSign,
  PiggyBank,
  CreditCard,
  RefreshCw,
  Rocket,
  Receipt,
} from "lucide-react";
import { GameLayout } from "@/components/shared/game-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { generateInitialState } from "@/lib/game-engine/simulator";
import type { SimulatorState } from "@/types/game";

const SIM_STORAGE_KEY = "cashquest-sim-state";

interface StatRevealProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
  bgColor: string;
  delay: number;
}

function StatReveal({ icon, label, value, color, bgColor, delay }: StatRevealProps) {
  return (
    <motion.div
      className={`flex items-center gap-4 rounded-2xl border-2 border-transparent p-4 ${bgColor}`}
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        delay,
        type: "spring",
        stiffness: 200,
        damping: 18,
      }}
    >
      <motion.div
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${color} shadow-md`}
        initial={{ rotate: -20 }}
        animate={{ rotate: 0 }}
        transition={{ delay: delay + 0.1, type: "spring", stiffness: 300, damping: 15 }}
      >
        {icon}
      </motion.div>
      <div className="flex flex-col">
        <span className="text-xs font-bold text-muted-foreground">{label}</span>
        <motion.span
          className="text-xl font-extrabold tabular-nums text-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: delay + 0.15 }}
        >
          {value}
        </motion.span>
      </div>
    </motion.div>
  );
}

export default function SimulatorSetupPage() {
  const router = useRouter();
  const [seed, setSeed] = useState(() => Date.now());
  const [state, setState] = useState<SimulatorState>(() =>
    generateInitialState(seed)
  );
  const [isRerolling, setIsRerolling] = useState(false);
  const [animKey, setAnimKey] = useState(0);

  const handleReroll = useCallback(() => {
    setIsRerolling(true);
    const newSeed = Date.now();
    setSeed(newSeed);

    // Small delay for animation feel
    setTimeout(() => {
      const newState = generateInitialState(newSeed);
      setState(newState);
      setAnimKey((prev) => prev + 1);
      setIsRerolling(false);
    }, 300);
  }, []);

  const handleBegin = useCallback(() => {
    try {
      localStorage.setItem(SIM_STORAGE_KEY, JSON.stringify(state));
      router.push("/simulator/play");
    } catch {
      // If localStorage fails, still try to navigate
      router.push("/simulator/play");
    }
  }, [state, router]);

  const discretionaryIncome = state.salary - state.monthlyExpenses;

  return (
    <GameLayout title="Setup" module="simulator" backHref="/simulator">
      <div className="flex flex-col items-center gap-8 py-4">
        {/* Title */}
        <motion.div
          className="flex flex-col items-center gap-2 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
        >
          <h2 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
            Your Character
          </h2>
          <p className="max-w-sm text-sm text-muted-foreground">
            Here's the hand life dealt you. Can you make it work?
          </p>
        </motion.div>

        {/* Character Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={animKey}
            className="w-full max-w-md"
            initial={{ opacity: 0, scale: 0.95, rotateY: 10 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            exit={{ opacity: 0, scale: 0.95, rotateY: -10 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
          >
            <Card className="overflow-hidden border-2 border-purple-300 shadow-xl">
              {/* Card Header */}
              <div className="bg-gradient-to-r from-purple-600 to-violet-600 p-5 text-center text-white">
                <motion.div
                  className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.15, type: "spring", stiffness: 300, damping: 15 }}
                >
                  <User className="h-8 w-8" />
                </motion.div>
                <motion.p
                  className="text-2xl font-extrabold"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  Age {state.age}
                </motion.p>
                <motion.p
                  className="text-sm text-purple-200"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.25 }}
                >
                  Ready to take on the world!
                </motion.p>
              </div>

              {/* Stats */}
              <CardContent className="flex flex-col gap-3 p-4">
                <StatReveal
                  icon={<DollarSign className="h-6 w-6 text-white" />}
                  label="Monthly Salary"
                  value={`$${state.salary.toLocaleString()}`}
                  color="bg-green-500"
                  bgColor="bg-green-50"
                  delay={0.3}
                />
                <StatReveal
                  icon={<PiggyBank className="h-6 w-6 text-white" />}
                  label="Starting Balance"
                  value={`$${state.balance.toLocaleString()}`}
                  color="bg-blue-500"
                  bgColor="bg-blue-50"
                  delay={0.45}
                />
                <StatReveal
                  icon={<CreditCard className="h-6 w-6 text-white" />}
                  label="Starting Credit Score"
                  value={`${state.creditScore}`}
                  color="bg-purple-500"
                  bgColor="bg-purple-50"
                  delay={0.6}
                />
                <StatReveal
                  icon={<Receipt className="h-6 w-6 text-white" />}
                  label="Monthly Expenses"
                  value={`$${state.monthlyExpenses.toLocaleString()}`}
                  color="bg-orange-500"
                  bgColor="bg-orange-50"
                  delay={0.75}
                />

                {/* Discretionary Income Callout */}
                <motion.div
                  className="mt-2 rounded-xl border-2 border-dashed border-purple-300 bg-purple-50 p-4 text-center"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                >
                  <p className="text-xs font-bold text-purple-500">
                    MONEY YOU GET TO DECIDE HOW TO USE
                  </p>
                  <p className="mt-1 text-2xl font-extrabold tabular-nums text-purple-700">
                    ${discretionaryIncome.toLocaleString()}
                    <span className="text-sm font-bold text-purple-400">/month</span>
                  </p>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Action Buttons */}
        <motion.div
          className="flex w-full max-w-md flex-col gap-3 sm:flex-row"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <Button
            variant="outline"
            size="lg"
            className="flex-1 border-purple-300 text-purple-700 hover:bg-purple-50"
            onClick={handleReroll}
            disabled={isRerolling}
          >
            <RefreshCw className={`h-5 w-5 ${isRerolling ? "animate-spin" : ""}`} />
            Reroll
          </Button>
          <Button
            size="lg"
            className="flex-1 bg-gradient-to-r from-purple-600 to-violet-600 text-white hover:from-purple-700 hover:to-violet-700"
            onClick={handleBegin}
          >
            <Rocket className="h-5 w-5" />
            Begin Simulation!
          </Button>
        </motion.div>
      </div>
    </GameLayout>
  );
}
