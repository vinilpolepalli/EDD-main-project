"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GameLayout } from "@/components/shared/game-layout";
import { Button } from "@/components/ui/button";
import { useLocalProgress } from "@/hooks/use-local-progress";
import { cn } from "@/lib/utils";
import type { GameId } from "@/types/game";

const QUESTION_POOL = [
  {
    question: "What does 'gross income' mean?",
    options: ["Income after taxes", "Total income before any deductions", "Money in your bank", "Taxable income only"],
    correctIndex: 1,
    explanation: "Gross income is your total earnings before taxes or deductions are removed.",
  },
  {
    question: "What is a W-2 form used for?",
    options: ["Applying for a job", "Reporting wages and taxes withheld to the IRS", "Opening a bank account", "Filing for unemployment"],
    correctIndex: 1,
    explanation: "A W-2 is sent by employers each January showing your annual wages and taxes withheld.",
  },
  {
    question: "A tax deduction...",
    options: ["Adds money to your paycheck", "Reduces your taxable income", "Is the same as a tax credit", "Only applies to businesses"],
    correctIndex: 1,
    explanation: "Deductions lower the amount of income subject to tax, reducing what you owe.",
  },
  {
    question: "If you get a tax refund, what does it mean?",
    options: ["The government is giving you free money", "You paid more tax than you owed during the year", "You owe the government money", "You filed your taxes incorrectly"],
    correctIndex: 1,
    explanation: "A refund means the government withheld too much from your paychecks — you're getting your own money back.",
  },
  {
    question: "FICA taxes fund which two programs?",
    options: ["Medicare and Medicaid", "Social Security and Medicare", "Unemployment and Food Stamps", "Schools and Roads"],
    correctIndex: 1,
    explanation: "FICA stands for Federal Insurance Contributions Act. It funds Social Security (6.2%) and Medicare (1.45%).",
  },
  {
    question: "What is the standard deduction for a single filer (2024)?",
    options: ["$7,000", "$10,500", "$14,600", "$21,900"],
    correctIndex: 2,
    explanation: "The 2024 standard deduction for single filers is $14,600 — up from $13,850 in 2023.",
  },
  {
    question: "Which filing status results in the lowest tax rate for most people?",
    options: ["Single", "Married Filing Jointly", "Married Filing Separately", "Head of Household"],
    correctIndex: 1,
    explanation: "Married Filing Jointly usually provides the most favorable tax brackets and deductions.",
  },
  {
    question: "What does 'withholding' mean on a paycheck?",
    options: ["Money your employer keeps as profit", "Taxes taken from your paycheck before you receive it", "Your voluntary retirement contribution", "Social security benefits"],
    correctIndex: 1,
    explanation: "Withholding is pre-paid tax. Your employer sends it to the IRS on your behalf throughout the year.",
  },
  {
    question: "A progressive tax system means...",
    options: ["Everyone pays the same percentage", "Higher income = higher tax rate on income above thresholds", "Lower income earners pay more", "Taxes increase every year automatically"],
    correctIndex: 1,
    explanation: "The US uses progressive brackets — you pay higher rates only on income that exceeds each threshold, not on all income.",
  },
  {
    question: "What is the tax deadline for most US taxpayers?",
    options: ["March 15", "April 15", "June 30", "December 31"],
    correctIndex: 1,
    explanation: "Most taxpayers must file federal income tax returns by April 15. Extensions are available.",
  },
];

const ROUNDS = 5;
const SECONDS_PER_QUESTION = 20;

export default function TaxTriviaPage() {
  const { addArcadeScore } = useLocalProgress();

  const questions = useMemo(
    () => [...QUESTION_POOL].sort(() => Math.random() - 0.5).slice(0, ROUNDS),
    []
  );

  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(SECONDS_PER_QUESTION);
  const [selected, setSelected] = useState<number | null>(null);
  const [phase, setPhase] = useState<"question" | "reveal" | "ended">("question");
  const [wrongAnswers, setWrongAnswers] = useState<typeof QUESTION_POOL>([]);

  useEffect(() => {
    if (phase !== "question") return;
    const interval = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(interval);
          // Auto-advance with no selection
          setPhase("reveal");
          setWrongAnswers((w) => [...w, questions[round]]);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [phase, round, questions]);

  useEffect(() => {
    if (phase === "reveal") {
      const timeout = setTimeout(() => {
        if (round + 1 >= ROUNDS) {
          setPhase("ended");
          addArcadeScore("tax-trivia" as GameId, score, 1);
        } else {
          setRound((r) => r + 1);
          setTimeLeft(SECONDS_PER_QUESTION);
          setSelected(null);
          setPhase("question");
        }
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [phase, round, score, addArcadeScore]);

  const handleSelect = useCallback(
    (optionIndex: number) => {
      if (phase !== "question" || selected !== null) return;
      const q = questions[round];
      const isCorrect = optionIndex === q.correctIndex;
      const timeBonus = timeLeft * 5;
      const points = isCorrect ? 100 + timeBonus : 0;

      setSelected(optionIndex);
      setScore((s) => s + points);
      if (!isCorrect) setWrongAnswers((w) => [...w, q]);
      setPhase("reveal");
    },
    [phase, selected, questions, round, timeLeft]
  );

  const handlePlayAgain = useCallback(() => {
    setRound(0);
    setScore(0);
    setTimeLeft(SECONDS_PER_QUESTION);
    setSelected(null);
    setPhase("question");
    setWrongAnswers([]);
  }, []);

  const q = questions[round];

  return (
    <GameLayout
      title="Tax Trivia"
      module="arcade"
      backHref="/minigames"
      headerRight={
        phase !== "ended" ? (
          <div className="flex items-center gap-3 text-white">
            <span className="text-sm font-bold">
              Round {round + 1}/{ROUNDS}
            </span>
            <span className="text-xl font-extrabold tabular-nums">{score}</span>
          </div>
        ) : undefined
      }
    >
      <div className="flex flex-col items-center gap-6 py-4">
        <AnimatePresence mode="wait">
          {phase !== "ended" && (
            <motion.div
              key={`round-${round}`}
              className="flex w-full max-w-md flex-col gap-5"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              {/* Progress */}
              <div className="flex flex-col gap-1">
                <div className="flex justify-between text-xs font-bold text-muted-foreground">
                  <span>Round {round + 1} of {ROUNDS}</span>
                  <span className={cn(timeLeft <= 5 && "text-red-500 animate-pulse")}>
                    {timeLeft}s
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <motion.div
                    className={cn("h-full rounded-full", timeLeft > 5 ? "bg-rose-500" : "bg-red-600")}
                    animate={{ width: `${(timeLeft / SECONDS_PER_QUESTION) * 100}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>

              {/* Question */}
              <div className="rounded-2xl border-2 border-border bg-card p-5 shadow-sm">
                <p className="text-base font-extrabold leading-snug text-foreground">
                  {q.question}
                </p>
              </div>

              {/* Options */}
              <div className="grid grid-cols-2 gap-3">
                {q.options.map((option, idx) => {
                  const isSelected = selected === idx;
                  const isCorrect = idx === q.correctIndex;
                  const showReveal = phase === "reveal";

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelect(idx)}
                      disabled={phase === "reveal"}
                      className={cn(
                        "min-h-[64px] rounded-2xl border-2 p-3 text-sm font-bold transition-colors text-left",
                        showReveal && isCorrect
                          ? "border-emerald-400 bg-emerald-50 text-emerald-800"
                          : showReveal && isSelected && !isCorrect
                            ? "border-red-400 bg-red-50 text-red-800"
                            : "border-border bg-card hover:bg-muted"
                      )}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>

              {/* Explanation */}
              <AnimatePresence>
                {phase === "reveal" && (
                  <motion.div
                    className={cn(
                      "rounded-xl border-2 p-3 text-sm font-semibold leading-relaxed",
                      selected === q.correctIndex
                        ? "border-emerald-300 bg-emerald-50 text-emerald-800"
                        : "border-red-300 bg-red-50 text-red-800"
                    )}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                  >
                    {selected === q.correctIndex ? "✅ Correct! " : "❌ The answer is: " + q.options[q.correctIndex] + ". "}
                    {q.explanation}
                  </motion.div>
                )}
              </AnimatePresence>

              <p className="text-center text-[10px] font-mono text-muted-foreground/60">
                📚 CEE.PF.5 — Income and Careers
              </p>
            </motion.div>
          )}

          {phase === "ended" && (
            <motion.div
              key="ended"
              className="flex w-full max-w-sm flex-col items-center gap-6 text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <span className="text-6xl">🧾</span>
              <div>
                <h2 className="text-4xl font-extrabold">{score}</h2>
                <p className="font-bold text-muted-foreground">Final Score</p>
              </div>

              {wrongAnswers.length > 0 && (
                <div className="w-full rounded-2xl border-2 border-border bg-card p-4 text-left">
                  <p className="mb-3 text-sm font-extrabold text-foreground">Review — Missed Questions:</p>
                  {wrongAnswers.map((q, i) => (
                    <div key={i} className="mb-3 border-b border-border pb-3 last:border-0 last:pb-0">
                      <p className="text-xs font-bold text-foreground">{q.question}</p>
                      <p className="mt-1 text-xs font-semibold text-emerald-700">
                        ✓ {q.options[q.correctIndex]}
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground">{q.explanation}</p>
                    </div>
                  ))}
                </div>
              )}

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
