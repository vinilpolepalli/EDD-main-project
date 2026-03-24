"use client";

import { useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { CreditCard, Receipt, Wallet, ChevronRight, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { GameLayout } from "@/components/shared/game-layout";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useLocalProgress } from "@/hooks/use-local-progress";
import type { Topic } from "@/types/game";

import creditLessons from "@/content/lessons/credit.json";
import taxesLessons from "@/content/lessons/taxes.json";
import budgetingLessons from "@/content/lessons/budgeting.json";

interface TopicCardData {
  topic: Topic;
  title: string;
  description: string;
  icon: React.ReactNode;
  lessonCount: number;
  bgColor: string;
  lightBgColor: string;
  textColor: string;
  borderColor: string;
  progressColor: string;
}

const topicCards: TopicCardData[] = [
  {
    topic: "credit",
    title: "Credit",
    description: "Learn about credit scores, loans, interest rates, and building good credit habits.",
    icon: <CreditCard className="h-7 w-7" />,
    lessonCount: creditLessons.length,
    bgColor: "bg-emerald-500",
    lightBgColor: "bg-emerald-50",
    textColor: "text-emerald-600",
    borderColor: "border-emerald-300",
    progressColor: "bg-emerald-500",
  },
  {
    topic: "taxes",
    title: "Taxes",
    description: "Discover how taxes work, why we pay them, and different types of taxes you'll encounter.",
    icon: <Receipt className="h-7 w-7" />,
    lessonCount: taxesLessons.length,
    bgColor: "bg-teal-500",
    lightBgColor: "bg-teal-50",
    textColor: "text-teal-600",
    borderColor: "border-teal-300",
    progressColor: "bg-teal-500",
  },
  {
    topic: "budgeting",
    title: "Budgeting",
    description: "Master the art of managing your money with budgets, saving strategies, and smart spending.",
    icon: <Wallet className="h-7 w-7" />,
    lessonCount: budgetingLessons.length,
    bgColor: "bg-green-500",
    lightBgColor: "bg-green-50",
    textColor: "text-green-600",
    borderColor: "border-green-300",
    progressColor: "bg-green-500",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
} as const;

const item = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 200, damping: 20 },
  },
};

export default function LearnPage() {
  const { isLoaded, getTopicProgress } = useLocalProgress();

  const topicProgressMap = useMemo(() => {
    if (!isLoaded) return null;
    return {
      credit: getTopicProgress("credit"),
      taxes: getTopicProgress("taxes"),
      budgeting: getTopicProgress("budgeting"),
    };
  }, [isLoaded, getTopicProgress]);

  return (
    <GameLayout title="Learn Path" module="learn" backHref="/dashboard">
      {!isLoaded ? (
        <div className="flex flex-col gap-5">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-48 w-full rounded-2xl" />
          ))}
        </div>
      ) : (
        <motion.div
          className="flex flex-col gap-4"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {/* Section Header */}
          <motion.div variants={item} className="flex flex-col gap-1 pb-2">
            <h2 className="flex items-center gap-2 text-lg font-extrabold text-foreground">
              <BookOpen className="h-5 w-5 text-learn" />
              Choose a Topic
            </h2>
            <p className="text-sm font-semibold text-muted-foreground">
              Complete lessons and quizzes to earn XP and Arcade Tokens!
            </p>
          </motion.div>

          {/* Topic Cards */}
          {topicCards.map((card) => {
            const topicProg = topicProgressMap?.[card.topic];
            const completedCount = topicProg?.completedCount ?? 0;
            const progressPercent =
              card.lessonCount > 0
                ? Math.round((completedCount / card.lessonCount) * 100)
                : 0;
            const isComplete = completedCount >= card.lessonCount;
            const hasStarted = completedCount > 0;

            return (
              <motion.div key={card.topic} variants={item}>
                <Link href={`/learn/${card.topic}`} className="block">
                  <motion.div
                    className={cn(
                      "group relative overflow-hidden rounded-2xl border-2 bg-card shadow-md transition-shadow hover:shadow-lg",
                      isComplete ? "border-learn" : "border-border"
                    )}
                    whileHover={{ y: -3 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  >
                    {/* Top section with icon */}
                    <div className={cn("flex items-center gap-4 p-5 pb-3", card.lightBgColor)}>
                      <div
                        className={cn(
                          "flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-sm",
                          card.bgColor
                        )}
                      >
                        {card.icon}
                      </div>
                      <div className="flex flex-1 flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <h3 className={cn("text-xl font-extrabold", card.textColor)}>
                            {card.title}
                          </h3>
                          {isComplete && (
                            <Badge variant="learn" className="text-xs">
                              Complete
                            </Badge>
                          )}
                        </div>
                        <span className="text-xs font-bold text-muted-foreground">
                          {card.lessonCount} lessons
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex flex-col gap-4 p-5 pt-3">
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {card.description}
                      </p>

                      {/* Progress Bar */}
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center justify-between text-xs font-bold text-muted-foreground">
                          <span>
                            {completedCount} / {card.lessonCount} lessons done
                          </span>
                          <span className="tabular-nums">{progressPercent}%</span>
                        </div>
                        <Progress
                          value={progressPercent}
                          color={card.progressColor}
                          height="h-2.5"
                        />
                      </div>

                      {/* CTA Button */}
                      <div
                        className={cn(
                          "flex min-h-[48px] items-center justify-center gap-1.5 rounded-xl py-2.5 text-sm font-extrabold text-white transition-colors",
                          card.bgColor,
                          "group-hover:brightness-110"
                        )}
                      >
                        {isComplete
                          ? "Review"
                          : hasStarted
                            ? "Continue"
                            : "Start"}
                        <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                      </div>
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </GameLayout>
  );
}
