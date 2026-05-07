"use client";

import { useState, useMemo, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  ChevronRight,
  Heart,
  RotateCcw,
  Trophy,
  X,
  Sparkles,

  BookOpen,
  AlertTriangle,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { LegalDisclaimer } from "@/components/shared/legal-disclaimer";
import { useGameState } from "@/hooks/use-game-state";
import { useLocalProgress } from "@/hooks/use-local-progress";
import {
  calculateQuizScore,
  calculateXpEarned,
} from "@/lib/game-engine/learn";
import type { Topic, QuizQuestion } from "@/types/game";

import creditQuiz from "@/content/quizzes/credit.json";
import taxesQuiz from "@/content/quizzes/taxes.json";
import budgetingQuiz from "@/content/quizzes/budgeting.json";

/* -------------------------------------------------------------------------- */
/*  Data                                                                      */
/* -------------------------------------------------------------------------- */

const quizMap: Record<Topic, QuizQuestion[]> = {
  credit: creditQuiz as QuizQuestion[],
  taxes: taxesQuiz as QuizQuestion[],
  budgeting: budgetingQuiz as QuizQuestion[],
  saving: [],
  investing: [],
  insurance: [],
};

const topicLabels: Record<Topic, string> = {
  credit: "Credit",
  taxes: "Taxes",
  budgeting: "Budgeting",
  saving: "Saving",
  investing: "Investing",
  insurance: "Insurance",
};

const topicColors: Record<
  Topic,
  { bg: string; light: string; text: string; headerBg: string }
> = {
  credit: {
    bg: "bg-ink",
    light: "bg-ink/10",
    text: "text-muted",
    headerBg: "bg-ink",
  },
  taxes: {
    bg: "bg-accent",
    light: "bg-accent/10",
    text: "text-muted",
    headerBg: "bg-accent",
  },
  budgeting: {
    bg: "bg-accent",
    light: "bg-accent/10",
    text: "text-muted",
    headerBg: "bg-accent",
  },
  saving: {
    bg: "bg-ink",
    light: "bg-ink/10",
    text: "text-muted",
    headerBg: "bg-ink",
  },
  investing: {
    bg: "bg-ink",
    light: "bg-ink/10",
    text: "text-muted",
    headerBg: "bg-ink",
  },
  insurance: {
    bg: "bg-rose-500",
    light: "bg-rose-500/10",
    text: "text-rose-400",
    headerBg: "bg-rose-500",
  },
};

const VALID_TOPICS: Topic[] = ["credit", "taxes", "budgeting", "saving", "investing", "insurance"];
const MAX_LIVES = 3;
const optionLabels = ["A", "B", "C", "D"];

function isValidTopic(value: unknown): value is Topic {
  return typeof value === "string" && VALID_TOPICS.includes(value as Topic);
}

/* -------------------------------------------------------------------------- */
/*  Hearts Display                                                            */
/* -------------------------------------------------------------------------- */

function HeartsDisplay({ lives }: { lives: number }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: MAX_LIVES }).map((_, i) => (
        <motion.div
          key={i}
          initial={false}
          animate={
            i >= lives
              ? { scale: [1, 0.5, 0.5], opacity: [1, 0, 0] }
              : { scale: 1, opacity: 1 }
          }
          transition={{ duration: 0.3 }}
        >
          <Heart
            className={cn(
              "h-5 w-5",
              i < lives
                ? "fill-red-500 text-red-500"
                : "fill-gray-700 text-gray-700"
            )}
          />
        </motion.div>
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  XP Float Animation                                                        */
/* -------------------------------------------------------------------------- */

function XpFloat({ amount }: { amount: number }) {
  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center"
      initial={{ opacity: 1, y: 0 }}
      animate={{ opacity: 0, y: -80 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
    >
      <span className="text-3xl font-extrabold text-muted">
        +{amount} XP
      </span>
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Main Quiz Page                                                            */
/* -------------------------------------------------------------------------- */

export default function QuizPage() {
  const params = useParams();
  const topicParam = params.topic;

  const { progress, updateXp, updateStreak, isLoaded: gameLoaded } = useGameState();
  const { isLoaded: localLoaded } = useLocalProgress();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | undefined>(
    undefined
  );
  const [quizComplete, setQuizComplete] = useState(false);
  const [rewardsApplied, setRewardsApplied] = useState(false);
  const [lives, setLives] = useState(MAX_LIVES);
  const [gameOver, setGameOver] = useState(false);
  const [showXpFloat, setShowXpFloat] = useState(false);

  const isLoaded = gameLoaded && localLoaded;

  // Validate topic
  if (!isValidTopic(topicParam)) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-900 px-4">
        <div className="flex flex-col items-center gap-4 py-20">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/20">
            <AlertTriangle className="h-8 w-8 text-red-400" />
          </div>
          <h2 className="text-xl font-extrabold text-white">
            Quiz Not Found
          </h2>
          <p className="text-center text-sm text-gray-400">
            The quiz for &quot;{String(topicParam)}&quot; doesn&apos;t exist.
          </p>
          <Link href="/learn">
            <Button className="mt-2 min-h-[48px] rounded-xl bg-ink font-extrabold text-white hover:bg-ink">
              Back to Learn Path
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const topic: Topic = topicParam;
  const questions = quizMap[topic];
  const colors = topicColors[topic];
  const topicLabel = topicLabels[topic];
  const totalQuestions = questions.length;
  const currentQuestion = questions[currentQuestionIndex];

  const progressPercent =
    totalQuestions > 0
      ? Math.round(
          ((currentQuestionIndex + (quizComplete || gameOver ? 1 : 0)) /
            totalQuestions) *
            100
        )
      : 0;

  // Calculate results when quiz is complete
  const quizResults = useMemo(() => {
    if (!quizComplete && !gameOver) return null;

    const correctAnswers = questions
      .slice(0, answers.length)
      .map((q) => q.correctIndex);
    const result = calculateQuizScore(answers, correctAnswers);
    const xpEarned = calculateXpEarned(
      result.score,
      result.total,
      progress.currentStreak
    );
    return {
      ...result,
      xpEarned,
    };
  }, [quizComplete, gameOver, answers, questions, progress.currentStreak]);

  const handleAnswer = useCallback(
    (selectedIndex: number) => {
      if (showResult) return;
      setSelectedAnswer(selectedIndex);
      setShowResult(true);
      setAnswers((prev) => [...prev, selectedIndex]);

      const isCorrect = selectedIndex === currentQuestion.correctIndex;

      if (isCorrect) {
        setShowXpFloat(true);
        setTimeout(() => setShowXpFloat(false), 1200);
      } else {
        const newLives = lives - 1;
        setLives(newLives);
        if (newLives <= 0) {
          // Delay game over to show the wrong answer first
          setTimeout(() => setGameOver(true), 1500);
        }
      }
    },
    [showResult, currentQuestion.correctIndex, lives]
  );

  const handleNextQuestion = useCallback(() => {
    if (gameOver) return;

    if (currentQuestionIndex + 1 >= totalQuestions) {
      setQuizComplete(true);
    } else {
      setCurrentQuestionIndex((prev) => prev + 1);
      setShowResult(false);
      setSelectedAnswer(undefined);
    }
  }, [currentQuestionIndex, totalQuestions, gameOver]);

  // Apply rewards once when quiz results are calculated
  const handleApplyRewards = useCallback(() => {
    if (rewardsApplied || !quizResults) return;

    if (quizResults.passed && !gameOver) {
      updateXp(quizResults.xpEarned);
      updateStreak();
    }
    setRewardsApplied(true);
  }, [rewardsApplied, quizResults, gameOver, updateXp, updateStreak]);

  // Apply rewards when quiz completes
  if ((quizComplete || gameOver) && quizResults && !rewardsApplied) {
    handleApplyRewards();
  }

  const handleRetry = useCallback(() => {
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setShowResult(false);
    setSelectedAnswer(undefined);
    setQuizComplete(false);
    setRewardsApplied(false);
    setLives(MAX_LIVES);
    setGameOver(false);
  }, []);

  // Get option styling
  const getOptionState = (index: number) => {
    if (!showResult || selectedAnswer === undefined) return "idle";
    if (index === currentQuestion.correctIndex) return "correct";
    if (index === selectedAnswer && index !== currentQuestion.correctIndex)
      return "wrong";
    return "dimmed";
  };

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen flex-col bg-gray-900">
        <div className="mx-auto w-full max-w-2xl px-4 py-8">
          <Skeleton className="mb-4 h-6 w-full rounded-lg bg-gray-800" />
          <Skeleton className="mb-4 h-32 w-full rounded-xl bg-gray-800" />
          <div className="grid grid-cols-1 gap-3">
            <Skeleton className="h-14 rounded-xl bg-gray-800" />
            <Skeleton className="h-14 rounded-xl bg-gray-800" />
            <Skeleton className="h-14 rounded-xl bg-gray-800" />
            <Skeleton className="h-14 rounded-xl bg-gray-800" />
          </div>
        </div>
      </div>
    );
  }

  const isFinished = quizComplete || gameOver;

  return (
    <div className="flex min-h-screen flex-col bg-gray-900">
      {/* XP Float */}
      <AnimatePresence>
        {showXpFloat && <XpFloat amount={25} />}
      </AnimatePresence>

      {/* Header */}
      <motion.header
        className="sticky top-0 z-30 border-b border-gray-800 bg-gray-900/95 backdrop-blur-sm"
        initial={{ y: -60 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      >
        <div className="mx-auto flex h-14 max-w-2xl items-center justify-between px-4">
          <Link
            href={`/learn/${topic}`}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-800 hover:text-white"
            aria-label="Back to lessons"
          >
            <X className="h-5 w-5" />
          </Link>

          {/* Progress bar in header */}
          {!isFinished && (
            <div className="flex-1 px-4">
              <Progress
                value={progressPercent}
                color="bg-accent"
                height="h-3"
              />
            </div>
          )}

          {/* Hearts */}
          <HeartsDisplay lives={lives} />
        </div>
      </motion.header>

      {/* Content */}
      <div className="mx-auto w-full max-w-2xl flex-1 px-4 py-6">
        <AnimatePresence mode="wait">
          {!isFinished ? (
            /* ---------- Active Quiz ---------- */
            <motion.div
              key={`question-${currentQuestionIndex}`}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ type: "spring", stiffness: 200, damping: 22 }}
              className="flex flex-col gap-6"
            >
              {/* Question counter */}
              <p className="text-center text-xs font-bold text-gray-500">
                Question {currentQuestionIndex + 1} of {totalQuestions}
              </p>

              {/* Question Card */}
              <motion.div
                className="rounded-2xl border border-gray-700 bg-gray-800/80 p-6 shadow-lg"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <p className="text-center text-lg font-bold leading-relaxed text-white">
                  {currentQuestion.question}
                </p>
              </motion.div>

              {/* Answer Options — full width, stacked */}
              <div className="flex flex-col gap-3">
                {currentQuestion.options.map((option, index) => {
                  const state = getOptionState(index);
                  return (
                    <motion.button
                      key={index}
                      type="button"
                      className={cn(
                        "relative flex min-h-[56px] items-center gap-3 rounded-xl border-2 px-4 py-3 text-left text-sm font-bold transition-all",
                        state === "idle" &&
                          "border-gray-700 bg-gray-800/80 text-gray-200 hover:border-gray-500 hover:bg-gray-700/80",
                        state === "correct" &&
                          "border-accent bg-accent/15 text-muted",
                        state === "wrong" &&
                          "border-red-500 bg-red-500/15 text-red-400",
                        state === "dimmed" &&
                          "border-gray-700 bg-gray-800/40 text-gray-600 opacity-50",
                        showResult && "pointer-events-none"
                      )}
                      onClick={() => handleAnswer(index)}
                      disabled={showResult}
                      whileHover={!showResult ? { scale: 1.01 } : undefined}
                      whileTap={!showResult ? { scale: 0.98 } : undefined}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: index * 0.05,
                        type: "spring",
                        stiffness: 200,
                        damping: 20,
                      }}
                      aria-label={`Option ${optionLabels[index]}: ${option}`}
                    >
                      <span
                        className={cn(
                          "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-extrabold",
                          state === "correct" && "bg-accent text-white",
                          state === "wrong" && "bg-red-500 text-white",
                          (state === "idle" || state === "dimmed") &&
                            "bg-gray-700 text-gray-400"
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

              {/* Result feedback + explanation */}
              {showResult && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="flex flex-col gap-4"
                >
                  {/* Correct/Wrong banner */}
                  <div
                    className={cn(
                      "rounded-xl p-4",
                      selectedAnswer === currentQuestion.correctIndex
                        ? "bg-accent/15 border border-accent/30"
                        : "bg-red-500/15 border border-red-500/30"
                    )}
                  >
                    <p
                      className={cn(
                        "text-sm font-extrabold",
                        selectedAnswer === currentQuestion.correctIndex
                          ? "text-muted"
                          : "text-red-400"
                      )}
                    >
                      {selectedAnswer === currentQuestion.correctIndex
                        ? "Correct!"
                        : "Not quite..."}
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-gray-400">
                      {currentQuestion.explanation}
                    </p>
                  </div>

                  {/* Continue button */}
                  {!gameOver && (
                    <Button
                      className={cn(
                        "min-h-[52px] w-full rounded-xl text-base font-extrabold text-white",
                        selectedAnswer === currentQuestion.correctIndex
                          ? "bg-accent hover:bg-accent"
                          : "bg-gray-600 hover:bg-gray-500"
                      )}
                      onClick={handleNextQuestion}
                    >
                      {currentQuestionIndex + 1 >= totalQuestions
                        ? "See Results"
                        : "Continue"}
                      <ChevronRight className="ml-1 h-5 w-5" />
                    </Button>
                  )}
                </motion.div>
              )}
            </motion.div>
          ) : (
            /* ---------- Results / Game Over Screen ---------- */
            <motion.div
              key="results"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="flex flex-col gap-6"
            >
              {quizResults && (
                <>
                  {/* Score Card */}
                  <div
                    className={cn(
                      "flex flex-col items-center gap-4 rounded-2xl border-2 p-8 shadow-lg",
                      quizResults.passed && !gameOver
                        ? "border-accent/50 bg-accent/10"
                        : "border-red-500/50 bg-red-500/10"
                    )}
                  >
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 15,
                        delay: 0.2,
                      }}
                      className={cn(
                        "flex h-24 w-24 items-center justify-center rounded-full",
                        quizResults.passed && !gameOver
                          ? "bg-accent"
                          : "bg-red-500"
                      )}
                    >
                      {quizResults.passed && !gameOver ? (
                        <Trophy className="h-12 w-12 text-white" />
                      ) : (
                        <X className="h-12 w-12 text-white" />
                      )}
                    </motion.div>

                    <div className="flex flex-col items-center gap-1">
                      <h2 className="text-2xl font-extrabold text-white">
                        {gameOver
                          ? "Out of Hearts!"
                          : quizResults.passed
                            ? "Awesome Job!"
                            : "Keep Studying!"}
                      </h2>
                      <p className="text-sm font-semibold text-gray-400">
                        {gameOver
                          ? "You ran out of lives. Review the lessons and try again!"
                          : quizResults.passed
                            ? "You passed the quiz!"
                            : "You need 70% to pass. Review the lessons and try again."}
                      </p>
                    </div>

                    {/* Score Display */}
                    <div className="flex items-center gap-6">
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-4xl font-extrabold text-white tabular-nums">
                          {quizResults.score}/{quizResults.total}
                        </span>
                        <span className="text-xs font-bold text-gray-500">
                          Correct
                        </span>
                      </div>
                      <div className="h-12 w-px bg-gray-700" />
                      <div className="flex flex-col items-center gap-1">
                        <span
                          className={cn(
                            "text-4xl font-extrabold tabular-nums",
                            quizResults.passed && !gameOver
                              ? "text-muted"
                              : "text-red-400"
                          )}
                        >
                          {quizResults.percentage}%
                        </span>
                        <span className="text-xs font-bold text-gray-500">
                          Score
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Rewards (only if passed and not game over) */}
                  {quizResults.passed && !gameOver && (
                    <motion.div
                      className="flex flex-col gap-3"
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <h3 className="text-center text-sm font-extrabold tracking-wider text-gray-500">
                        REWARDS EARNED
                      </h3>
                      <div className="grid grid-cols-2 gap-3">
                        <motion.div
                          className="flex flex-col items-center gap-2 rounded-xl border border-gray-700 bg-gray-800/80 p-4"
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: 0.5, type: "spring" }}
                        >
                          <Zap className="h-6 w-6 text-accent" />
                          <span className="text-2xl font-extrabold text-white tabular-nums">
                            +{quizResults.xpEarned}
                          </span>
                          <span className="text-xs font-bold text-gray-500">
                            XP Earned
                          </span>
                        </motion.div>
                      </div>
                    </motion.div>
                  )}

                  {/* Action Buttons */}
                  <motion.div
                    className="flex flex-col gap-3"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                  >
                    {(!quizResults.passed || gameOver) && (
                      <>
                        <Link href={`/learn/${topic}`}>
                          <Button
                            className={cn(
                              "min-h-[52px] w-full rounded-xl text-base font-extrabold text-white",
                              colors.bg,
                              "hover:brightness-110"
                            )}
                          >
                            <BookOpen className="mr-2 h-5 w-5" />
                            Review the Material
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          className="min-h-[48px] w-full rounded-xl border-gray-700 bg-gray-800/80 font-extrabold text-gray-300 hover:bg-gray-700"
                          onClick={handleRetry}
                        >
                          <RotateCcw className="mr-2 h-4 w-4" />
                          Try Again
                        </Button>
                      </>
                    )}

                    {quizResults.passed && !gameOver && (
                      <Button
                        variant="outline"
                        className="min-h-[48px] w-full rounded-xl border-gray-700 bg-gray-800/80 font-extrabold text-gray-300 hover:bg-gray-700"
                        onClick={handleRetry}
                      >
                        <RotateCcw className="mr-2 h-4 w-4" />
                        Retake Quiz
                      </Button>
                    )}

                    <Link href="/learn">
                      <Button
                        className={cn(
                          "min-h-[48px] w-full rounded-xl font-extrabold",
                          quizResults.passed && !gameOver
                            ? cn(colors.bg, "text-white hover:brightness-110")
                            : "border border-gray-700 bg-gray-800/80 text-gray-300 hover:bg-gray-700"
                        )}
                      >
                        Back to Learn Path
                      </Button>
                    </Link>
                  </motion.div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Legal disclaimer */}
      <div className="border-t border-gray-800 px-4 py-3">
        <LegalDisclaimer className="text-gray-600" />
      </div>
    </div>
  );
}
