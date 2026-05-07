"use client";

import { useState, useMemo, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  ClipboardCheck,
  CreditCard,
  Lightbulb,
  Lock,
  PiggyBank,
  Play,
  Receipt,
  Sparkles,
  TrendingUp,
  Wallet,
  AlertTriangle,
} from "lucide-react";
import { VideoEmbed } from "@/components/learn/video-embed";
import { cn } from "@/lib/utils";
import { Flashcard } from "@/components/game/flashcard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { LegalDisclaimer } from "@/components/shared/legal-disclaimer";
import { useGameState } from "@/hooks/use-game-state";
import { useLocalProgress } from "@/hooks/use-local-progress";
import { XP_PER_LESSON_COMPLETE } from "@/lib/constants/game-balance";
import type { Topic, Lesson, LessonSection } from "@/types/game";

import creditLessons from "@/content/lessons/credit.json";
import taxesLessons from "@/content/lessons/taxes.json";
import budgetingLessons from "@/content/lessons/budgeting.json";
import savingLessons from "@/content/lessons/saving.json";
import investingLessons from "@/content/lessons/investing.json";

/* -------------------------------------------------------------------------- */
/*  Data Maps                                                                 */
/* -------------------------------------------------------------------------- */

const lessonMap: Record<Topic, Lesson[]> = {
  credit: creditLessons as Lesson[],
  taxes: taxesLessons as Lesson[],
  budgeting: budgetingLessons as Lesson[],
  saving: savingLessons as Lesson[],
  investing: investingLessons as Lesson[],
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

const topicIcons: Record<Topic, React.ReactNode> = {
  credit: <CreditCard className="h-5 w-5" />,
  taxes: <Receipt className="h-5 w-5" />,
  budgeting: <Wallet className="h-5 w-5" />,
  saving: <PiggyBank className="h-5 w-5" />,
  investing: <TrendingUp className="h-5 w-5" />,
  insurance: <BookOpen className="h-5 w-5" />,
};

const topicColors: Record<
  Topic,
  {
    bg: string;
    light: string;
    text: string;
    border: string;
    headerBg: string;
    progressBg: string;
    ringColor: string;
  }
> = {
  credit: {
    bg: "bg-ink",
    light: "bg-paper-2",
    text: "text-ink",
    border: "border-paper-2",
    headerBg: "bg-ink",
    progressBg: "bg-ink",
    ringColor: "ring-paper-2",
  },
  taxes: {
    bg: "bg-accent",
    light: "bg-paper-2",
    text: "text-accent",
    border: "border-paper-2",
    headerBg: "bg-accent",
    progressBg: "bg-accent",
    ringColor: "ring-paper-2",
  },
  budgeting: {
    bg: "bg-accent",
    light: "bg-accent-soft",
    text: "text-accent",
    border: "border-accent-soft",
    headerBg: "bg-accent",
    progressBg: "bg-accent",
    ringColor: "ring-accent",
  },
  saving: {
    bg: "bg-ink",
    light: "bg-paper-2",
    text: "text-ink",
    border: "border-paper-2",
    headerBg: "bg-ink",
    progressBg: "bg-ink",
    ringColor: "ring-paper-2",
  },
  investing: {
    bg: "bg-ink",
    light: "bg-paper-2",
    text: "text-ink",
    border: "border-paper-2",
    headerBg: "bg-ink",
    progressBg: "bg-ink",
    ringColor: "ring-paper-2",
  },
  insurance: {
    bg: "bg-rose-500",
    light: "bg-rose-50",
    text: "text-rose-600",
    border: "border-rose-200",
    headerBg: "bg-rose-500",
    progressBg: "bg-rose-500",
    ringColor: "ring-rose-400",
  },
};

const VALID_TOPICS: Topic[] = ["credit", "taxes", "budgeting", "saving", "investing", "insurance"];

function isValidTopic(value: unknown): value is Topic {
  return typeof value === "string" && VALID_TOPICS.includes(value as Topic);
}

/* -------------------------------------------------------------------------- */
/*  Section Renderer                                                          */
/* -------------------------------------------------------------------------- */

function SectionRenderer({
  section,
  topic,
}: {
  section: LessonSection;
  topic: Topic;
}) {
  const colors = topicColors[topic];

  if (section.type === "text") {
    return (
      <motion.div
        className="flex flex-col gap-2"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
      >
        {section.title && (
          <h4 className="flex items-center gap-2 text-sm font-extrabold text-gray-900">
            <BookOpen className="h-4 w-4 text-gray-400" />
            {section.title}
          </h4>
        )}
        <p className="text-sm leading-relaxed text-gray-600">
          {section.content}
        </p>

        {/* Key takeaway callout for text sections */}
        {section.content.length > 200 && (
          <div className="mt-2 rounded-xl border border-gray-200 bg-gray-50 p-3">
            <p className="text-xs font-bold text-gray-600">
              <span className={cn("font-extrabold", colors.text)}>
                Key Takeaway:
              </span>{" "}
              {section.content.split(".").slice(0, 1).join(".")}.
            </p>
          </div>
        )}
      </motion.div>
    );
  }

  if (section.type === "flashcard") {
    return (
      <motion.div
        className="flex flex-col gap-2"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
      >
        {section.title && (
          <h4 className="flex items-center gap-2 text-sm font-extrabold text-gray-900">
            <Lightbulb className="h-4 w-4 text-accent" />
            {section.title}
          </h4>
        )}
        <Flashcard
          term={section.term ?? section.title ?? "Key Concept"}
          definition={section.definition ?? section.content}
          topic={topic}
        />
      </motion.div>
    );
  }

  if (section.type === "definition") {
    return (
      <motion.div
        className={cn(
          "flex flex-col gap-2 rounded-xl border-2 p-4",
          colors.border,
          colors.light
        )}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
      >
        <div className="flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-gray-500" />
          <span className={cn("text-sm font-extrabold", colors.text)}>
            {section.term}
          </span>
        </div>
        {section.definition && (
          <p className="text-sm font-bold leading-relaxed text-gray-900">
            {section.definition}
          </p>
        )}
        <p className="text-sm leading-relaxed text-gray-600">
          {section.content}
        </p>
      </motion.div>
    );
  }

  return null;
}

/* -------------------------------------------------------------------------- */
/*  Main Page                                                                 */
/* -------------------------------------------------------------------------- */

export default function TopicLessonsPage() {
  const params = useParams();
  const topicParam = params.topic;

  const { progress, updateXp, isLoaded: gameLoaded } = useGameState();
  const {
    completedLessons,
    isLoaded: localLoaded,
    markLessonComplete,
    getTopicProgress,
  } = useLocalProgress();

  const [expandedLessonId, setExpandedLessonId] = useState<string | null>(null);
  const [recentlyCompleted, setRecentlyCompleted] = useState<Set<string>>(
    new Set()
  );

  const isLoaded = gameLoaded && localLoaded;

  // Validate topic
  if (!isValidTopic(topicParam)) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4">
        <div className="flex flex-col items-center gap-4 py-20">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-100">
            <AlertTriangle className="h-8 w-8 text-red-500" />
          </div>
          <h2 className="text-xl font-extrabold text-gray-900">
            Topic Not Found
          </h2>
          <p className="text-center text-sm text-gray-500">
            The topic &quot;{String(topicParam)}&quot; doesn&apos;t exist.
          </p>
          <Link href="/learn">
            <Button className="mt-2 min-h-[48px] rounded-xl bg-accent font-extrabold text-white hover:bg-accent">
              Back to Learn Path
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const topic: Topic = topicParam;
  const lessons = lessonMap[topic].sort((a, b) => a.order - b.order);
  const colors = topicColors[topic];
  const topicLabel = topicLabels[topic];
  const topicIcon = topicIcons[topic];

  // Completed lesson IDs for this topic
  const completedIds = useMemo(() => {
    return new Set(
      completedLessons
        .filter((lc) => lc.topic === topic)
        .map((lc) => lc.lessonId)
    );
  }, [completedLessons, topic]);

  const topicProg = useMemo(
    () => getTopicProgress(topic),
    [getTopicProgress, topic]
  );

  const progressPercent =
    lessons.length > 0
      ? Math.round((topicProg.completedCount / lessons.length) * 100)
      : 0;

  const allLessonsComplete = topicProg.completedCount >= lessons.length;

  const handleToggleLesson = useCallback((lessonId: string) => {
    setExpandedLessonId((prev) => (prev === lessonId ? null : lessonId));
  }, []);

  const handleMarkComplete = useCallback(
    (lessonId: string) => {
      if (completedIds.has(lessonId)) return;

      markLessonComplete(topic, lessonId, 100);
      updateXp(XP_PER_LESSON_COMPLETE);
      setRecentlyCompleted((prev) => new Set(prev).add(lessonId));
    },
    [completedIds, markLessonComplete, topic, updateXp]
  );

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen flex-col bg-gray-50">
        <div className="mx-auto w-full max-w-2xl px-4 py-8">
          <Skeleton className="mb-4 h-8 w-full rounded-lg bg-gray-200" />
          {[0, 1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="mb-3 h-20 w-full rounded-xl bg-gray-200" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      {/* Header */}
      <motion.header
        className={cn("sticky top-0 z-30 shadow-md", colors.headerBg)}
        initial={{ y: -60 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      >
        <div className="mx-auto flex h-14 max-w-2xl items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <Link
              href="/learn"
              className="flex h-10 w-10 items-center justify-center rounded-lg text-white transition-colors hover:bg-white/20"
              aria-label="Back to Learn Path"
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
            <h1 className="text-lg font-extrabold tracking-tight text-white">
              {topicLabel} Lessons
            </h1>
          </div>
          <Badge className="bg-white/20 text-xs font-bold text-white">
            {topicProg.completedCount}/{lessons.length}
          </Badge>
        </div>
      </motion.header>

      {/* Content */}
      <div className="mx-auto w-full max-w-2xl flex-1 px-4 py-6">
        <motion.div
          className="flex flex-col gap-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-xs font-bold text-gray-400">
            <Link href="/learn" className="transition-colors hover:text-gray-700">
              Learn
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className={colors.text}>{topicLabel}</span>
          </div>

          {/* Progress Header */}
          <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg text-white", colors.bg)}>
                  {topicIcon}
                </div>
                <h2 className={cn("text-base font-extrabold", colors.text)}>
                  {topicLabel} Progress
                </h2>
              </div>
              <span className="text-xs font-bold text-gray-500 tabular-nums">
                {progressPercent}%
              </span>
            </div>
            <Progress
              value={progressPercent}
              color={colors.progressBg}
              height="h-3"
              showLabel
            />
          </div>

          {/* Lesson List */}
          <div className="flex flex-col gap-3">
            {lessons.map((lesson, index) => {
              const isCompleted =
                completedIds.has(lesson.id) ||
                recentlyCompleted.has(lesson.id);
              const isExpanded = expandedLessonId === lesson.id;
              const isJustCompleted = recentlyCompleted.has(lesson.id);

              return (
                <motion.div
                  key={lesson.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: index * 0.05,
                    type: "spring",
                    stiffness: 200,
                    damping: 20,
                  }}
                >
                  <div
                    className={cn(
                      "overflow-hidden rounded-xl border-2 bg-white shadow-sm transition-colors",
                      isCompleted ? "border-accent" : "border-gray-200",
                      isExpanded && "shadow-md"
                    )}
                  >
                    {/* Lesson Header (clickable) */}
                    <button
                      type="button"
                      className="flex w-full items-center gap-3 p-4 text-left transition-colors hover:bg-gray-50"
                      onClick={() => handleToggleLesson(lesson.id)}
                      aria-expanded={isExpanded}
                      aria-label={`${lesson.title}${isCompleted ? " (completed)" : ""}`}
                    >
                      <div
                        className={cn(
                          "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-extrabold text-white shadow-sm",
                          isCompleted ? "bg-accent" : colors.bg
                        )}
                      >
                        {isCompleted ? (
                          <CheckCircle className="h-5 w-5" />
                        ) : (
                          <span>{index + 1}</span>
                        )}
                      </div>
                      <div className="flex flex-1 flex-col gap-0.5">
                        <span className="text-sm font-extrabold text-gray-900">
                          {lesson.title}
                        </span>
                        <span className="text-xs text-gray-500">
                          Lesson {index + 1} of {lessons.length}
                          {lesson.difficulty !== "beginner" && (
                            <> &middot; {lesson.difficulty}</>
                          )}
                        </span>
                      </div>
                      <motion.div
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronDown className="h-5 w-5 text-gray-400" />
                      </motion.div>
                    </button>

                    {/* Expanded Lesson Content */}
                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <div className="flex flex-col gap-5 border-t border-gray-100 px-4 py-5">
                            {/* CEE Standard Badge */}
                            <Badge className="w-fit bg-gray-100 text-xs font-bold text-gray-600">
                              {lesson.ceeStandard}
                            </Badge>

                            {/* Render each section */}
                            {lesson.sections.map((section, sIdx) => (
                              <SectionRenderer
                                key={sIdx}
                                section={section}
                                topic={topic}
                              />
                            ))}

                            {/* Watch & Learn Videos */}
                            {lesson.videos && lesson.videos.length > 0 && (
                              <div className="flex flex-col gap-3">
                                <h4 className="flex items-center gap-2 text-sm font-extrabold text-foreground">
                                  <Play className="h-4 w-4 text-red-500" />
                                  Watch &amp; Learn
                                </h4>
                                {lesson.videos.map((video) => (
                                  <VideoEmbed key={video.youtubeId} video={video} />
                                ))}
                              </div>
                            )}

                            {/* Mark Complete Button */}
                            {!isCompleted ? (
                              <motion.div
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                              >
                                <Button
                                  className={cn(
                                    "min-h-[48px] w-full rounded-xl text-sm font-extrabold text-white",
                                    colors.bg,
                                    "hover:brightness-110"
                                  )}
                                  onClick={() =>
                                    handleMarkComplete(lesson.id)
                                  }
                                >
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  Mark Complete (+{XP_PER_LESSON_COMPLETE} XP)
                                </Button>
                              </motion.div>
                            ) : (
                              <motion.div
                                className="flex items-center gap-2 rounded-xl bg-accent-soft px-4 py-3"
                                initial={
                                  isJustCompleted
                                    ? { scale: 0.9, opacity: 0 }
                                    : undefined
                                }
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{
                                  type: "spring",
                                  stiffness: 300,
                                  damping: 20,
                                }}
                              >
                                <CheckCircle className="h-5 w-5 text-accent" />
                                <span className="text-sm font-extrabold text-accent">
                                  Lesson Complete!
                                </span>
                                {isJustCompleted && (
                                  <span className="ml-auto text-xs font-bold text-accent">
                                    +{XP_PER_LESSON_COMPLETE} XP{" "}
                                    <Sparkles className="inline h-3 w-3" />
                                  </span>
                                )}
                              </motion.div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Take Quiz CTA */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Link href={`/learn/quiz/${topic}`}>
              <div
                className={cn(
                  "flex min-h-[56px] items-center justify-center gap-2 rounded-2xl border-2 p-4 text-center shadow-md transition-all hover:shadow-lg",
                  allLessonsComplete
                    ? cn(colors.bg, "border-transparent text-white")
                    : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                )}
              >
                <ClipboardCheck className="h-5 w-5" />
                <span className="text-base font-extrabold">
                  {allLessonsComplete
                    ? `Take the ${topicLabel} Quiz!`
                    : `Take the ${topicLabel} Quiz`}
                </span>
                <ChevronRight className="h-5 w-5" />
              </div>
            </Link>
            {!allLessonsComplete && (
              <p className="mt-2 text-center text-xs font-semibold text-gray-500">
                Complete all lessons first for the best quiz score!
              </p>
            )}
          </motion.div>
        </motion.div>
      </div>

      {/* Legal disclaimer */}
      <div className="border-t border-gray-200 px-4 py-3">
        <LegalDisclaimer className="text-gray-500" />
      </div>
    </div>
  );
}
