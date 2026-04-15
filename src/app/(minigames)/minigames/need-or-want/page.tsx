"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GameLayout } from "@/components/shared/game-layout";
import { Button } from "@/components/ui/button";
import { useLocalProgress } from "@/hooks/use-local-progress";
import { cn } from "@/lib/utils";
import type { GameId } from "@/types/game";

const ITEMS = [
  { label: "Groceries", isNeed: true, emoji: "🛒" },
  { label: "Rent / Housing", isNeed: true, emoji: "🏠" },
  { label: "Electricity Bill", isNeed: true, emoji: "💡" },
  { label: "Health Insurance", isNeed: true, emoji: "🏥" },
  { label: "Public Transit", isNeed: true, emoji: "🚌" },
  { label: "Basic Clothing", isNeed: true, emoji: "👕" },
  { label: "Prescription Medicine", isNeed: true, emoji: "💊" },
  { label: "Internet (for work)", isNeed: true, emoji: "🌐" },
  { label: "Emergency Car Repair", isNeed: true, emoji: "🔧" },
  { label: "Netflix Subscription", isNeed: false, emoji: "📺" },
  { label: "New AirPods", isNeed: false, emoji: "🎧" },
  { label: "Brand-Name Sneakers", isNeed: false, emoji: "👟" },
  { label: "Gaming Console", isNeed: false, emoji: "🎮" },
  { label: "Coffee Shop Latte", isNeed: false, emoji: "☕" },
  { label: "Gym Membership", isNeed: false, emoji: "💪" },
  { label: "New Phone Upgrade", isNeed: false, emoji: "📱" },
  { label: "Restaurant Dinner", isNeed: false, emoji: "🍽️" },
  { label: "Concert Tickets", isNeed: false, emoji: "🎵" },
  { label: "Designer Bag", isNeed: false, emoji: "👜" },
  { label: "Movie Streaming (2nd service)", isNeed: false, emoji: "🎬" },
];

export default function NeedOrWantPage() {
  const { addArcadeScore } = useLocalProgress();

  const [phase, setPhase] = useState<"playing" | "ended">("playing");
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(1);
  const [maxCombo, setMaxCombo] = useState(1);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);

  const shuffled = useMemo(
    () => [...ITEMS].sort(() => Math.random() - 0.5),
    []
  );

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
      addArcadeScore("need-or-want" as GameId, score, maxCombo);
    }
  }, [phase, score, maxCombo, addArcadeScore]);

  const handleAnswer = useCallback(
    (playerSaysNeed: boolean) => {
      if (phase !== "playing") return;
      const item = shuffled[currentIndex % shuffled.length];
      const isCorrect = playerSaysNeed === item.isNeed;

      const newCombo = isCorrect ? combo + 1 : 1;
      const multiplier = isCorrect ? Math.min(combo, 5) : 1;
      const points = isCorrect ? 10 * multiplier : 0;

      setFeedback(isCorrect ? "correct" : "wrong");
      setScore((s) => s + points);
      setCombo(newCombo);
      setMaxCombo((m) => Math.max(m, newCombo));
      setCorrect((c) => c + (isCorrect ? 1 : 0));
      setTotal((t) => t + 1);
      setCurrentIndex((i) => i + 1);

      setTimeout(() => setFeedback(null), 400);
    },
    [phase, shuffled, currentIndex, combo]
  );

  const handlePlayAgain = useCallback(() => {
    setPhase("playing");
    setScore(0);
    setCombo(1);
    setMaxCombo(1);
    setCurrentIndex(0);
    setTimeLeft(60);
    setCorrect(0);
    setTotal(0);
    setFeedback(null);
  }, []);

  const currentItem = shuffled[currentIndex % shuffled.length];

  return (
    <GameLayout
      title="Need or Want?"
      module="arcade"
      backHref="/minigames"
      headerRight={
        phase === "playing" ? (
          <div className="flex items-center gap-3 text-white">
            <span
              className={cn(
                "text-xl font-extrabold tabular-nums",
                timeLeft < 10 && "animate-pulse text-red-300"
              )}
            >
              {timeLeft}s
            </span>
            <span className="text-sm font-bold">Score: {score}</span>
            {combo > 1 && (
              <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs font-extrabold">
                x{combo - 1} COMBO!
              </span>
            )}
          </div>
        ) : undefined
      }
    >
      <div className="flex flex-col items-center gap-6 py-4">
        <AnimatePresence mode="wait">
          {phase === "playing" && (
            <motion.div
              key="playing"
              className="flex w-full max-w-sm flex-col items-center gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Item card */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  className={cn(
                    "flex w-full flex-col items-center gap-4 rounded-3xl border-4 p-8 shadow-lg transition-colors",
                    feedback === "correct"
                      ? "border-emerald-400 bg-emerald-50"
                      : feedback === "wrong"
                        ? "border-red-400 bg-red-50"
                        : "border-border bg-card"
                  )}
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -30, scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                >
                  <span className="text-6xl">{currentItem.emoji}</span>
                  <span className="text-center text-xl font-extrabold text-foreground">
                    {currentItem.label}
                  </span>
                  <span className="text-sm font-semibold text-muted-foreground">
                    Is this a NEED or a WANT?
                  </span>
                </motion.div>
              </AnimatePresence>

              {/* Buttons */}
              <div className="flex w-full gap-4">
                <Button
                  className="flex-1 min-h-[64px] rounded-2xl bg-emerald-500 text-lg font-extrabold text-white hover:bg-emerald-600"
                  onClick={() => handleAnswer(true)}
                >
                  ✅ NEED
                </Button>
                <Button
                  className="flex-1 min-h-[64px] rounded-2xl bg-rose-500 text-lg font-extrabold text-white hover:bg-rose-600"
                  onClick={() => handleAnswer(false)}
                >
                  ❌ WANT
                </Button>
              </div>

              {/* CEE tag */}
              <p className="text-[10px] font-mono text-muted-foreground/60">
                📚 CEE.PF.2 — Buying Goods and Services
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
              <span className="text-6xl">🏆</span>
              <div className="flex flex-col gap-1">
                <h2 className="text-4xl font-extrabold text-foreground">
                  {score}
                </h2>
                <p className="text-sm font-bold text-muted-foreground">
                  Final Score
                </p>
              </div>

              <div className="w-full rounded-2xl border-2 border-border bg-card p-5">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-xl font-extrabold text-emerald-600">
                      {correct}
                    </p>
                    <p className="text-xs font-bold text-muted-foreground">
                      Correct
                    </p>
                  </div>
                  <div>
                    <p className="text-xl font-extrabold text-foreground">
                      {total}
                    </p>
                    <p className="text-xs font-bold text-muted-foreground">
                      Total
                    </p>
                  </div>
                  <div>
                    <p className="text-xl font-extrabold text-amber-600">
                      x{maxCombo - 1}
                    </p>
                    <p className="text-xs font-bold text-muted-foreground">
                      Best Combo
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-sm leading-relaxed text-muted-foreground">
                Knowing the difference between needs and wants is the first step
                to building a budget that works!
              </p>

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
