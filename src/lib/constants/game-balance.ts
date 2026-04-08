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

/**
 * Fraction of gross salary taken as tax withholding each month.
 * 22% is a simplified combined federal + state tax rate for education.
 * This teaches kids that taxes reduce your take-home pay.
 */
export const SIMULATOR_TAX_RATE = 0.22;

/**
 * Amount of emergency credit issued when a player enters a debt spiral.
 * This models the real-world scenario of taking out a high-interest
 * emergency loan when you can't cover expenses.
 */
export const SIMULATOR_DEBT_SPIRAL_AMOUNT = 1000;

/**
 * Monthly interest rate on debt-spiral emergency credit (24% APR).
 * This is intentionally punishing to teach that emergency debt at
 * high interest rates creates a vicious cycle.
 */
export const SIMULATOR_DEBT_SPIRAL_RATE = 0.02;

/**
 * Ratio of debt to monthly salary that triggers true bankruptcy.
 * If debt > 3x monthly salary, the player is bankrupt.
 */
export const SIMULATOR_BANKRUPTCY_RATIO = 3;

/**
 * Monthly interest earned on emergency fund savings.
 * 2% APR / 12 = ~0.17%/month in a high-yield savings account.
 */
export const SIMULATOR_EMERGENCY_FUND_INTEREST = 0.02 / 12;

/**
 * Monthly interest earned on regular savings.
 * 4% APR / 12. Higher than reality to make saving visibly rewarding.
 */
export const SIMULATOR_SAVINGS_INTEREST = 0.04 / 12;

/**
 * Average monthly return on investments (stocks, index funds).
 * 8% APR / 12. Close to S&P 500 long-term historical average.
 */
export const SIMULATOR_INVESTMENT_RETURN = 0.08 / 12;

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

/** Duration of a single arcade game round in seconds. */
export const ARCADE_TIME_LIMIT = 60;

/**
 * Each consecutive correct answer in an arcade game adds this to the
 * combo multiplier (e.g., 1x -> 1.25x -> 1.5x -> ...).
 */
export const ARCADE_COMBO_MULTIPLIER_STEP = 0.25;

/** Maximum combo multiplier to prevent runaway scores. */
export const ARCADE_MAX_COMBO_MULTIPLIER = 5;

/**
 * Total XP threshold before a cosmetic reward unlocks.
 * Every 500 XP across all arcade games triggers a cosmetic unlock.
 */
export const ARCADE_COSMETIC_UNLOCK_THRESHOLD = 500;

/** Cost in tokens to play each arcade game. */
export const TOKEN_COST_ARCADE: Record<GameId, number> = {
  "budget-blitz": 2,
  "tax-dash": 2,
  "credit-rush": 3,
};

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
