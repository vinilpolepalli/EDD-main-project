"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  BookOpen,
  Check,
  CreditCard,
  Flame,
  Lock,
  PiggyBank,
  Receipt,
  Shield,
  Sparkles,
  Star,
  Trophy,
  TrendingUp,
  Wallet,
  Zap,
  Lightbulb,
  Target,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { LegalDisclaimer } from "@/components/shared/legal-disclaimer";
import { useLocalProgress } from "@/hooks/use-local-progress";
import { useGameState } from "@/hooks/use-game-state";
import type { Topic, Lesson } from "@/types/game";

import creditLessons from "@/content/lessons/credit.json";
import taxesLessons from "@/content/lessons/taxes.json";
import budgetingLessons from "@/content/lessons/budgeting.json";
import savingLessons from "@/content/lessons/saving.json";
import investingLessons from "@/content/lessons/investing.json";
import insuranceLessons from "@/content/lessons/insurance.json";

/* -------------------------------------------------------------------------- */
/*  Types & Constants                                                         */
/* -------------------------------------------------------------------------- */

interface SectionConfig {
  topic: Topic;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  lessons: Lesson[];
  bgColor: string;
  ringColor: string;
  textColor: string;
  glowColor: string;
  bannerBg: string;
  bannerBorder: string;
}

const SECTIONS: SectionConfig[] = [
  {
    topic: "budgeting",
    title: "BUDGETING",
    subtitle: "Master the 50/30/20 Rule",
    icon: <Wallet className="h-5 w-5" />,
    lessons: (budgetingLessons as Lesson[]).sort((a, b) => a.order - b.order),
    bgColor: "bg-emerald-500",
    ringColor: "ring-emerald-400",
    textColor: "text-emerald-400",
    glowColor: "shadow-emerald-500/40",
    bannerBg: "bg-emerald-500/15",
    bannerBorder: "border-emerald-500/30",
  },
  {
    topic: "credit",
    title: "CREDIT",
    subtitle: "Build Your Credit Score",
    icon: <CreditCard className="h-5 w-5" />,
    lessons: (creditLessons as Lesson[]).sort((a, b) => a.order - b.order),
    bgColor: "bg-indigo-500",
    ringColor: "ring-indigo-400",
    textColor: "text-indigo-400",
    glowColor: "shadow-indigo-500/40",
    bannerBg: "bg-indigo-500/15",
    bannerBorder: "border-indigo-500/30",
  },
  {
    topic: "taxes",
    title: "TAXES",
    subtitle: "Understand Your Paycheck",
    icon: <Receipt className="h-5 w-5" />,
    lessons: (taxesLessons as Lesson[]).sort((a, b) => a.order - b.order),
    bgColor: "bg-amber-500",
    ringColor: "ring-amber-400",
    textColor: "text-amber-400",
    glowColor: "shadow-amber-500/40",
    bannerBg: "bg-amber-500/15",
    bannerBorder: "border-amber-500/30",
  },
  {
    topic: "saving",
    title: "SAVING",
    subtitle: "Build Your Safety Net",
    icon: <PiggyBank className="h-5 w-5" />,
    lessons: (savingLessons as Lesson[]).sort((a, b) => a.order - b.order),
    bgColor: "bg-cyan-500",
    ringColor: "ring-cyan-400",
    textColor: "text-cyan-400",
    glowColor: "shadow-cyan-500/40",
    bannerBg: "bg-cyan-500/15",
    bannerBorder: "border-cyan-500/30",
  },
  {
    topic: "investing",
    title: "INVESTING",
    subtitle: "Make Money Work for You",
    icon: <TrendingUp className="h-5 w-5" />,
    lessons: (investingLessons as Lesson[]).sort((a, b) => a.order - b.order),
    bgColor: "bg-violet-500",
    ringColor: "ring-violet-400",
    textColor: "text-violet-400",
    glowColor: "shadow-violet-500/40",
    bannerBg: "bg-violet-500/15",
    bannerBorder: "border-violet-500/30",
  },
  {
    topic: "insurance",
    title: "INSURANCE",
    subtitle: "Protect What Matters",
    icon: <Shield className="h-5 w-5" />,
    lessons: (insuranceLessons as Lesson[]).sort((a, b) => a.order - b.order),
    bgColor: "bg-rose-500",
    ringColor: "ring-rose-400",
    textColor: "text-rose-400",
    glowColor: "shadow-rose-500/40",
    bannerBg: "bg-rose-500/15",
    bannerBorder: "border-rose-500/30",
  },
];

const FUN_FACTS = [
  "Americans pay an average of $14,000 in taxes each year.",
  "A penny saved is more than a penny earned, because you don't pay tax on savings!",
  "The average credit score in the US is 715.",
  "Compound interest was called the 'eighth wonder of the world.'",
  "40% of Americans can't cover a $400 emergency expense.",
  "The average American pays $219/month in subscriptions.",
  "Your credit score can affect whether you can rent an apartment.",
  "The Rule of 72: divide 72 by your interest rate to see how fast money doubles.",
];

/* -------------------------------------------------------------------------- */
/*  Node position calculation — creates the winding path                      */
/* -------------------------------------------------------------------------- */

/**
 * Returns a horizontal offset class for each node index to
 * create a left-center-right winding path effect.
 */
function getNodeOffset(index: number): string {
  const pattern = index % 4;
  switch (pattern) {
    case 0:
      return "ml-0 mr-auto";
    case 1:
      return "mx-auto";
    case 2:
      return "ml-auto mr-0";
    case 3:
      return "mx-auto";
    default:
      return "mx-auto";
  }
}

/* -------------------------------------------------------------------------- */
/*  Sub-components                                                            */
/* -------------------------------------------------------------------------- */

function SectionHeader({
  section,
  completedCount,
  sectionIndex,
}: {
  section: SectionConfig;
  completedCount: number;
  sectionIndex: number;
}) {
  const totalNodes = section.lessons.length + 1; // lessons + quiz
  const progressPercent =
    totalNodes > 0 ? Math.round((completedCount / totalNodes) * 100) : 0;

  return (
    <motion.div
      className={cn(
        "mx-auto w-full max-w-md rounded-2xl border-2 px-5 py-4",
        section.bannerBg,
        section.bannerBorder
      )}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: sectionIndex * 0.15, type: "spring", stiffness: 200, damping: 20 }}
    >
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-xl text-white",
            section.bgColor
          )}
        >
          {section.icon}
        </div>
        <div className="flex-1">
          <p className="text-xs font-extrabold tracking-widest text-gray-500">
            SECTION {sectionIndex + 1}
          </p>
          <h2 className={cn("text-lg font-extrabold", section.textColor)}>
            {section.title}
          </h2>
          <p className="text-xs font-semibold text-gray-500">{section.subtitle}</p>
        </div>
      </div>
      <div className="mt-3 flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-xs font-bold text-gray-600">
          <span>
            {completedCount} / {totalNodes} complete
          </span>
          <span className="tabular-nums">{progressPercent}%</span>
        </div>
        <Progress value={progressPercent} color={section.bgColor} height="h-2" className="bg-gray-200" />
      </div>
    </motion.div>
  );
}

function LessonNode({
  lesson,
  section,
  nodeIndex,
  status,
  globalDelay,
}: {
  lesson: Lesson;
  section: SectionConfig;
  nodeIndex: number;
  status: "completed" | "current" | "locked";
  globalDelay: number;
}) {
  const offset = getNodeOffset(nodeIndex);
  const isQuizNode = false;

  const nodeContent = (
    <motion.div
      className={cn("flex w-16 flex-col items-center gap-1.5", offset)}
      initial={{ opacity: 0, y: 20, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        delay: globalDelay,
        type: "spring",
        stiffness: 200,
        damping: 18,
      }}
    >
      {/* Circle node */}
      <motion.div
        className={cn(
          "relative flex h-16 w-16 items-center justify-center rounded-full border-4 transition-all",
          status === "completed" &&
            "border-emerald-400 bg-emerald-500 text-white",
          status === "current" &&
            cn(
              "border-white/80",
              section.bgColor,
              "text-white ring-4",
              section.ringColor,
              "shadow-lg",
              section.glowColor
            ),
          status === "locked" &&
            "border-gray-300 bg-gray-100 text-gray-400"
        )}
        whileHover={status !== "locked" ? { scale: 1.1 } : undefined}
        whileTap={status !== "locked" ? { scale: 0.95 } : undefined}
        animate={
          status === "current"
            ? {
                boxShadow: [
                  "0 0 0 0 rgba(22, 163, 74, 0)",
                  "0 0 20px 4px rgba(22, 163, 74, 0.3)",
                  "0 0 0 0 rgba(22, 163, 74, 0)",
                ],
              }
            : undefined
        }
        transition={
          status === "current"
            ? { duration: 2, repeat: Infinity, ease: "easeInOut" }
            : undefined
        }
      >
        {status === "completed" ? (
          <Check className="h-7 w-7" strokeWidth={3} />
        ) : status === "locked" ? (
          <Lock className="h-5 w-5" />
        ) : (
          <BookOpen className="h-6 w-6" />
        )}
      </motion.div>

      {/* Label */}
      <span
        className={cn(
          "max-w-[5rem] text-center text-[10px] font-bold leading-tight",
          status === "locked" ? "text-gray-400" : "text-gray-700"
        )}
      >
        {lesson.title}
      </span>
    </motion.div>
  );

  if (status === "locked") {
    return nodeContent;
  }

  return (
    <Link href={`/learn/${section.topic}`} className="block">
      {nodeContent}
    </Link>
  );
}

function QuizNode({
  section,
  nodeIndex,
  status,
  globalDelay,
}: {
  section: SectionConfig;
  nodeIndex: number;
  status: "completed" | "current" | "locked";
  globalDelay: number;
}) {
  const offset = getNodeOffset(nodeIndex);

  const nodeContent = (
    <motion.div
      className={cn("flex w-20 flex-col items-center gap-1.5", offset)}
      initial={{ opacity: 0, y: 20, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        delay: globalDelay,
        type: "spring",
        stiffness: 200,
        damping: 18,
      }}
    >
      <motion.div
        className={cn(
          "relative flex h-20 w-20 items-center justify-center rounded-full border-4 transition-all",
          status === "completed" &&
            "border-amber-400 bg-amber-500 text-white",
          status === "current" &&
            "border-amber-300 bg-amber-500 text-white ring-4 ring-amber-400 shadow-lg shadow-amber-500/40",
          status === "locked" &&
            "border-gray-300 bg-gray-100 text-gray-400"
        )}
        whileHover={status !== "locked" ? { scale: 1.1 } : undefined}
        whileTap={status !== "locked" ? { scale: 0.95 } : undefined}
        animate={
          status === "current"
            ? {
                boxShadow: [
                  "0 0 0 0 rgba(245, 158, 11, 0)",
                  "0 0 20px 4px rgba(245, 158, 11, 0.3)",
                  "0 0 0 0 rgba(245, 158, 11, 0)",
                ],
              }
            : undefined
        }
        transition={
          status === "current"
            ? { duration: 2, repeat: Infinity, ease: "easeInOut" }
            : undefined
        }
      >
        {status === "completed" ? (
          <Trophy className="h-8 w-8" />
        ) : status === "locked" ? (
          <Lock className="h-6 w-6" />
        ) : (
          <Star className="h-8 w-8" />
        )}
      </motion.div>
      <span
        className={cn(
          "text-center text-[10px] font-extrabold tracking-wide",
          status === "locked" ? "text-gray-400" : "text-amber-500"
        )}
      >
        UNIT QUIZ
      </span>
    </motion.div>
  );

  if (status === "locked") {
    return nodeContent;
  }

  return (
    <Link href={`/learn/quiz/${section.topic}`} className="block">
      {nodeContent}
    </Link>
  );
}

function Sidebar({
  streak,
  totalXp,
  funFact,
}: {
  streak: number;
  totalXp: number;
  funFact: string;
}) {
  return (
    <div className="flex flex-col gap-4">
      {/* Streak */}
      <motion.div
        className="rounded-2xl border border-green-200 bg-white p-4 shadow-sm"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100">
            <Flame className="h-7 w-7 text-orange-500" />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-gray-900 tabular-nums">
              {streak}
            </p>
            <p className="text-xs font-bold text-gray-500">Day Streak</p>
          </div>
        </div>
      </motion.div>

      {/* XP */}
      <motion.div
        className="rounded-2xl border border-green-200 bg-white p-4 shadow-sm"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-100">
            <Zap className="h-7 w-7 text-yellow-500" />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-gray-900 tabular-nums">
              {totalXp.toLocaleString()}
            </p>
            <p className="text-xs font-bold text-gray-500">Total XP</p>
          </div>
        </div>
      </motion.div>

      {/* Daily Goal */}
      <motion.div
        className="rounded-2xl border border-green-200 bg-white p-4 shadow-sm"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-center gap-2 mb-2">
          <Target className="h-4 w-4 text-green-600" />
          <p className="text-xs font-extrabold text-green-600">DAILY GOAL</p>
        </div>
        <p className="text-sm font-bold text-gray-700">
          Complete 1 lesson today
        </p>
      </motion.div>

      {/* Fun Fact */}
      <motion.div
        className="rounded-2xl border border-green-200 bg-white p-4 shadow-sm"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-center gap-2 mb-2">
          <Lightbulb className="h-4 w-4 text-yellow-500" />
          <p className="text-xs font-extrabold text-yellow-600">DID YOU KNOW?</p>
        </div>
        <p className="text-sm font-semibold leading-relaxed text-gray-600">
          {funFact}
        </p>
      </motion.div>

      {/* Nav Links */}
      <motion.div
        className="flex flex-col gap-2"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Link
          href="/dashboard"
          className="flex min-h-[44px] items-center gap-2 rounded-xl border border-green-200 bg-white px-4 py-2.5 text-sm font-bold text-gray-700 transition-colors hover:bg-green-50"
        >
          <Sparkles className="h-4 w-4 text-green-600" />
          Dashboard
        </Link>
      </motion.div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Main Page Component                                                       */
/* -------------------------------------------------------------------------- */

export default function LearnPage() {
  const { isLoaded: localLoaded, completedLessons, getTopicProgress } =
    useLocalProgress();
  const { progress, isLoaded: gameLoaded } = useGameState();

  const isLoaded = localLoaded && gameLoaded;

  // Select a consistent fun fact based on the day
  const funFact = useMemo(() => {
    const dayOfYear = Math.floor(
      (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) /
        (1000 * 60 * 60 * 24)
    );
    return FUN_FACTS[dayOfYear % FUN_FACTS.length];
  }, []);

  // Build completion sets for each topic
  const completionData = useMemo(() => {
    if (!isLoaded) return null;

    const data: Record<Topic, Set<string>> = {
      budgeting: new Set<string>(),
      credit: new Set<string>(),
      taxes: new Set<string>(),
      saving: new Set<string>(),
      investing: new Set<string>(),
      insurance: new Set<string>(),
    };

    for (const lc of completedLessons) {
      data[lc.topic].add(lc.lessonId);
    }

    return data;
  }, [isLoaded, completedLessons]);

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen flex-col bg-green-50 -mx-4 -my-6 sm:-mx-6">
        <div className="mx-auto w-full max-w-5xl px-4 py-8">
          <div className="flex flex-col gap-6">
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} className="h-48 w-full rounded-2xl bg-green-100" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Track a running node counter for staggered animation delays
  let globalNodeIndex = 0;

  return (
    <div className="flex min-h-screen flex-col bg-green-50 -mx-4 -my-6 sm:-mx-6">
      {/* Header */}
      <motion.header
        className="sticky top-0 z-30 border-b border-green-200 bg-white/95 backdrop-blur-sm shadow-sm"
        initial={{ y: -60 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      >
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-green-100 hover:text-green-800"
              aria-label="Back to dashboard"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </Link>
            <h1 className="text-lg font-extrabold tracking-tight text-gray-900">
              Learn Path
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-sm font-bold text-orange-500">
              <Flame className="h-4 w-4" />
              <span className="tabular-nums">{progress.currentStreak}</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm font-bold text-yellow-600">
              <Zap className="h-4 w-4" />
              <span className="tabular-nums">
                {progress.totalXp.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Body: Path + Sidebar */}
      <div className="mx-auto flex w-full max-w-5xl flex-1 gap-8 px-4 py-8">
        {/* Main path area */}
        <div className="flex-1">
          <div className="mx-auto flex max-w-md flex-col gap-6">
            {SECTIONS.map((section, sectionIdx) => {
              const topicCompleted = completionData?.[section.topic] ?? new Set();
              const completedLessonCount = topicCompleted.size;

              // Determine status for each lesson node
              const lessonStatuses = section.lessons.map((lesson, idx) => {
                if (topicCompleted.has(lesson.id)) return "completed" as const;

                // Previous section must be fully complete to unlock this section
                if (sectionIdx > 0) {
                  const prevSection = SECTIONS[sectionIdx - 1];
                  const prevCompleted =
                    completionData?.[prevSection.topic] ?? new Set();
                  const prevAllDone =
                    prevCompleted.size >= prevSection.lessons.length;
                  if (!prevAllDone) return "locked" as const;
                }

                // Within this section, lessons unlock sequentially
                if (idx === 0) return "current" as const;
                const prevLesson = section.lessons[idx - 1];
                if (topicCompleted.has(prevLesson.id)) return "current" as const;
                return "locked" as const;
              });

              // Quiz unlocks after all lessons are complete
              const allLessonsDone =
                completedLessonCount >= section.lessons.length;
              const quizStatus: "completed" | "current" | "locked" = allLessonsDone
                ? "current"
                : "locked";

              // Section start index for animation
              const sectionStartIndex = globalNodeIndex;

              return (
                <div key={section.topic} className="flex flex-col gap-5">
                  {/* Section banner */}
                  <SectionHeader
                    section={section}
                    completedCount={completedLessonCount}
                    sectionIndex={sectionIdx}
                  />

                  {/* Lesson nodes */}
                  <div className="relative flex flex-col items-center gap-4 px-4">
                    {/* Vertical path line */}
                    <div className="absolute left-1/2 top-0 h-full w-0.5 -translate-x-1/2 bg-gradient-to-b from-green-300 via-green-200 to-green-100" />

                    {section.lessons.map((lesson, lessonIdx) => {
                      const delay = 0.05 * globalNodeIndex;
                      globalNodeIndex += 1;
                      return (
                        <div key={lesson.id} className="relative z-10 w-full">
                          <LessonNode
                            lesson={lesson}
                            section={section}
                            nodeIndex={lessonIdx}
                            status={lessonStatuses[lessonIdx]}
                            globalDelay={delay}
                          />
                        </div>
                      );
                    })}

                    {/* Quiz node */}
                    <div className="relative z-10 w-full">
                      <QuizNode
                        section={section}
                        nodeIndex={section.lessons.length}
                        status={quizStatus}
                        globalDelay={0.05 * globalNodeIndex}
                      />
                      {(() => {
                        globalNodeIndex += 1;
                        return null;
                      })()}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sidebar — hidden on mobile */}
        <aside className="hidden w-72 shrink-0 lg:block">
          <div className="sticky top-20">
            <Sidebar
              streak={progress.currentStreak}
              totalXp={progress.totalXp}
              funFact={funFact}
            />
          </div>
        </aside>
      </div>

      {/* Legal disclaimer */}
      <div className="border-t border-green-200 px-4 py-3 bg-white">
        <LegalDisclaimer className="text-gray-400" />
      </div>
    </div>
  );
}
