"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GameLayout } from "@/components/shared/game-layout";
import { Button } from "@/components/ui/button";
import { useLocalProgress } from "@/hooks/use-local-progress";
import { cn } from "@/lib/utils";
import type { GameId } from "@/types/game";

interface Bucket {
  key: "rent" | "food" | "fun" | "savings";
  label: string;
  emoji: string;
  target: number; // target percentage
  color: string;
  bgColor: string;
}

const BUCKETS: Bucket[] = [
  { key: "rent", label: "Rent & Bills", emoji: "🏠", target: 40, color: "text-rose-600", bgColor: "bg-rose-50" },
  { key: "food", label: "Food & Groceries", emoji: "🥗", target: 20, color: "text-accent", bgColor: "bg-paper-2" },
  { key: "fun", label: "Fun & Entertainment", emoji: "🎉", target: 10, color: "text-ink", bgColor: "bg-paper-2" },
  { key: "savings", label: "Savings", emoji: "🐷", target: 30, color: "text-accent", bgColor: "bg-accent-soft" },
];

type Allocation = Record<Bucket["key"], number>;

function generateSalary() {
  const options = [2500, 3000, 3500, 4000, 4500, 5000];
  return options[Math.floor(Math.random() * options.length)];
}

function calcScore(alloc: Allocation): number {
  let total = 0;
  for (const bucket of BUCKETS) {
    const diff = Math.abs(alloc[bucket.key] - bucket.target);
    const points = Math.max(0, 25 - diff * 2);
    total += points;
  }
  return Math.round(total);
}

function getGrade(alloc: Allocation): "Perfect" | "Great" | "Fair" | "Off" {
  const score = calcScore(alloc);
  if (score >= 90) return "Perfect";
  if (score >= 70) return "Great";
  if (score >= 50) return "Fair";
  return "Off";
}

export default function BudgetBlitzV2Page() {
  const { addArcadeScore } = useLocalProgress();

  const salary = useMemo(() => generateSalary(), []);
  const [phase, setPhase] = useState<"playing" | "ended">("playing");
  const [timeLeft, setTimeLeft] = useState(90);
  const [alloc, setAlloc] = useState<Allocation>({ rent: 25, food: 25, fun: 25, savings: 25 });
  const [score, setScore] = useState(0);

  const total = alloc.rent + alloc.food + alloc.fun + alloc.savings;
  const isValid = total === 100;

  useEffect(() => {
    if (phase !== "playing") return;
    const interval = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(interval);
          setPhase("ended");
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [phase]);

  useEffect(() => {
    if (phase === "ended") {
      addArcadeScore("budget-blitz-v2" as GameId, score, 1);
    }
  }, [phase, score, addArcadeScore]);

  const handleSliderChange = useCallback(
    (key: Bucket["key"], value: number) => {
      const clamped = Math.max(0, Math.min(100, value));
      const delta = clamped - alloc[key];
      const others = (["rent", "food", "fun", "savings"] as const).filter(
        (k) => k !== key
      );
      const otherTotal = others.reduce((s, k) => s + alloc[k], 0);

      const newAlloc = { ...alloc, [key]: clamped };
      if (otherTotal > 0) {
        for (const k of others) {
          newAlloc[k] = Math.max(0, Math.round(alloc[k] - (delta * alloc[k]) / otherTotal));
        }
      }
      // Fix rounding
      const newTotal = Object.values(newAlloc).reduce((s, v) => s + v, 0);
      if (newTotal !== 100) {
        const lastKey = others[others.length - 1];
        newAlloc[lastKey] = Math.max(0, newAlloc[lastKey] + (100 - newTotal));
      }
      setAlloc(newAlloc);
    },
    [alloc]
  );

  const handleSubmit = useCallback(() => {
    if (!isValid) return;
    const finalScore = calcScore(alloc);
    setScore(finalScore);
    setPhase("ended");
  }, [isValid, alloc]);

  const handlePlayAgain = useCallback(() => {
    setPhase("playing");
    setTimeLeft(90);
    setAlloc({ rent: 25, food: 25, fun: 25, savings: 25 });
    setScore(0);
  }, []);

  return (
    <GameLayout
      title="Budget Blitz"
      module="arcade"
      backHref="/minigames"
      headerRight={
        phase === "playing" ? (
          <div className="flex items-center gap-3 text-white">
            <span className={cn("text-xl font-extrabold tabular-nums", timeLeft < 20 && "animate-pulse text-red-300")}>
              {timeLeft}s
            </span>
            <span className="text-sm font-bold">${salary.toLocaleString()}/mo</span>
          </div>
        ) : undefined
      }
    >
      <div className="flex flex-col items-center gap-6 py-4">
        <AnimatePresence mode="wait">
          {phase === "playing" && (
            <motion.div
              key="playing"
              className="flex w-full max-w-md flex-col gap-5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="rounded-2xl border-2 border-border bg-card p-4">
                <p className="mb-1 text-xs font-bold text-muted-foreground">Monthly Take-Home</p>
                <p className="text-3xl font-extrabold text-accent">
                  ${salary.toLocaleString()}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Split across 4 buckets. Target: Rent 40%, Food 20%, Fun 10%, Savings 30%
                </p>
              </div>

              {/* Stacked bar */}
              <div className="flex h-4 w-full overflow-hidden rounded-full bg-muted">
                {BUCKETS.map((b) => (
                  <motion.div
                    key={b.key}
                    className={b.bgColor.replace("bg-", "bg-").replace("50", "400")}
                    style={{ width: `${alloc[b.key]}%` }}
                    layout
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  />
                ))}
              </div>

              {/* Sliders */}
              {BUCKETS.map((bucket) => {
                const diff = alloc[bucket.key] - bucket.target;
                const statusColor =
                  Math.abs(diff) <= 5
                    ? "text-accent"
                    : Math.abs(diff) <= 10
                      ? "text-accent"
                      : "text-red-600";

                return (
                  <div key={bucket.key} className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className={cn("flex items-center gap-2 text-sm font-bold", bucket.color)}>
                        {bucket.emoji} {bucket.label}
                        <span className="text-[10px] font-semibold text-muted-foreground">
                          (target {bucket.target}%)
                        </span>
                      </span>
                      <div className="flex items-center gap-2">
                        <span className={cn("text-sm font-extrabold tabular-nums", statusColor)}>
                          {alloc[bucket.key]}%
                        </span>
                        <span className="text-xs text-muted-foreground">
                          ${Math.round((alloc[bucket.key] / 100) * salary).toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      step={1}
                      value={alloc[bucket.key]}
                      onChange={(e) => handleSliderChange(bucket.key, Number(e.target.value))}
                      className="h-8 w-full cursor-pointer accent-current"
                    />
                  </div>
                );
              })}

              {!isValid && (
                <p className="text-center text-xs font-bold text-destructive">
                  Allocations must add up to 100% (currently {total}%)
                </p>
              )}

              <Button
                className="min-h-[56px] w-full rounded-2xl bg-primary text-lg font-extrabold text-white disabled:opacity-50"
                disabled={!isValid}
                onClick={handleSubmit}
              >
                Submit Budget ✓
              </Button>

              <p className="text-center text-[10px] font-mono text-muted-foreground/60">
                📚 CEE.PF.2 — Applying a Budget
              </p>
            </motion.div>
          )}

          {phase === "ended" && (
            <motion.div
              key="ended"
              className="flex w-full max-w-sm flex-col items-center gap-6 text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
              <span className="text-6xl">
                {score >= 90 ? "🏆" : score >= 70 ? "🌟" : score >= 50 ? "👍" : "📚"}
              </span>
              <div>
                <h2 className="text-4xl font-extrabold">{score}/100</h2>
                <p className="font-bold text-muted-foreground">{getGrade(alloc)}</p>
              </div>

              <div className="w-full rounded-2xl border-2 border-border bg-card p-4">
                {BUCKETS.map((bucket) => {
                  const diff = alloc[bucket.key] - bucket.target;
                  const isGood = Math.abs(diff) <= 5;
                  return (
                    <div key={bucket.key} className="flex items-center justify-between py-1.5 text-sm">
                      <span className="font-bold">{bucket.emoji} {bucket.label}</span>
                      <span className={cn("font-extrabold", isGood ? "text-accent" : "text-red-600")}>
                        {alloc[bucket.key]}% {isGood ? "✓" : `(target ${bucket.target}%)`}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="flex w-full flex-col gap-3">
                <Button
                  className="min-h-[48px] w-full rounded-xl bg-primary font-extrabold text-white"
                  onClick={handlePlayAgain}
                >
                  🔄 Play Again
                </Button>
                <Button
                  variant="outline"
                  className="min-h-[48px] w-full rounded-xl font-extrabold"
                  onClick={() => window.location.href = "/minigames"}
                >
                  ← Back to Arcade
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </GameLayout>
  );
}
