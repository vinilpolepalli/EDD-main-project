import type {
  SimulatorState,
  MonthAllocation,
  MonthResult,
  LifeEvent,
} from "@/types/game";

import {
  SIMULATOR_STARTING_BALANCE_MIN,
  SIMULATOR_STARTING_BALANCE_MAX,
  SIMULATOR_SALARY_MIN,
  SIMULATOR_SALARY_MAX,
  SIMULATOR_BASE_EXPENSES,
  SIMULATOR_SAVINGS_INTEREST_RATE,
  SIMULATOR_INVESTMENT_RETURN_RATE,
  SIMULATOR_INVESTMENT_VOLATILITY,
  SIMULATOR_STARTING_CREDIT_SCORE,
  SIMULATOR_MIN_CREDIT_SCORE,
  SIMULATOR_MAX_CREDIT_SCORE,
  SIMULATOR_STARTING_HAPPINESS,
} from "@/lib/constants/game-balance";

import { LIFE_EVENTS } from "@/lib/constants/life-events";

// ---------------------------------------------------------------------------
// Deterministic Random Number Generator
// ---------------------------------------------------------------------------

/**
 * Simple seeded pseudo-random number generator (mulberry32).
 *
 * Returns a value in [0, 1). Using a seed makes the simulator fully
 * reproducible — the same seed always produces the same sequence of
 * "random" numbers. This is essential for:
 *   1. Fair gameplay — every player with the same seed faces the same events.
 *   2. Replay / review — teachers and parents can verify a run.
 *   3. Testing — deterministic output means deterministic test assertions.
 */
export function seededRandom(seed: number): number {
  // Mulberry32 algorithm — fast 32-bit PRNG with good distribution
  let t = (seed + 0x6d2b79f5) | 0;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

// ---------------------------------------------------------------------------
// Helper: clamp a value between min and max
// ---------------------------------------------------------------------------

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

// ---------------------------------------------------------------------------
// Initial State Generation
// ---------------------------------------------------------------------------

/**
 * Generates the starting state for a new Life Simulator run.
 *
 * Uses the provided seed (or Date.now()) to deterministically pick an age,
 * salary, and starting balance. This models the real-world fact that
 * everyone starts from a different financial position.
 *
 * @param seed  Optional seed for reproducibility. Defaults to Date.now().
 * @returns     A fresh SimulatorState ready for month 1.
 */
export function generateInitialState(seed?: number): SimulatorState {
  const baseSeed = seed ?? Date.now();

  // Use different offsets of the seed for each random value so they are
  // independent of each other.
  const ageRand = seededRandom(baseSeed);
  const salaryRand = seededRandom(baseSeed + 1);
  const balanceRand = seededRandom(baseSeed + 2);

  /**
   * Age range 22–45.
   * Starting at 22 (post-college) keeps scenarios relatable.
   * Capping at 45 keeps the game short enough to be fun.
   */
  const age = Math.floor(ageRand * (45 - 22 + 1)) + 22;

  /**
   * Monthly salary randomly chosen within the configured range.
   * This teaches kids that different jobs pay different amounts.
   */
  const salary =
    Math.round(
      (salaryRand * (SIMULATOR_SALARY_MAX - SIMULATOR_SALARY_MIN) +
        SIMULATOR_SALARY_MIN) /
        100
    ) * 100; // Round to nearest $100 for readability

  /**
   * Starting bank balance — the money you already have saved up.
   * Having some savings at the start models the real advantage of
   * starting adult life with an emergency fund.
   */
  const balance =
    Math.round(
      (balanceRand *
        (SIMULATOR_STARTING_BALANCE_MAX - SIMULATOR_STARTING_BALANCE_MIN) +
        SIMULATOR_STARTING_BALANCE_MIN) /
        100
    ) * 100;

  /**
   * Monthly fixed expenses are a percentage of salary.
   * In real life, essential expenses (rent, food, utilities, transport)
   * typically consume 40-60% of income.
   */
  const monthlyExpenses = Math.round(salary * SIMULATOR_BASE_EXPENSES);

  return {
    age,
    month: 1,
    salary,
    balance,
    debt: 0,
    creditScore: SIMULATOR_STARTING_CREDIT_SCORE,
    happiness: SIMULATOR_STARTING_HAPPINESS,
    monthlyExpenses,
    savingsAllocation: 0,
    spendingAllocation: 0,
    investingAllocation: 0,
    investments: 0,
    interestRate: SIMULATOR_SAVINGS_INTEREST_RATE,
    events: [],
  };
}

// ---------------------------------------------------------------------------
// Life Event Selection
// ---------------------------------------------------------------------------

/**
 * Deterministically selects a life event (or none) for this month.
 *
 * Uses the seed to generate a random number, then walks through the
 * event catalog checking each event's probability. This models real
 * life where unexpected things happen — some good, some bad — and
 * you can't predict which month they'll hit.
 *
 * @param state  Current simulator state (used for age filtering).
 * @param seed   Deterministic seed for this month's event roll.
 * @returns      A LifeEvent if one triggers, or null if nothing happens.
 */
export function selectLifeEvent(
  state: SimulatorState,
  seed: number
): LifeEvent | null {
  const roll = seededRandom(seed);

  // Filter events to those valid for the player's current age
  const eligibleEvents = LIFE_EVENTS.filter(
    (event) => state.age >= event.minAge && state.age <= event.maxAge
  );

  /**
   * Walk through events, accumulating probability.
   * When the cumulative probability exceeds our roll, that event fires.
   * This is a standard weighted-random-selection algorithm.
   */
  let cumulativeProbability = 0;
  for (const event of eligibleEvents) {
    cumulativeProbability += event.probability;
    if (roll < cumulativeProbability) {
      // Return a mutable copy so the caller can't mutate the catalog
      return { ...event };
    }
  }

  // No event triggered this month — a quiet month
  return null;
}

// ---------------------------------------------------------------------------
// Credit Score Calculation
// ---------------------------------------------------------------------------

/**
 * Calculates how the player's credit score changes this month based on
 * their financial behavior.
 *
 * Simplified FICO-like model for educational purposes:
 * - Saving a good portion of income → positive signal (payment reliability)
 * - Overspending (high spending allocation) → negative signal (high utilization)
 * - Having debt → negative signal
 * - Having investments → slight positive signal (asset diversity)
 *
 * Real FICO scores consider: payment history (35%), amounts owed (30%),
 * length of history (15%), new credit (10%), credit mix (10%).
 * We simplify this into saving vs spending behavior.
 *
 * @param state       Current simulator state.
 * @param allocation  How the player allocated their discretionary income.
 * @returns           Credit score change (positive or negative integer).
 */
export function calculateCreditScoreChange(
  state: SimulatorState,
  allocation: MonthAllocation
): number {
  const discretionaryIncome = state.salary - state.monthlyExpenses;

  // Guard against zero discretionary income to avoid division by zero
  if (discretionaryIncome <= 0) {
    return -5; // No discretionary income is a bad financial signal
  }

  /**
   * Savings ratio: fraction of discretionary income saved.
   * In real life, putting money aside shows lenders you're responsible.
   * A ratio above 0.3 (30%) is excellent.
   */
  const savingsRatio = allocation.savings / discretionaryIncome;

  /**
   * Spending ratio: fraction of discretionary income spent on wants.
   * High discretionary spending signals potential financial risk.
   */
  const spendingRatio = allocation.spending / discretionaryIncome;

  let scoreChange = 0;

  // Reward saving: up to +5 points for saving 30%+ of discretionary income
  if (savingsRatio >= 0.3) {
    scoreChange += 5;
  } else if (savingsRatio >= 0.15) {
    scoreChange += 2;
  }

  // Penalize overspending: -3 to -5 points for spending 70%+ on wants
  if (spendingRatio >= 0.8) {
    scoreChange -= 5;
  } else if (spendingRatio >= 0.7) {
    scoreChange -= 3;
  }

  /**
   * Debt penalty: having outstanding debt lowers your score.
   * In real life, high debt-to-income ratios are a major red flag.
   */
  if (state.debt > 0) {
    const debtToIncomeRatio = state.debt / state.salary;
    if (debtToIncomeRatio > 0.5) {
      scoreChange -= 5;
    } else if (debtToIncomeRatio > 0.2) {
      scoreChange -= 2;
    }
  }

  /**
   * Investment bonus: having investments shows financial maturity.
   * A small positive signal (+1) if investments exceed one month's salary.
   */
  if (state.investments > state.salary) {
    scoreChange += 1;
  }

  return scoreChange;
}

// ---------------------------------------------------------------------------
// Monthly Processing
// ---------------------------------------------------------------------------

/**
 * Processes a single month in the Life Simulator.
 *
 * This is the core game loop step. Each month:
 *   1. Receive salary (income)
 *   2. Pay fixed expenses (rent, food, utilities)
 *   3. Allocate remaining money (savings / spending / investing)
 *   4. Earn interest on savings
 *   5. Earn (or lose) returns on investments
 *   6. Roll for a random life event
 *   7. Apply event effects
 *   8. Update credit score based on behavior
 *   9. Clamp all stats to valid ranges
 *   10. Check for bankruptcy (balance <= 0)
 *
 * This models a simplified version of real monthly personal finance:
 * income - expenses - choices + returns +/- surprises = new balance.
 *
 * @param state       Current simulator state at the start of the month.
 * @param allocation  How the player wants to split discretionary income.
 * @param eventSeed   Seed for deterministic event selection this month.
 * @returns           Updated state and a detailed result summary.
 */
export function processMonth(
  state: SimulatorState,
  allocation: MonthAllocation,
  eventSeed: number
): { newState: SimulatorState; result: MonthResult } {
  // Snapshot "before" values for the result summary
  const balanceBefore = state.balance;
  const creditScoreBefore = state.creditScore;
  const happinessBefore = state.happiness;

  // Start building the new state (immutable update)
  let balance = state.balance;
  let investments = state.investments;
  let creditScore = state.creditScore;
  let happiness = state.happiness;
  let debt = state.debt;

  // -----------------------------------------------------------------------
  // Step 1: Receive salary
  // "Income is the money you earn from your job each month."
  // -----------------------------------------------------------------------
  balance += state.salary;

  // -----------------------------------------------------------------------
  // Step 2: Pay fixed expenses
  // "Fixed expenses are bills you MUST pay every month — rent, food,
  //  electricity, water, and transportation."
  // -----------------------------------------------------------------------
  balance -= state.monthlyExpenses;

  // -----------------------------------------------------------------------
  // Step 3: Apply player's allocation of discretionary income
  // "Discretionary income is the money left over after paying your bills.
  //  You choose how to split it between saving, spending, and investing."
  // -----------------------------------------------------------------------
  balance -= allocation.savings; // Money moves from checking to savings
  balance -= allocation.investing; // Money moves from checking to investments
  balance -= allocation.spending; // Money spent on wants (gone)

  // Track savings separately through balance (simplified model)
  // In this model, savings earn interest but stay in "balance"
  balance += allocation.savings; // Add savings back — they stay accessible

  // Investments are a separate bucket that grows (or shrinks) over time
  investments += allocation.investing;

  // Spending on wants provides a small happiness boost
  // "Treating yourself can make you happier, but too much spending is risky!"
  const discretionaryIncome = state.salary - state.monthlyExpenses;
  if (discretionaryIncome > 0) {
    const spendingRatio = allocation.spending / discretionaryIncome;
    happiness += Math.round(spendingRatio * 5); // Up to +5 happiness from spending
  }

  // -----------------------------------------------------------------------
  // Step 4: Calculate savings interest
  // "When you keep money in a savings account, the bank pays you interest —
  //  a small percentage of your balance — as a reward for keeping it there."
  // -----------------------------------------------------------------------
  const monthlyInterestRate = SIMULATOR_SAVINGS_INTEREST_RATE / 12;
  const interestEarned = Math.round(balance * monthlyInterestRate * 100) / 100;
  balance += interestEarned;

  // -----------------------------------------------------------------------
  // Step 5: Calculate investment returns
  // "Investments like stocks can grow your money faster than savings, but
  //  they can also lose value. The market goes up AND down."
  // -----------------------------------------------------------------------
  const baseMonthlyReturn = SIMULATOR_INVESTMENT_RETURN_RATE / 12;
  const volatilityRoll = seededRandom(eventSeed + 1000);
  // Map [0,1) to [-VOLATILITY, +VOLATILITY] range
  const volatilityFactor =
    (volatilityRoll * 2 - 1) * SIMULATOR_INVESTMENT_VOLATILITY;
  const actualMonthlyReturn = baseMonthlyReturn + baseMonthlyReturn * volatilityFactor;
  const investmentReturn =
    Math.round(investments * actualMonthlyReturn * 100) / 100;
  investments += investmentReturn;

  // Investments can't go below zero (you can't owe money on index funds)
  investments = Math.max(0, investments);

  // -----------------------------------------------------------------------
  // Step 6: Roll for a random life event
  // "Life is full of surprises! Some months, unexpected things happen —
  //  your car breaks down, you get a bonus, or your pet needs the vet."
  // -----------------------------------------------------------------------
  const event = selectLifeEvent(state, eventSeed);

  // -----------------------------------------------------------------------
  // Step 7: Apply event effects
  // -----------------------------------------------------------------------
  if (event !== null) {
    balance += event.balanceEffect;
    creditScore += event.creditScoreEffect;
    happiness += event.happinessEffect;
  }

  // -----------------------------------------------------------------------
  // Step 8: Update credit score based on this month's financial behavior
  // "Your credit score changes based on how responsibly you handle money.
  //  Saving is good. Overspending is risky. Paying bills on time is key."
  // -----------------------------------------------------------------------
  const behaviorCreditChange = calculateCreditScoreChange(state, allocation);
  creditScore += behaviorCreditChange;

  // -----------------------------------------------------------------------
  // Step 9: Clamp all stats to valid ranges
  // -----------------------------------------------------------------------
  creditScore = clamp(
    creditScore,
    SIMULATOR_MIN_CREDIT_SCORE,
    SIMULATOR_MAX_CREDIT_SCORE
  );
  happiness = clamp(happiness, 0, 100);

  // If balance goes negative, that's debt
  if (balance < 0) {
    debt += Math.abs(balance);
    balance = 0;
  }

  // Round balance to 2 decimal places (cents)
  balance = Math.round(balance * 100) / 100;
  investments = Math.round(investments * 100) / 100;

  // -----------------------------------------------------------------------
  // Step 10: Check bankruptcy
  // "If your bank balance hits zero and you have debt, you're bankrupt —
  //  that means you ran out of money and can't pay your bills."
  // -----------------------------------------------------------------------
  const isBankrupt = balance <= 0 && debt > 0;

  // Build the new state
  const newState: SimulatorState = {
    ...state,
    month: state.month + 1,
    balance,
    debt,
    creditScore,
    happiness,
    investments,
    savingsAllocation: allocation.savings,
    spendingAllocation: allocation.spending,
    investingAllocation: allocation.investing,
    events: event !== null ? [...state.events, event] : [...state.events],
  };

  // Build the result summary
  const result: MonthResult = {
    event,
    balanceBefore,
    balanceAfter: balance,
    creditScoreBefore,
    creditScoreAfter: creditScore,
    happinessBefore,
    happinessAfter: happiness,
    interestEarned,
    investmentReturn,
    isBankrupt,
  };

  return { newState, result };
}
