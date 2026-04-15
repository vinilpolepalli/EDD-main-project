"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GameLayout } from "@/components/shared/game-layout";
import { Button } from "@/components/ui/button";
import { useLocalProgress } from "@/hooks/use-local-progress";
import { cn } from "@/lib/utils";
import type { GameId } from "@/types/game";

const ACTIONS = [
  { label: "Paid credit card bill on time", effect: "raises" as const, points: 15, explanation: "Payment history is 35% of your FICO score — the biggest factor." },
  { label: "Missed a credit card payment", effect: "lowers" as const, points: -40, explanation: "Late payments stay on your credit report for 7 years." },
  { label: "Opened 3 new credit cards at once", effect: "lowers" as const, points: -25, explanation: "Multiple hard inquiries and new accounts lower your average account age." },
  { label: "Paid off a loan in full", effect: "raises" as const, points: 20, explanation: "Reducing debt improves your credit utilization ratio." },
  { label: "Maxed out your credit card", effect: "lowers" as const, points: -35, explanation: "Using >30% of your credit limit hurts your utilization ratio." },
  { label: "Kept credit utilization below 10%", effect: "raises" as const, points: 18, explanation: "Low utilization signals to lenders that you manage credit responsibly." },
  { label: "Closed your oldest credit card", effect: "lowers" as const, points: -20, explanation: "Closing old accounts shortens your credit history length." },
  { label: "Had a credit card for 5+ years", effect: "raises" as const, points: 10, explanation: "Length of credit history counts for 15% of your score." },
  { label: "Had a debt sent to collections", effect: "lowers" as const, points: -50, explanation: "Collections are severe derogatory marks that last 7 years." },
  { label: "Became an authorized user on parent's card", effect: "raises" as const, points: 12, explanation: "You inherit the positive history of a well-managed account." },
  { label: "Applied for a mortgage", effect: "lowers" as const, points: -8, explanation: "Hard inquiries temporarily lower your score by a small amount." },
  { label: "Had no credit card debt for 6 months", effect: "raises" as const, points: 14, explanation: "Consistent zero-balance behavior improves your utilization and history." },
  { label: "Filed for bankruptcy", effect: "lowers" as const, points: -100, explanation: "Bankruptcy is the most severe credit event and stays for 10 years." },
  { label: "Set up autopay for all bills", effect: "raises" as const, points: 8, explanation: "Autopay ensures you never miss a payment due date." },
  { label: "Took out a payday loan", effect: "lowers" as const, points: -15, explanation: "Payday lenders often report to credit bureaus and signal financial stress." },
];

function getCreditColor(score: number) {
  if (score < 580) return { bar: "bg-red-500", text: "text-red-600", label: "Poor" };
  if (score < 670) return { bar: "bg-yellow-500", text: "text-yellow-600", label: "Fair" };
  if (score < 740) return { bar: "bg-emerald-500", text: "text-emerald-600", label: "Good" };
  return { bar: "bg-emerald-600", text: "text-emerald-700", label: "Excellent" };
}

export default function CreditClimbPage() {
  const { addArcadeScore } = useLocalProgress();

  const [creditScore, setCreditScore] = useState(650);
  const [phase, setPhase] = useState<"playing" | "won" | "lost">("playing");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lastExplanation, setLastExplanation] = useState<string | null>(null);
  const [lastCorrect, setLastCorrect] = useState<boolean | null>(null);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);

  const shuffled = useMemo(
    () => [...ACTIONS].sort(() => Math.random() - 0.5),
    []
  );

  useEffect(() => {
    if (phase === "won" || phase === "lost") {
      addArcadeScore("credit-climb" as GameId, creditScore, 1);
    }
  }, [phase, creditScore, addArcadeScore]);

  const handleAnswer = useCallback(
    (playerSaysRaises: boolean) => {
      if (phase !== "playing") return;
      const action = shuffled[currentIndex % shuffled.length];
      const isCorrect = playerSaysRaises === (action.effect === "raises");
      const delta = isCorrect ? Math.abs(action.points) : -Math.abs(action.points);
      const newScore = Math.min(850, Math.max(300, creditScore + delta));

      setCreditScore(newScore);
      setLastExplanation(action.explanation);
      setLastCorrect(isCorrect);
      setQuestionsAnswered((q) => q + 1);
      setCurrentIndex((i) => i + 1);

      if (newScore >= 850) setPhase("won");
      else if (newScore <= 300) setPhase("lost");
    },
    [phase, shuffled, currentIndex, creditScore]
  );

  const handlePlayAgain = useCallback(() => {
    setCreditScore(650);
    setPhase("playing");
    setCurrentIndex(0);
    setLastExplanation(null);
    setLastCorrect(null);
    setQuestionsAnswered(0);
  }, []);

  const colors = getCreditColor(creditScore);
  const scorePercent = ((creditScore - 300) / (850 - 300)) * 100;
  const currentAction = shuffled[currentIndex % shuffled.length];

  return (
    <GameLayout
      title="Credit Climb"
      module="arcade"
      backHref="/minigames"
      headerRight={
        phase === "playing" ? (
          <span className={cn("text-lg font-extrabold text-white tabular-nums")}>
            {creditScore}
          </span>
        ) : undefined
      }
    >
      <div className="flex flex-col items-center gap-6 py-4">
        <AnimatePresence mode="wait">
          {phase === "playing" && (
            <motion.div
              key="playing"
              className="flex w-full max-w-sm flex-col gap-5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Credit score gauge */}
              <div className="flex flex-col gap-2 rounded-2xl border-2 border-border bg-card p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-muted-foreground">
                    Credit Score
                  </span>
                  <span className={cn("text-xl font-extrabold tabular-nums", colors.text)}>
                    {creditScore} — {colors.label}
                  </span>
                </div>
                <div className="h-4 w-full overflow-hidden rounded-full bg-muted">
                  <motion.div
                    className={cn("h-full rounded-full", colors.bar)}
                    animate={{ width: `${scorePercent}%` }}
                    transition={{ type: "spring", stiffness: 100, damping: 20 }}
                  />
                </div>
                <div className="flex justify-between text-[10px] font-bold text-muted-foreground">
                  <span>300 (Poor)</span>
                  <span>850 (Excellent)</span>
                </div>
              </div>

              {/* Action card */}
              <motion.div
                key={currentIndex}
                className="flex flex-col gap-3 rounded-2xl border-2 border-border bg-card p-5 shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              >
                <p className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground">
                  Action #{questionsAnswered + 1}
                </p>
                <p className="text-lg font-extrabold leading-snug text-foreground">
                  {currentAction.label}
                </p>
              </motion.div>

              {/* Explanation callout */}
              <AnimatePresence>
                {lastExplanation && (
                  <motion.div
                    key="explanation"
                    className={cn(
                      "rounded-xl border-2 p-3 text-sm font-semibold leading-relaxed",
                      lastCorrect
                        ? "border-emerald-300 bg-emerald-50 text-emerald-800"
                        : "border-red-300 bg-red-50 text-red-800"
                    )}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    {lastCorrect ? "✅ Correct! " : "❌ Wrong! "}{lastExplanation}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Answer buttons */}
              <div className="flex gap-4">
                <Button
                  className="flex-1 min-h-[56px] rounded-2xl bg-emerald-500 font-extrabold text-white hover:bg-emerald-600"
                  onClick={() => handleAnswer(true)}
                >
                  ⬆️ RAISES
                </Button>
                <Button
                  className="flex-1 min-h-[56px] rounded-2xl bg-red-500 font-extrabold text-white hover:bg-red-600"
                  onClick={() => handleAnswer(false)}
                >
                  ⬇️ LOWERS
                </Button>
              </div>

              <p className="text-center text-[10px] font-mono text-muted-foreground/60">
                📚 CEE.PF.4 — Using Credit
              </p>
            </motion.div>
          )}

          {(phase === "won" || phase === "lost") && (
            <motion.div
              key="ended"
              className="flex w-full max-w-sm flex-col items-center gap-6 text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
              <span className="text-6xl">{phase === "won" ? "🏆" : "💔"}</span>
              <div className="flex flex-col gap-1">
                <h2 className="text-2xl font-extrabold">
                  {phase === "won" ? "EXCELLENT CREDIT!" : "CREDIT CRASHED"}
                </h2>
                <p className="text-sm text-muted-foreground">
                  Final score: <span className={cn("font-extrabold", colors.text)}>{creditScore}</span>
                </p>
              </div>

              <div className="w-full rounded-2xl border-2 border-border bg-card p-4">
                <p className="text-sm font-bold text-muted-foreground">
                  Questions answered: <span className="text-foreground">{questionsAnswered}</span>
                </p>
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
