import type { Topic, Lesson } from "@/types/game";

import {
  XP_PER_QUIZ_CORRECT,
  XP_PER_LESSON_COMPLETE,
  XP_STREAK_MULTIPLIER,
  XP_STREAK_MAX_BONUS,
  TOKENS_PER_LESSON,
  TOKENS_PER_QUIZ_PERFECT,
  STREAK_RESET_HOURS,
} from "@/lib/constants/game-balance";

// ---------------------------------------------------------------------------
// Quiz Scoring
// ---------------------------------------------------------------------------

/**
 * Grades a completed quiz by comparing the player's answers to the
 * correct answers.
 *
 * Passing threshold is 70% — this is a standard educational benchmark
 * that ensures kids actually learned the material before moving on.
 * If they fail, they review the flashcards and try again.
 *
 * @param answers        Array of the player's chosen option indices.
 * @param correctAnswers Array of the correct option indices.
 * @returns              Score breakdown including pass/fail status.
 */
export function calculateQuizScore(
  answers: number[],
  correctAnswers: number[]
): { score: number; total: number; percentage: number; passed: boolean } {
  const total = correctAnswers.length;

  if (total === 0) {
    return { score: 0, total: 0, percentage: 0, passed: false };
  }

  /**
   * Count correct answers by comparing each answer index to the
   * corresponding correct index. This is a simple equality check.
   */
  let score = 0;
  for (let i = 0; i < total; i++) {
    if (answers[i] === correctAnswers[i]) {
      score += 1;
    }
  }

  const percentage = Math.round((score / total) * 100);

  /**
   * 70% passing threshold.
   * In real school and in financial certification exams, you need to
   * demonstrate a minimum level of understanding before progressing.
   */
  const passed = percentage >= 70;

  return { score, total, percentage, passed };
}

// ---------------------------------------------------------------------------
// XP Calculation
// ---------------------------------------------------------------------------

/**
 * Calculates XP earned from a quiz based on score and daily streak.
 *
 * Each correct answer earns XP_PER_QUIZ_CORRECT (25 XP).
 * A passing score adds a lesson completion bonus (100 XP).
 * The daily streak multiplies everything — consistency is king.
 *
 * This models how knowledge compounds: the more you learn consistently,
 * the more valuable each new thing you learn becomes (like compound interest
 * on knowledge).
 *
 * @param score      Number of correct answers.
 * @param total      Total number of questions.
 * @param streakDays Number of consecutive active days.
 * @returns          Total XP earned (rounded to nearest integer).
 */
export function calculateXpEarned(
  score: number,
  total: number,
  streakDays: number
): number {
  /**
   * Base XP from correct answers.
   * Each correct answer = 25 XP, rewarding accuracy.
   */
  let xp = score * XP_PER_QUIZ_CORRECT;

  /**
   * Completion bonus: if the player passed (>= 70%), they earn the full
   * lesson completion bonus. This is like getting a diploma — you need
   * to actually pass to get the credential.
   */
  const percentage = total > 0 ? (score / total) * 100 : 0;
  if (percentage >= 70) {
    xp += XP_PER_LESSON_COMPLETE;
  }

  /**
   * Streak multiplier: each consecutive day adds 10% bonus, up to 5x.
   * Daily learners are rewarded just like daily savers — small consistent
   * actions compound into huge results over time.
   */
  const streakBonus = Math.min(
    streakDays * XP_STREAK_MULTIPLIER,
    XP_STREAK_MAX_BONUS
  );
  const streakMultiplier = 1 + streakBonus;

  return Math.round(xp * streakMultiplier);
}

// ---------------------------------------------------------------------------
// Token Calculation
// ---------------------------------------------------------------------------

/**
 * Calculates arcade tokens earned from completing a lesson quiz.
 *
 * Tokens are the currency for playing arcade games. They're earned by
 * learning, not by paying — this teaches kids that knowledge opens
 * doors (and games).
 *
 * - Passing the quiz → base tokens (TOKENS_PER_LESSON = 3)
 * - Perfect score (100%) → bonus tokens (TOKENS_PER_QUIZ_PERFECT = 5)
 * - Failing → 0 tokens (you need to learn the material first)
 *
 * @param score Number of correct answers.
 * @param total Total number of questions.
 * @returns     Number of arcade tokens earned.
 */
export function calculateTokensEarned(score: number, total: number): number {
  if (total === 0) {
    return 0;
  }

  const percentage = (score / total) * 100;

  // Must pass to earn any tokens — no shortcuts!
  if (percentage < 70) {
    return 0;
  }

  /**
   * Perfect score bonus: getting 100% right earns extra tokens.
   * This rewards mastery — in real life, truly understanding a
   * financial concept (vs. just passing) leads to better decisions.
   */
  if (percentage === 100) {
    return TOKENS_PER_LESSON + TOKENS_PER_QUIZ_PERFECT;
  }

  // Passed but not perfect — base token reward
  return TOKENS_PER_LESSON;
}

// ---------------------------------------------------------------------------
// Lesson Progression
// ---------------------------------------------------------------------------

/**
 * Finds the next uncompleted lesson in a topic, sorted by lesson order.
 *
 * Lessons are designed to be taken sequentially because each lesson
 * builds on the previous one — just like how you need to understand
 * what a budget IS before you can learn the 50/30/20 rule.
 *
 * @param completedLessonIds Array of lesson IDs the player has already completed.
 * @param topic              The topic to find the next lesson in.
 * @param lessons            Full array of available lessons.
 * @returns                  The next lesson to take, or null if all complete.
 */
export function getNextLesson(
  completedLessonIds: string[],
  topic: Topic,
  lessons: Lesson[]
): Lesson | null {
  // Filter to the requested topic and sort by intended order
  const topicLessons = lessons
    .filter((lesson) => lesson.topic === topic)
    .sort((a, b) => a.order - b.order);

  // Find the first lesson that hasn't been completed yet
  const completedSet = new Set(completedLessonIds);
  const nextLesson = topicLessons.find(
    (lesson) => !completedSet.has(lesson.id)
  );

  return nextLesson ?? null;
}

// ---------------------------------------------------------------------------
// Topic Progress
// ---------------------------------------------------------------------------

/**
 * Calculates a player's progress through a specific topic.
 *
 * Returns the count and percentage of completed lessons within the topic.
 * This provides the data for progress bars in the UI — visual progress
 * tracking is a proven motivator (like watching your savings account grow).
 *
 * @param completedLessonIds Array of lesson IDs the player has completed.
 * @param topic              The topic to check progress for.
 * @param totalLessons       Total number of lessons in this topic.
 * @returns                  Progress breakdown with completed count and percentage.
 */
export function getTopicProgress(
  completedLessonIds: string[],
  topic: Topic,
  totalLessons: number
): { completed: number; total: number; percentage: number } {
  if (totalLessons === 0) {
    return { completed: 0, total: 0, percentage: 0 };
  }

  /**
   * Count completed lessons by checking which IDs belong to this topic.
   * Lesson IDs follow the format "topic-N" (e.g., "credit-1").
   */
  const completed = completedLessonIds.filter((id) =>
    id.startsWith(`${topic}-`)
  ).length;

  const percentage = Math.round((completed / totalLessons) * 100);

  return { completed, total: totalLessons, percentage };
}

// ---------------------------------------------------------------------------
// Streak Management
// ---------------------------------------------------------------------------

/**
 * Calculates the player's updated streak based on their last active date.
 *
 * Streaks reward daily engagement:
 * - Same day login → streak stays, isNewDay = false
 * - Next day login (within STREAK_RESET_HOURS) → streak increments
 * - Gap longer than STREAK_RESET_HOURS → streak resets to 1
 *
 * This mirrors real financial habits: saving every day builds momentum,
 * but skipping too many days means starting over on building the habit.
 *
 * @param lastActiveDate ISO date string of last activity, or null for new players.
 * @param currentDate    ISO date string of the current date.
 * @returns              Updated streak count and whether this is a new day.
 */
export function updateStreak(
  lastActiveDate: string | null,
  currentDate: string
): { newStreak: number; isNewDay: boolean } {
  // Brand new player — start their first streak day
  if (lastActiveDate === null) {
    return { newStreak: 1, isNewDay: true };
  }

  const last = new Date(lastActiveDate);
  const current = new Date(currentDate);

  // Calculate the difference in hours between the two dates
  const diffMs = current.getTime() - last.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);

  /**
   * Same calendar day: player already logged in today.
   * Streak doesn't change, and we don't count it as a "new day"
   * for bonus purposes.
   */
  if (
    last.getFullYear() === current.getFullYear() &&
    last.getMonth() === current.getMonth() &&
    last.getDate() === current.getDate()
  ) {
    // Return 1 as minimum streak (player is active today)
    return { newStreak: Math.max(1, 1), isNewDay: false };
  }

  /**
   * Within the streak window: player came back within STREAK_RESET_HOURS.
   * Streak increments! Consistency pays off.
   */
  if (diffHours <= STREAK_RESET_HOURS) {
    // We need the previous streak to increment it, but this function
    // doesn't receive it — the caller tracks streak count in the database.
    // We return isNewDay: true so the caller knows to increment.
    return { newStreak: 1, isNewDay: true };
  }

  /**
   * Too long since last activity: streak resets.
   * In real life, inconsistent saving habits mean you lose the
   * momentum of compound growth.
   */
  return { newStreak: 1, isNewDay: true };
}
