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
  Lightbulb,
  Sparkles,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { GameLayout } from "@/components/shared/game-layout";
import { Flashcard } from "@/components/game/flashcard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useGameState } from "@/hooks/use-game-state";
import { useLocalProgress } from "@/hooks/use-local-progress";
import { XP_PER_LESSON_COMPLETE } from "@/lib/constants/game-balance";
import type { Topic, Lesson, LessonSection } from "@/types/game";

import creditLessons from "@/content/lessons/credit.json";
import taxesLessons from "@/content/lessons/taxes.json";
import budgetingLessons from "@/content/lessons/budgeting.json";

const lessonMap: Record<Topic, Lesson[]> = {
  credit: creditLessons as Lesson[],
  taxes: taxesLessons as Lesson[],
  budgeting: budgetingLessons as Lesson[],
};

const topicLabels: Record<Topic, string> = {
  credit: "Credit",
  taxes: "Taxes",
  budgeting: "Budgeting",
};

const topicColors: Record<Topic, { bg: string; light: string; text: string; border: string }> = {
  credit: {
    bg: "bg-emerald-500",
    light: "bg-emerald-50",
    text: "text-emerald-600",
    border: "border-emerald-300",
  },
  taxes: {
    bg: "bg-teal-500",
    light: "bg-teal-50",
    text: "text-teal-600",
    border: "border-teal-300",
  },
  budgeting: {
    bg: "bg-green-500",
    light: "bg-green-50",
    text: "text-green-600",
    border: "border-green-300",
  },
};

const VALID_TOPICS: Topic[] = ["credit", "taxes", "budgeting"];

function isValidTopic(value: unknown): value is Topic {
  return typeof value === "string" && VALID_TOPICS.includes(value as Topic);
}

function SectionRenderer({
  section,
  topic,
}: {
  section: LessonSection;
  topic: Topic;
}) {
  if (section.type === "text") {
    return (
      <motion.div
        className="flex flex-col gap-2"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
      >
        {section.title && (
          <h4 className="flex items-center gap-2 text-base font-extrabold text-foreground">
            <BookOpen className="h-4 w-4 text-muted-foreground" />
            {section.title}
          </h4>
        )}
        <p className="text-sm leading-relaxed text-muted-foreground">
          {section.content}
        </p>
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
          <h4 className="flex items-center gap-2 text-base font-extrabold text-foreground">
            <Lightbulb className="h-4 w-4 text-arcade" />
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
          topicColors[topic].border,
          topicColors[topic].light
        )}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
      >
        <div className="flex items-center gap-2">
          <span className="text-lg">📖</span>
          <span className={cn("text-base font-extrabold", topicColors[topic].text)}>
            {section.term}
          </span>
        </div>
        {section.definition && (
          <p className="text-sm font-bold leading-relaxed text-foreground">
            {section.definition}
          </p>
        )}
        <p className="text-sm leading-relaxed text-muted-foreground">
          {section.content}
        </p>
      </motion.div>
    );
  }

  return null;
}

export default function TopicLessonsPage() {
  const params = useParams();
  const topicParam = params.topic;

  const { updateXp, isLoaded: gameLoaded } = useGameState();
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
      <GameLayout title="Invalid Topic" backHref="/learn">
        <div className="flex flex-col items-center justify-center gap-4 py-20">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-100">
            <AlertTriangle className="h-8 w-8 text-red-500" />
          </div>
          <h2 className="text-xl font-extrabold text-foreground">
            Topic Not Found
          </h2>
          <p className="text-center text-sm text-muted-foreground">
            The topic &quot;{String(topicParam)}&quot; doesn&apos;t exist. Please choose a valid
            topic.
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
  const lessons = lessonMap[topic].sort((a, b) => a.order - b.order);
  const colors = topicColors[topic];
  const topicLabel = topicLabels[topic];

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

  return (
    <GameLayout
      title={`${topicLabel} Lessons`}
      module="learn"
      backHref="/learn"
    >
      {!isLoaded ? (
        <div className="flex flex-col gap-4">
          <Skeleton className="h-8 w-full rounded-lg" />
          {[0, 1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-20 w-full rounded-xl" />
          ))}
        </div>
      ) : (
        <motion.div
          className="flex flex-col gap-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {/* Progress Header */}
          <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className={cn("text-lg font-extrabold", colors.text)}>
                {topicLabel} Progress
              </h2>
              <Badge variant="learn">
                {topicProg.completedCount}/{lessons.length}
              </Badge>
            </div>
            <Progress
              value={progressPercent}
              color={colors.bg}
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
                      "overflow-hidden rounded-xl border-2 bg-card shadow-sm transition-colors",
                      isCompleted ? "border-learn" : "border-border",
                      isExpanded && "shadow-md"
                    )}
                  >
                    {/* Lesson Header (clickable) */}
                    <button
                      type="button"
                      className="flex w-full items-center gap-3 p-4 text-left hover:bg-muted/50"
                      onClick={() => handleToggleLesson(lesson.id)}
                      aria-expanded={isExpanded}
                      aria-label={`${lesson.title}${isCompleted ? " (completed)" : ""}`}
                    >
                      <div
                        className={cn(
                          "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-extrabold text-white shadow-sm",
                          isCompleted ? "bg-learn" : colors.bg
                        )}
                      >
                        {isCompleted ? (
                          <CheckCircle className="h-5 w-5" />
                        ) : (
                          <span>{index + 1}</span>
                        )}
                      </div>
                      <div className="flex flex-1 flex-col gap-0.5">
                        <span className="text-sm font-extrabold text-foreground">
                          {lesson.title}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {lesson.sections.length} sections
                          {lesson.difficulty !== "beginner" && (
                            <> &middot; {lesson.difficulty}</>
                          )}
                        </span>
                      </div>
                      <motion.div
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronDown className="h-5 w-5 text-muted-foreground" />
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
                          <div className="flex flex-col gap-5 border-t border-border px-4 py-5">
                            {/* CEE Standard Badge */}
                            <Badge variant="default" className="w-fit text-xs">
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
                                className="flex items-center gap-2 rounded-xl bg-learn-light px-4 py-3"
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
                                <CheckCircle className="h-5 w-5 text-learn" />
                                <span className="text-sm font-extrabold text-learn">
                                  Lesson Complete!
                                </span>
                                {isJustCompleted && (
                                  <span className="ml-auto text-xs font-bold text-learn">
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
                  "flex min-h-[56px] items-center justify-center gap-2 rounded-2xl border-2 p-4 text-center shadow-md transition-shadow hover:shadow-lg",
                  allLessonsComplete
                    ? cn(colors.bg, "border-transparent text-white")
                    : "border-border bg-card text-foreground"
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
              <p className="mt-2 text-center text-xs font-semibold text-muted-foreground">
                Complete all lessons first for the best quiz score!
              </p>
            )}
          </motion.div>
        </motion.div>
      )}
    </GameLayout>
  );
}
