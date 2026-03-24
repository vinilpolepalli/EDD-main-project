import {
  XP_PER_ARCADE_BASE,
  XP_STREAK_MULTIPLIER,
  XP_STREAK_MAX_BONUS,
  ARCADE_COMBO_MULTIPLIER_STEP,
  ARCADE_MAX_COMBO_MULTIPLIER,
  ARCADE_COSMETIC_UNLOCK_THRESHOLD,
  ARCADE_TIME_LIMIT,
} from "@/lib/constants/game-balance";

// ---------------------------------------------------------------------------
// Score Calculation
// ---------------------------------------------------------------------------

/**
 * Calculates the final score for an arcade game round.
 *
 * Score = basePoints * comboMultiplier + timeBonus
 *
 * This models how real rewards compound:
 * - Consistent correct answers (combo) amplify your base performance.
 * - Speed (time bonus) rewards efficiency, just like being financially
 *   organized saves you time and money in real life.
 *
 * @param basePoints      Raw points earned from correct answers.
 * @param comboMultiplier Current combo multiplier (1x to 5x).
 * @param timeBonus       Bonus points from finishing with time left.
 * @returns               Final score (rounded to nearest integer).
 */
export function calculateScore(
  basePoints: number,
  comboMultiplier: number,
  timeBonus: number
): number {
  return Math.round(basePoints * comboMultiplier + timeBonus);
}

// ---------------------------------------------------------------------------
// Combo System
// ---------------------------------------------------------------------------

/**
 * Updates the combo counter based on whether the latest answer was correct.
 *
 * - Correct answer: combo increments by 1 (consecutive streak grows).
 * - Wrong answer: combo resets to 0 (streak broken).
 *
 * This teaches the concept of "streaks" — in real finance, consistent
 * good behavior (like paying bills on time every month) builds up your
 * reputation (credit score), but one missed payment can set you back.
 *
 * @param currentCombo Current number of consecutive correct answers.
 * @param isCorrect    Whether the latest answer was correct.
 * @returns            Updated combo count.
 */
export function updateCombo(currentCombo: number, isCorrect: boolean): number {
  if (isCorrect) {
    return currentCombo + 1;
  }
  // Wrong answer breaks the streak — just like a late payment resets trust
  return 0;
}

/**
 * Maps consecutive correct answers to a multiplier value.
 *
 * Starts at 1x and increases by ARCADE_COMBO_MULTIPLIER_STEP (0.25x) for
 * each consecutive correct answer, capped at ARCADE_MAX_COMBO_MULTIPLIER (5x).
 *
 * Example progression: 1x → 1.25x → 1.5x → 1.75x → 2x → ...
 *
 * This models compound growth — the longer you maintain a streak of good
 * decisions, the more each decision is worth. Similar to how compound
 * interest accelerates savings over time.
 *
 * @param consecutiveCorrect Number of correct answers in a row.
 * @returns                  Combo multiplier (1.0 to 5.0).
 */
export function getComboMultiplier(consecutiveCorrect: number): number {
  const multiplier = 1 + consecutiveCorrect * ARCADE_COMBO_MULTIPLIER_STEP;
  return Math.min(multiplier, ARCADE_MAX_COMBO_MULTIPLIER);
}

// ---------------------------------------------------------------------------
// Time Bonus
// ---------------------------------------------------------------------------

/**
 * Calculates bonus points based on how much time is left when the game ends.
 *
 * Players who answer quickly and still have time remaining earn up to 50%
 * of the base arcade XP as a bonus. This rewards efficiency — in real life,
 * being organized with your finances (like filing taxes early) often comes
 * with tangible benefits.
 *
 * Formula: bonus = baseArcadeXP * 0.5 * (timeRemaining / totalTime)
 *
 * @param timeRemaining Seconds left on the clock.
 * @param totalTime     Total game duration in seconds.
 * @returns             Bonus points (rounded to nearest integer).
 */
export function calculateTimeBonus(
  timeRemaining: number,
  totalTime: number = ARCADE_TIME_LIMIT
): number {
  if (totalTime <= 0 || timeRemaining <= 0) {
    return 0;
  }

  /**
   * Time bonus scales linearly with remaining time.
   * Max bonus = 50% of base arcade XP (when finishing with all time left,
   * which is practically impossible but sets the ceiling).
   */
  const timeFraction = Math.min(timeRemaining / totalTime, 1);
  return Math.round(XP_PER_ARCADE_BASE * 0.5 * timeFraction);
}

// ---------------------------------------------------------------------------
// XP Earned from Arcade
// ---------------------------------------------------------------------------

/**
 * Calculates total XP earned from an arcade game session.
 *
 * Base XP is modified by the player's daily streak. Consistent players
 * earn more — just like consistent savers earn more compound interest.
 *
 * Formula: XP = (baseArcadeXP + score/10) * streakMultiplier
 *
 * The score contribution is divided by 10 to keep arcade XP in line with
 * lesson/quiz XP so the token economy stays balanced.
 *
 * @param score      Final game score (from calculateScore).
 * @param streakDays Number of consecutive active days.
 * @returns          Total XP earned (rounded to nearest integer).
 */
export function calculateXpEarned(score: number, streakDays: number): number {
  /**
   * Streak bonus: each day adds 10% bonus XP, capped at +400% (5x total).
   * This incentivizes daily play, mirroring how regular saving habits
   * produce outsized results over time (compound growth).
   */
  const streakBonus = Math.min(
    streakDays * XP_STREAK_MULTIPLIER,
    XP_STREAK_MAX_BONUS
  );
  const streakMultiplier = 1 + streakBonus;

  const baseXp = XP_PER_ARCADE_BASE + Math.floor(score / 10);
  return Math.round(baseXp * streakMultiplier);
}

// ---------------------------------------------------------------------------
// Cosmetic Unlocks
// ---------------------------------------------------------------------------

/**
 * Determines whether the player should unlock a new cosmetic item.
 *
 * Cosmetics unlock every ARCADE_COSMETIC_UNLOCK_THRESHOLD XP (500 XP).
 * The check compares total XP against how many cosmetics are already
 * unlocked to see if a new threshold has been crossed.
 *
 * This models milestone rewards — like how reaching a savings goal
 * unlocks new opportunities (better interest rates, loan eligibility).
 *
 * @param totalXp       Player's total lifetime arcade XP.
 * @param unlockedCount Number of cosmetics already unlocked.
 * @returns             True if a new cosmetic should be awarded.
 */
export function shouldUnlockCosmetic(
  totalXp: number,
  unlockedCount: number
): boolean {
  /**
   * Number of cosmetics the player has earned based on their total XP.
   * E.g., 1200 XP / 500 threshold = 2 cosmetics earned.
   * If they only have 1 unlocked, they should get another one.
   */
  const earnedCount = Math.floor(totalXp / ARCADE_COSMETIC_UNLOCK_THRESHOLD);
  return earnedCount > unlockedCount;
}
