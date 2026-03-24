import type { GameId, ArcadeGameConfig } from "@/types/game";

// ---------------------------------------------------------------------------
// XP System
// ---------------------------------------------------------------------------

/** XP awarded for each correct answer on a knowledge-check quiz. */
export const XP_PER_QUIZ_CORRECT = 25;

/** XP awarded when a player completes an entire micro-lesson. */
export const XP_PER_LESSON_COMPLETE = 100;

/** Base XP earned from a single arcade game session (before multipliers). */
export const XP_PER_ARCADE_BASE = 50;

/**
 * Streak multiplier applied to XP earnings.
 * Each consecutive active day adds 10% bonus XP, capped at 5x total.
 * Formula: finalXP = baseXP * (1 + min(streakDays * XP_STREAK_MULTIPLIER, 4))
 * This teaches kids that consistency pays off — just like real saving habits.
 */
export const XP_STREAK_MULTIPLIER = 0.1;

/** Maximum total XP multiplier from streaks (1 + 4 = 5x). */
export const XP_STREAK_MAX_BONUS = 4;

// ---------------------------------------------------------------------------
// Token Economy
// ---------------------------------------------------------------------------

/** Arcade tokens earned when a player completes a lesson. */
export const TOKENS_PER_LESSON = 3;

/** Bonus arcade tokens earned for a perfect quiz score (100%). */
export const TOKENS_PER_QUIZ_PERFECT = 5;

/**
 * Cost in tokens to play each arcade game.
 * Budget Blitz and Tax Dash are entry-level (2 tokens).
 * Credit Rush is the premium game (3 tokens) because credit is the
 * most complex topic and the game is more rewarding.
 */
export const TOKEN_COST_ARCADE: Record<GameId, number> = {
  "budget-blitz": 2,
  "tax-dash": 2,
  "credit-rush": 3,
};

// ---------------------------------------------------------------------------
// Streak System
// ---------------------------------------------------------------------------

/**
 * Number of hours before a player's streak resets.
 * Set to 36 hours so a player who logs in every evening still keeps
 * their streak even if they're a few hours late the next day.
 */
export const STREAK_RESET_HOURS = 36;

// ---------------------------------------------------------------------------
// Life Simulator Constants
// ---------------------------------------------------------------------------

/** Minimum starting bank balance for a new simulator run ($). */
export const SIMULATOR_STARTING_BALANCE_MIN = 1000;

/** Maximum starting bank balance for a new simulator run ($). */
export const SIMULATOR_STARTING_BALANCE_MAX = 5000;

/** Minimum monthly salary for a new simulator run ($). */
export const SIMULATOR_SALARY_MIN = 2000;

/** Maximum monthly salary for a new simulator run ($). */
export const SIMULATOR_SALARY_MAX = 6000;

/**
 * Fraction of salary consumed by fixed monthly expenses (rent, food, utilities).
 * 40% is a simplified version of real-world essential spending ratios.
 */
export const SIMULATOR_BASE_EXPENSES = 0.4;

/**
 * Annual interest rate for savings accounts.
 * 4% is above the real-world average to make the reward for saving
 * visible within a short game session.
 */
export const SIMULATOR_SAVINGS_INTEREST_RATE = 0.04;

/**
 * Average annual return rate for investments (stocks, index funds).
 * 8% is close to the long-term S&P 500 historical average.
 */
export const SIMULATOR_INVESTMENT_RETURN_RATE = 0.08;

/**
 * Volatility range for investment returns.
 * Each month the actual return fluctuates by +/- 15% of the base rate,
 * teaching kids that investments can go up AND down.
 */
export const SIMULATOR_INVESTMENT_VOLATILITY = 0.15;

/**
 * Starting credit score for a new simulator run.
 * 650 is "fair" on the FICO scale — room to go up or down based on decisions.
 */
export const SIMULATOR_STARTING_CREDIT_SCORE = 650;

/** Floor for credit score (matches real-world FICO minimum). */
export const SIMULATOR_MIN_CREDIT_SCORE = 300;

/** Ceiling for credit score (matches real-world FICO maximum). */
export const SIMULATOR_MAX_CREDIT_SCORE = 850;

/**
 * Starting happiness on a 0-100 scale.
 * 70 is "content" — decisions move it up or down.
 */
export const SIMULATOR_STARTING_HAPPINESS = 70;

// ---------------------------------------------------------------------------
// Arcade Game Constants
// ---------------------------------------------------------------------------

/** Duration of a single arcade game round in seconds. */
export const ARCADE_TIME_LIMIT = 60;

/**
 * Each consecutive correct answer in an arcade game adds this to the
 * combo multiplier (e.g., 1x → 1.25x → 1.5x → ...).
 */
export const ARCADE_COMBO_MULTIPLIER_STEP = 0.25;

/** Maximum combo multiplier to prevent runaway scores. */
export const ARCADE_MAX_COMBO_MULTIPLIER = 5;

/**
 * Total XP threshold before a cosmetic reward unlocks.
 * Every 500 XP across all arcade games triggers a cosmetic unlock.
 */
export const ARCADE_COSMETIC_UNLOCK_THRESHOLD = 500;

// ---------------------------------------------------------------------------
// Level System
// ---------------------------------------------------------------------------

/**
 * Cumulative XP thresholds for each level.
 * Level 0 = 0 XP, Level 1 = 100 XP, etc.
 * The curve accelerates to keep progression challenging —
 * just like compound interest, growth gets steeper over time.
 */
export const LEVEL_XP_THRESHOLDS: readonly number[] = [
  0, 100, 300, 600, 1000, 1500, 2100, 2800, 3600, 4500, 5500,
];

// ---------------------------------------------------------------------------
// Arcade Game Configurations
// ---------------------------------------------------------------------------

/**
 * Full configuration for every arcade game.
 * Icons reference Lucide icon component names used in the UI.
 * Colors follow the module color-coding: green (budgeting), purple (taxes), gold (credit).
 */
export const ARCADE_GAMES: readonly ArcadeGameConfig[] = [
  {
    id: "budget-blitz",
    name: "Budget Blitz",
    description:
      "Sort items into needs vs wants before time runs out! Drag each item to the right category as fast as you can.",
    topic: "budgeting",
    tokenCost: 2,
    timeLimit: ARCADE_TIME_LIMIT,
    icon: "ShoppingCart",
    color: "#22C55E",
  },
  {
    id: "tax-dash",
    name: "Tax Dash",
    description:
      "Match each expense to the correct tax category at lightning speed! The faster you match, the higher your combo.",
    topic: "taxes",
    tokenCost: 2,
    timeLimit: ARCADE_TIME_LIMIT,
    icon: "Receipt",
    color: "#A855F7",
  },
  {
    id: "credit-rush",
    name: "Credit Rush",
    description:
      "Make rapid-fire credit decisions! Choose the action that helps your credit score in this fast-paced speed run.",
    topic: "credit",
    tokenCost: 3,
    timeLimit: ARCADE_TIME_LIMIT,
    icon: "CreditCard",
    color: "#F59E0B",
  },
] as const;
