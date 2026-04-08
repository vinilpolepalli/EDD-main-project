"use client";

import { useState, useMemo, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  XCircle,
  ChevronRight,
  RotateCcw,
  Trophy,
  Sparkles,
  BookOpen,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { GameLayout } from "@/components/shared/game-layout";
import { QuizCard } from "@/components/game/quiz-card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
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

const quizMap: Record<Topic, QuizQuestion[]> = {
  credit: creditQuiz as QuizQuestion[],
  taxes: taxesQuiz as QuizQuestion[],
  budgeting: budgetingQuiz as QuizQuestion[],
};

const topicLabels: Record<Topic, string> = {
  credit: "Credit",
  taxes: "Taxes",
  budgeting: "Budgeting",
};

const topicColors: Record<Topic, { bg: string; light: string; text: string }> = {
  credit: {
    bg: "bg-emerald-500",
    light: "bg-emerald-50",
    text: "text-emerald-600",
  },
  taxes: {
    bg: "bg-teal-500",
    light: "bg-teal-50",
    text: "text-teal-600",
  },
  budgeting: {
    bg: "bg-green-500",
    light: "bg-green-50",
    text: "text-green-600",
  },
};

const VALID_TOPICS: Topic[] = ["credit", "taxes", "budgeting"];

function isValidTopic(value: unknown): value is Topic {
  return typeof value === "string" && VALID_TOPICS.includes(value as Topic);
}

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

  const isLoaded = gameLoaded && localLoaded;

  // Validate topic
  if (!isValidTopic(topicParam)) {
    return (
      <GameLayout title="Invalid Quiz" backHref="/learn">
        <div className="flex flex-col items-center justify-center gap-4 py-20">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-100">
            <AlertTriangle className="h-8 w-8 text-red-500" />
          </div>
          <h2 className="text-xl font-extrabold text-foreground">
            Quiz Not Found
          </h2>
          <p className="text-center text-sm text-muted-foreground">
            The quiz for &quot;{String(topicParam)}&quot; doesn&apos;t exist.
          </p>
          <Link href="/learn">
            <Button className="mt-2 min-h-[48px] rounded-xl font-extrabold">
              Back to Learn Path
            </Button>
          </Link>
        </div>
      </GameLayout>
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
      ? Math.round(((currentQuestionIndex + (quizComplete ? 1 : 0)) / totalQuestions) * 100)
      : 0;

  // Calculate results when quiz is complete
  const quizResults = useMemo(() => {
    if (!quizComplete) return null;

    const correctAnswers = questions.map((q) => q.correctIndex);
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
  }, [quizComplete, answers, questions, progress.currentStreak]);

  const handleAnswer = useCallback(
    (selectedIndex: number) => {
      if (showResult) return;
      setSelectedAnswer(selectedIndex);
      setShowResult(true);
      setAnswers((prev) => [...prev, selectedIndex]);
    },
    [showResult]
  );

  const handleNextQuestion = useCallback(() => {
    if (currentQuestionIndex + 1 >= totalQuestions) {
      setQuizComplete(true);
    } else {
      setCurrentQuestionIndex((prev) => prev + 1);
      setShowResult(false);
      setSelectedAnswer(undefined);
    }
  }, [currentQuestionIndex, totalQuestions]);

  // Apply rewards once when quiz results are calculated
  const handleApplyRewards = useCallback(() => {
    if (rewardsApplied || !quizResults) return;

    if (quizResults.passed) {
      updateXp(quizResults.xpEarned);
      updateStreak();
    }
    setRewardsApplied(true);
  }, [rewardsApplied, quizResults, updateXp, updateStreak]);

  // Apply rewards when quiz completes
  if (quizComplete && quizResults && !rewardsApplied) {
    handleApplyRewards();
  }

  const handleRetry = useCallback(() => {
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setShowResult(false);
    setSelectedAnswer(undefined);
    setQuizComplete(false);
    setRewardsApplied(false);
  }, []);

  if (!isLoaded) {
    return (
      <GameLayout title={`${topicLabel} Quiz`} module="learn" backHref={`/learn/${topic}`}>
        <div className="flex flex-col gap-4">
          <Skeleton className="h-6 w-full rounded-lg" />
          <Skeleton className="h-32 w-full rounded-xl" />
          <div className="grid grid-cols-2 gap-3">
            <Skeleton className="h-14 rounded-xl" />
            <Skeleton className="h-14 rounded-xl" />
            <Skeleton className="h-14 rounded-xl" />
            <Skeleton className="h-14 rounded-xl" />
          </div>
        </div>
      </GameLayout>
    );
  }

  return (
    <GameLayout
      title={`${topicLabel} Quiz`}
      module="learn"
      backHref={`/learn/${topic}`}
    >
      <div className="flex flex-col gap-5">
        {/* Progress Bar */}
        {!quizComplete && (
          <motion.div
            className="flex flex-col gap-2"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-between text-xs font-bold text-muted-foreground">
              <span>
                Question {currentQuestionIndex + 1} of {totalQuestions}
              </span>
              <span className="tabular-nums">{progressPercent}%</span>
            </div>
            <Progress
              value={progressPercent}
              color={colors.bg}
              height="h-2.5"
            />
          </motion.div>
        )}

        {/* Quiz Content */}
        <AnimatePresence mode="wait">
          {!quizComplete ? (
            <motion.div
              key={`question-${currentQuestionIndex}`}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ type: "spring", stiffness: 200, damping: 22 }}
              className="flex flex-col gap-5"
            >
              {/* Question Card */}
              <QuizCard
                question={currentQuestion}
                onAnswer={handleAnswer}
                showResult={showResult}
                selectedIndex={selectedAnswer}
              />

              {/* Next Button */}
              {showResult && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Button
                    className={cn(
                      "min-h-[52px] w-full rounded-xl text-base font-extrabold text-white",
                      colors.bg,
                      "hover:brightness-110"
                    )}
                    onClick={handleNextQuestion}
                  >
                    {currentQuestionIndex + 1 >= totalQuestions
                      ? "See Results"
                      : "Next Question"}
                    <ChevronRight className="ml-1 h-5 w-5" />
                  </Button>
                </motion.div>
              )}
            </motion.div>
          ) : (
            /* Results Screen */
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
                      "flex flex-col items-center gap-4 rounded-2xl border-2 p-6 shadow-lg",
                      quizResults.passed
                        ? "border-learn bg-learn-light"
                        : "border-red-300 bg-red-50"
                    )}
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 15,
                        delay: 0.2,
                      }}
                      className={cn(
                        "flex h-20 w-20 items-center justify-center rounded-full",
                        quizResults.passed ? "bg-learn" : "bg-red-400"
                      )}
                    >
                      {quizResults.passed ? (
                        <Trophy className="h-10 w-10 text-white" />
                      ) : (
                        <XCircle className="h-10 w-10 text-white" />
                      )}
                    </motion.div>

                    <div className="flex flex-col items-center gap-1">
                      <h2 className="text-2xl font-extrabold text-foreground">
                        {quizResults.passed ? "Awesome Job!" : "Keep Studying!"}
                      </h2>
                      <p className="text-sm font-semibold text-muted-foreground">
                        {quizResults.passed
                          ? "You passed the quiz!"
                          : "You need 70% to pass. Review the lessons and try again."}
                      </p>
                    </div>

                    {/* Score Display */}
                    <div className="flex items-center gap-6">
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-4xl font-extrabold text-foreground tabular-nums">
                          {quizResults.score}/{quizResults.total}
                        </span>
                        <span className="text-xs font-bold text-muted-foreground">
                          Correct
                        </span>
                      </div>
                      <div className="h-12 w-px bg-border" />
                      <div className="flex flex-col items-center gap-1">
                        <span
                          className={cn(
                            "text-4xl font-extrabold tabular-nums",
                            quizResults.passed
                              ? "text-learn"
                              : "text-red-500"
                          )}
                        >
                          {quizResults.percentage}%
                        </span>
                        <span className="text-xs font-bold text-muted-foreground">
                          Score
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Rewards (only if passed) */}
                  {quizResults.passed && (
                    <motion.div
                      className="flex flex-col gap-3"
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <h3 className="text-center text-sm font-extrabold text-muted-foreground">
                        REWARDS EARNED
                      </h3>
                      <motion.div
                        className="flex flex-col items-center gap-2 rounded-xl bg-xp-light p-4"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.5, type: "spring" }}
                      >
                        <Sparkles className="h-6 w-6 text-xp" />
                        <span className="text-2xl font-extrabold text-foreground tabular-nums">
                          +{quizResults.xpEarned}
                        </span>
                        <span className="text-xs font-bold text-muted-foreground">
                          XP Earned
                        </span>
                      </motion.div>
                    </motion.div>
                  )}

                  {/* Action Buttons */}
                  <motion.div
                    className="flex flex-col gap-3"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                  >
                    {!quizResults.passed && (
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
                          className="min-h-[48px] w-full rounded-xl font-extrabold"
                          onClick={handleRetry}
                        >
                          <RotateCcw className="mr-2 h-4 w-4" />
                          Try Again
                        </Button>
                      </>
                    )}

                    {quizResults.passed && (
                      <>
                        <Button
                          variant="outline"
                          className="min-h-[48px] w-full rounded-xl font-extrabold"
                          onClick={handleRetry}
                        >
                          <RotateCcw className="mr-2 h-4 w-4" />
                          Retake Quiz
                        </Button>
                      </>
                    )}

                    <Link href="/learn">
                      <Button
                        variant={quizResults.passed ? "default" : "outline"}
                        className={cn(
                          "min-h-[48px] w-full rounded-xl font-extrabold",
                          quizResults.passed &&
                            cn(colors.bg, "text-white hover:brightness-110")
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
    </GameLayout>
  );
}
