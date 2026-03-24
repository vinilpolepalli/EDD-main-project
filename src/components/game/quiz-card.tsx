"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { QuizQuestion } from "@/types/game";

interface QuizCardProps {
  question: QuizQuestion;
  /** Called when the user selects an answer, with the chosen index */
  onAnswer: (selectedIndex: number) => void;
  /** Whether to reveal the result (correct/incorrect highlighting) */
  showResult: boolean;
  /** The index the user selected (only relevant when showResult is true) */
  selectedIndex?: number;
  className?: string;
}

const optionLabels = ["A", "B", "C", "D"];

const QuizCard: React.FC<QuizCardProps> = ({
  question,
  onAnswer,
  showResult,
  selectedIndex,
  className,
}) => {
  const handleSelect = (index: number) => {
    if (showResult) return;
    onAnswer(index);
  };

  const getOptionState = (index: number) => {
    if (!showResult || selectedIndex === undefined) return "idle";
    if (index === question.correctIndex) return "correct";
    if (index === selectedIndex && index !== question.correctIndex) return "wrong";
    return "dimmed";
  };

  return (
    <div className={cn("flex flex-col gap-5", className)}>
      {/* Question */}
      <motion.div
        className="rounded-xl bg-card p-5 shadow-md"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
      >
        <p className="text-lg font-bold leading-relaxed text-foreground">
          {question.question}
        </p>
      </motion.div>

      {/* Options grid */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {question.options.map((option, index) => {
          const state = getOptionState(index);
          return (
            <motion.button
              key={index}
              type="button"
              className={cn(
                "relative flex min-h-[56px] items-center gap-3 rounded-xl border-2 px-4 py-3 text-left text-sm font-bold transition-colors",
                state === "idle" &&
                  "border-border bg-card text-foreground hover:border-primary hover:bg-primary/5",
                state === "correct" &&
                  "border-success bg-learn-light text-success",
                state === "wrong" &&
                  "border-destructive bg-red-50 text-destructive",
                state === "dimmed" &&
                  "border-border bg-muted text-muted-foreground opacity-60",
                showResult && "pointer-events-none"
              )}
              onClick={() => handleSelect(index)}
              disabled={showResult}
              whileHover={!showResult ? { scale: 1.02 } : undefined}
              whileTap={!showResult ? { scale: 0.98 } : undefined}
              initial={{ opacity: 0, x: index % 2 === 0 ? -12 : 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05, type: "spring", stiffness: 200, damping: 20 }}
              aria-label={`Option ${optionLabels[index]}: ${option}`}
            >
              <span
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-extrabold",
                  state === "correct" && "bg-success text-white",
                  state === "wrong" && "bg-destructive text-white",
                  (state === "idle" || state === "dimmed") &&
                    "bg-muted text-muted-foreground"
                )}
              >
                {state === "correct" ? (
                  <Check className="h-4 w-4" />
                ) : state === "wrong" ? (
                  <X className="h-4 w-4" />
                ) : (
                  optionLabels[index]
                )}
              </span>
              <span className="flex-1">{option}</span>
            </motion.button>
          );
        })}
      </div>

      {/* Explanation (shown after answering) */}
      {showResult && (
        <motion.div
          className="rounded-xl border border-border bg-muted p-4"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.3 }}
        >
          <p className="text-sm font-semibold leading-relaxed text-foreground">
            <span className="font-extrabold text-primary">Explanation: </span>
            {question.explanation}
          </p>
        </motion.div>
      )}
    </div>
  );
};

export { QuizCard };
export type { QuizCardProps };
