import type {
  SimulatorState,
  MonthAllocation,
  MonthResult,
  LifeEvent,
  LifeScenario,
  ActivityEntry,
} from "@/types/game";

import {
  SIMULATOR_TAX_RATE,
  SIMULATOR_DEBT_SPIRAL_AMOUNT,
  SIMULATOR_DEBT_SPIRAL_RATE,
  SIMULATOR_BANKRUPTCY_RATIO,
  SIMULATOR_EMERGENCY_FUND_INTEREST,
  SIMULATOR_SAVINGS_INTEREST,
  SIMULATOR_INVESTMENT_RETURN,
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
// Life Stage Calculation
// ---------------------------------------------------------------------------

/**
 * Determines the player's life stage based on months survived and net worth.
 *
 * Life stages are like "achievement tiers" that give the player a sense
 * of progression — similar to BitLife's age-based milestones but focused
 * on financial growth rather than just time passing.
 */
export function getLifeStage(months: number, netWorth: number): string {
  if (netWorth > 50000) return "Financial Wizard";
  if (netWorth > 20000) return "Building Wealth";
  if (months < 6) return "Just Starting Out";
  if (months < 12) return "Finding My Footing";
  if (months < 24 && netWorth > 0) return "Building Momentum";
  if (months < 36 && netWorth > 5000) return "Getting Established";
  return "Surviving";
}

// ---------------------------------------------------------------------------
// Initial State Generation
// ---------------------------------------------------------------------------

/**
 * Generates the starting state for a new Life Simulator run.
 *
 * Takes a LifeScenario that defines the player's starting conditions.
 * For the "surprise" scenario, values are randomized using the seed.
 *
 * @param scenario  The selected life scenario defining starting conditions.
 * @param seed      Optional seed for reproducibility. Defaults to Date.now().
 * @returns         A fresh SimulatorState ready for month 1.
 */
export function generateInitialState(
  scenario: LifeScenario,
  seed?: number
): SimulatorState {
  const baseSeed = seed ?? Date.now();

  let age = scenario.age;
  let salary = scenario.salary;
  let startingBalance = scenario.startingBalance;
  let startingDebt = scenario.startingDebt;
  let startingExpenses = scenario.startingExpenses;
  let debtLabel = scenario.debtLabel;
  let debtInterestRate = scenario.debtInterestRate;

  // For the "surprise" scenario, randomize all values
  if (scenario.id === "surprise") {
    const ageRand = seededRandom(baseSeed);
    const salaryRand = seededRandom(baseSeed + 1);
    const balanceRand = seededRandom(baseSeed + 2);
    const debtRand = seededRandom(baseSeed + 3);

    age = Math.floor(ageRand * (45 - 22 + 1)) + 22;
    salary =
      Math.round(
        (salaryRand * (6000 - 2000) + 2000) / 100
      ) * 100;
    startingBalance =
      Math.round(
        (balanceRand * (5000 - 500) + 500) / 100
      ) * 100;
    startingDebt =
      Math.round(
        (debtRand * (20000 - 0)) / 1000
      ) * 1000;

    startingExpenses = Math.round(salary * 0.4);

    const debtTypes = [
      { label: "Student Loans", rate: 0.0042 },
      { label: "Car Loan", rate: 0.005 },
      { label: "Credit Card Debt", rate: 0.015 },
      { label: "Personal Loan", rate: 0.008 },
    ];
    const debtTypeIndex = Math.floor(seededRandom(baseSeed + 4) * debtTypes.length);
    debtLabel = debtTypes[debtTypeIndex].label;
    debtInterestRate = debtTypes[debtTypeIndex].rate;
  }

  const initialActivityLog: ActivityEntry[] = [
    {
      month: 0,
      type: "milestone",
      text: `Started a new financial journey as a ${scenario.label}!`,
      emoji: scenario.emoji || "\uD83D\uDE80",
      positivity: "positive",
    },
  ];

  return {
    age,
    month: 1,
    salary,
    balance: startingBalance,
    debt: startingDebt,
    creditScore: SIMULATOR_STARTING_CREDIT_SCORE,
    happiness: SIMULATOR_STARTING_HAPPINESS,
    monthlyExpenses: startingExpenses,
    savingsAllocation: 0,
    spendingAllocation: 0,
    investingAllocation: 0,
    investments: 0,
    interestRate: SIMULATOR_SAVINGS_INTEREST,
    events: [],

    // New BitLife-inspired fields
    emergencyFund: 0,
    taxesWithheld: 0,
    netWorthHistory: [],
    activityLog: initialActivityLog,
    scenarioId: scenario.id,
    goalId: scenario.goalId,
    temporaryIncomeMod: 1.0,
    temporaryIncomeDuration: 0,
    housingType: "renting",
    pendingChoiceEvent: null,
    lifeStage: "Just Starting Out",
    debtLabel,
    debtInterestRate,
    startingBalance,
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
      return {
        ...event,
        choices: event.choices
          ? event.choices.map((c) => ({ ...c, effects: { ...c.effects } }))
          : undefined,
      };
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
 * - Saving a good portion of income -> positive signal (payment reliability)
 * - Overspending (high spending allocation) -> negative signal (high utilization)
 * - Having debt -> negative signal
 * - Having investments -> slight positive signal (asset diversity)
 * - Debt repayment -> positive signal (each $100 repaid = +0.5 credit)
 *
 * Real FICO scores consider: payment history (35%), amounts owed (30%),
 * length of history (15%), new credit (10%), credit mix (10%).
 * We simplify this into saving vs spending behavior + debt repayment rewards.
 */
export function calculateCreditScoreChange(
  state: SimulatorState,
  allocation: MonthAllocation
): number {
  const discretionaryIncome =
    state.salary * (1 - SIMULATOR_TAX_RATE) - state.monthlyExpenses;

  // Guard against zero discretionary income to avoid division by zero
  if (discretionaryIncome <= 0) {
    return -5; // No discretionary income is a bad financial signal
  }

  const totalAllocated =
    allocation.savings +
    allocation.spending +
    allocation.investing +
    allocation.emergencyFund;

  /**
   * Savings ratio: fraction of discretionary income saved (including emergency fund).
   * In real life, putting money aside shows lenders you're responsible.
   */
  const savingsRatio =
    (allocation.savings + allocation.emergencyFund) /
    Math.max(1, totalAllocated);

  /**
   * Spending ratio: fraction of discretionary income spent on wants.
   * High discretionary spending signals potential financial risk.
   */
  const spendingRatio = allocation.spending / Math.max(1, totalAllocated);

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

  /**
   * Debt repayment reward: each $100 of extra debt payment earns +0.5 credit.
   * This teaches that actively paying down debt improves your credit.
   */
  if (allocation.debtPayment > 0) {
    scoreChange += Math.floor(allocation.debtPayment / 100) * 0.5;
  }

  return scoreChange;
}

// ---------------------------------------------------------------------------
// Monthly Processing
// ---------------------------------------------------------------------------

/**
 * Processes a single month in the Life Simulator.
 *
 * This is the core game loop step — the BitLife-style "Age +" action.
 * Each month:
 *   1. Apply temporary income modifier (job loss, etc.)
 *   2. Calculate gross income and withhold taxes (22%)
 *   3. Deduct fixed expenses
 *   4. Accrue interest on existing debt
 *   5. Apply player's allocation (savings/spending/investing/emergency/debt)
 *   6. Calculate interest on savings and emergency fund
 *   7. Calculate investment returns (with volatility)
 *   8. Roll for a life event (or resolve a pending choice)
 *   9. Apply event/choice effects (emergency fund absorbs negative first)
 *  10. Update credit score
 *  11. Check for debt spiral / bankruptcy
 *  12. Age up every 12 months
 *  13. Update life stage and activity log
 *
 * @param state       Current simulator state at the start of the month.
 * @param allocation  How the player wants to split discretionary income.
 * @param eventSeed   Seed for deterministic event selection this month.
 * @param choiceId    If resolving a pending choice event, the selected choice ID.
 * @returns           Updated state and a detailed result summary.
 */
export function processMonth(
  state: SimulatorState,
  allocation: MonthAllocation,
  eventSeed: number,
  choiceId?: string
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
  let emergencyFund = state.emergencyFund;
  let salary = state.salary;
  let monthlyExpenses = state.monthlyExpenses;
  let temporaryIncomeMod = state.temporaryIncomeMod;
  let temporaryIncomeDuration = state.temporaryIncomeDuration;
  let pendingChoiceEvent: LifeEvent | null = state.pendingChoiceEvent;
  const activityLog: ActivityEntry[] = [...state.activityLog];
  let debtLabel = state.debtLabel;
  let debtInterestRate = state.debtInterestRate;
  let emergencyFundUsed = 0;
  let choiceExplanation: string | null = null;
  let debtSpiral = false;

  // -----------------------------------------------------------------------
  // Step 0: If resolving a pending choice, apply it now
  // -----------------------------------------------------------------------
  if (choiceId && pendingChoiceEvent?.choices) {
    const chosen = pendingChoiceEvent.choices.find((c) => c.id === choiceId);
    if (chosen) {
      // Apply choice effects
      const fx = chosen.effects;
      balance += fx.balance ?? 0;
      debt += fx.debt ?? 0;

      // Negative debt effect means paying off debt
      if ((fx.debt ?? 0) < 0) {
        debt = Math.max(0, debt);
      }

      creditScore += fx.creditScore ?? 0;
      happiness += fx.happiness ?? 0;
      investments += fx.investments ?? 0;
      emergencyFund += fx.emergencyFund ?? 0;

      if (fx.salaryMod) salary += fx.salaryMod;
      if (fx.expensesMod) monthlyExpenses += fx.expensesMod;
      if (fx.temporaryIncomeMod !== undefined) {
        temporaryIncomeMod = fx.temporaryIncomeMod;
        temporaryIncomeDuration = fx.temporaryIncomeDuration ?? 3;
      }

      choiceExplanation = chosen.explanation;

      activityLog.push({
        month: state.month,
        type: "choice",
        text: `${pendingChoiceEvent.name}: Chose "${chosen.label}" \u2014 ${chosen.explanation}`,
        emoji: pendingChoiceEvent.category === "positive" ? "\u2705" : "\u26A0\uFE0F",
        positivity:
          (fx.balance ?? 0) + (fx.investments ?? 0) - (fx.debt ?? 0) >= 0
            ? "positive"
            : "negative",
      });
    }
    pendingChoiceEvent = null;
  }

  // -----------------------------------------------------------------------
  // Step 1: Apply temporary income modifier (e.g., job loss)
  // -----------------------------------------------------------------------
  let effectiveSalary = salary;
  if (temporaryIncomeDuration > 0) {
    effectiveSalary = Math.round(salary * temporaryIncomeMod);
    temporaryIncomeDuration -= 1;
    if (temporaryIncomeDuration <= 0) {
      temporaryIncomeMod = 1.0;

      activityLog.push({
        month: state.month,
        type: "milestone",
        text: "Income returned to normal!",
        emoji: "\uD83C\uDF89",
        positivity: "positive",
      });
    }
  }

  // -----------------------------------------------------------------------
  // Step 2: Calculate gross income and withhold taxes
  // "Taxes are money the government takes from your paycheck to pay for
  //  schools, roads, hospitals, and other public services."
  // -----------------------------------------------------------------------
  const grossIncome = effectiveSalary;
  const taxesThisMonth = Math.round(grossIncome * SIMULATOR_TAX_RATE);
  const netIncome = grossIncome - taxesThisMonth;

  // -----------------------------------------------------------------------
  // Step 3: Pay fixed expenses
  // "Fixed expenses are bills you MUST pay every month — rent, food,
  //  electricity, water, and transportation."
  // -----------------------------------------------------------------------
  const afterExpenses = netIncome - monthlyExpenses;

  // Add income and subtract expenses from balance
  balance += afterExpenses;

  // -----------------------------------------------------------------------
  // Step 4: Accrue interest on existing debt
  // "When you owe money (debt), you're charged interest — a percentage
  //  of what you owe, added to your total debt each month."
  // -----------------------------------------------------------------------
  let debtInterestThisMonth = 0;
  if (debt > 0) {
    debtInterestThisMonth = Math.round(debt * debtInterestRate * 100) / 100;
    debt += debtInterestThisMonth;
  }

  // -----------------------------------------------------------------------
  // Step 5: Apply player's allocation of discretionary income
  // -----------------------------------------------------------------------
  balance -= allocation.savings;
  balance -= allocation.investing;
  balance -= allocation.spending;
  balance -= allocation.emergencyFund;
  balance -= allocation.debtPayment;

  // Savings return to balance (they're accessible money)
  balance += allocation.savings;

  // Emergency fund is a separate bucket
  emergencyFund += allocation.emergencyFund;

  // Investments grow separately
  investments += allocation.investing;

  // Debt repayment reduces outstanding debt
  if (allocation.debtPayment > 0) {
    debt = Math.max(0, debt - allocation.debtPayment);
  }

  // Spending provides happiness
  const discretionaryIncome = Math.max(0, netIncome - monthlyExpenses);
  if (discretionaryIncome > 0 && allocation.spending > 0) {
    const spendingRatio = allocation.spending / discretionaryIncome;
    happiness += Math.round(spendingRatio * 5); // Up to +5 happiness from spending
  }

  // -----------------------------------------------------------------------
  // Step 6: Calculate savings interest
  // -----------------------------------------------------------------------
  const savingsInterest = Math.round(balance * SIMULATOR_SAVINGS_INTEREST * 100) / 100;
  balance += Math.max(0, savingsInterest);

  // Emergency fund earns interest too
  if (emergencyFund > 0) {
    const efInterest =
      Math.round(emergencyFund * SIMULATOR_EMERGENCY_FUND_INTEREST * 100) / 100;
    emergencyFund += efInterest;
  }

  const interestEarned = Math.max(0, savingsInterest);

  // -----------------------------------------------------------------------
  // Step 7: Calculate investment returns
  // -----------------------------------------------------------------------
  const baseMonthlyReturn = SIMULATOR_INVESTMENT_RETURN;
  const volatilityRoll = seededRandom(eventSeed + 1000);
  const volatilityFactor =
    (volatilityRoll * 2 - 1) * SIMULATOR_INVESTMENT_VOLATILITY;
  const actualMonthlyReturn = baseMonthlyReturn + baseMonthlyReturn * volatilityFactor;
  const investmentReturn =
    Math.round(investments * actualMonthlyReturn * 100) / 100;
  investments += investmentReturn;
  investments = Math.max(0, investments);

  // -----------------------------------------------------------------------
  // Step 8: Roll for a life event (if no pending choice event)
  // -----------------------------------------------------------------------
  let event: LifeEvent | null = null;
  let pendingChoice = false;

  if (!pendingChoiceEvent) {
    event = selectLifeEvent(state, eventSeed);

    if (event !== null) {
      if (event.choices && event.choices.length > 0) {
        // Choice-based event: don't apply effects yet, wait for player
        pendingChoiceEvent = event;
        pendingChoice = true;

        activityLog.push({
          month: state.month,
          type: "event",
          text: `${event.name}: ${event.description}`,
          emoji:
            event.category === "positive"
              ? "\uD83D\uDFE2"
              : event.category === "negative"
                ? "\uD83D\uDD34"
                : "\uD83D\uDFE1",
          positivity: event.category === "positive" ? "positive" : event.category === "negative" ? "negative" : "neutral",
        });
      } else {
        // Auto-apply event
        let eventBalanceEffect = event.balanceEffect;

        // Special handling for job-loss events — apply temporary income mod
        if (event.id === "job-loss") {
          temporaryIncomeMod = 0.4;
          temporaryIncomeDuration = 3;
        }

        // Special handling for investment crash — multiply investments
        if (event.id === "investment-crash") {
          const investmentLoss = Math.round(investments * 0.15);
          investments -= investmentLoss;
          investments = Math.max(0, investments);
        }

        // Special handling for student loan forgiveness — reduce debt
        if (event.id === "student-loan-forgiveness" && debt > 0) {
          debt = Math.max(0, debt - 2000);
        }

        // If event has a negative balance effect, try emergency fund first
        if (eventBalanceEffect < 0) {
          const absEffect = Math.abs(eventBalanceEffect);
          if (emergencyFund >= absEffect) {
            emergencyFund -= absEffect;
            emergencyFundUsed = absEffect;
            eventBalanceEffect = 0; // Emergency fund covered it!

            activityLog.push({
              month: state.month,
              type: "event",
              text: `Emergency fund covered the $${absEffect} expense from "${event.name}"!`,
              emoji: "\uD83D\uDEE1\uFE0F",
              positivity: "positive",
            });
          } else if (emergencyFund > 0) {
            emergencyFundUsed = emergencyFund;
            eventBalanceEffect += emergencyFund; // Partially covered
            emergencyFund = 0;

            activityLog.push({
              month: state.month,
              type: "event",
              text: `Emergency fund covered $${emergencyFundUsed} of the "${event.name}" expense.`,
              emoji: "\uD83D\uDEE1\uFE0F",
              positivity: "neutral",
            });
          }
        }

        balance += eventBalanceEffect;
        creditScore += event.creditScoreEffect;
        happiness += event.happinessEffect;

        activityLog.push({
          month: state.month,
          type: "event",
          text: `${event.name}: ${event.description}`,
          emoji:
            event.category === "positive"
              ? "\uD83D\uDFE2"
              : event.category === "negative"
                ? "\uD83D\uDD34"
                : "\uD83D\uDFE1",
          positivity: event.category === "positive" ? "positive" : event.category === "negative" ? "negative" : "neutral",
        });
      }
    }
  }

  // -----------------------------------------------------------------------
  // Step 9: Update credit score based on this month's financial behavior
  // -----------------------------------------------------------------------
  const behaviorCreditChange = calculateCreditScoreChange(state, allocation);
  creditScore += behaviorCreditChange;

  // -----------------------------------------------------------------------
  // Step 10: Clamp all stats to valid ranges
  // -----------------------------------------------------------------------
  creditScore = clamp(
    creditScore,
    SIMULATOR_MIN_CREDIT_SCORE,
    SIMULATOR_MAX_CREDIT_SCORE
  );
  happiness = clamp(happiness, 0, 100);
  emergencyFund = Math.max(0, emergencyFund);

  // -----------------------------------------------------------------------
  // Step 11: Check for debt spiral and bankruptcy
  // -----------------------------------------------------------------------
  let isBankrupt = false;

  if (balance < 0) {
    // Try to cover with emergency fund
    if (emergencyFund >= Math.abs(balance)) {
      emergencyFund += balance; // balance is negative, so this subtracts
      balance = 0;
    } else if (emergencyFund > 0) {
      balance += emergencyFund;
      emergencyFund = 0;
    }

    // If still negative, enter debt spiral
    if (balance < 0) {
      debt += Math.abs(balance) + SIMULATOR_DEBT_SPIRAL_AMOUNT;
      debtInterestRate = Math.max(debtInterestRate, SIMULATOR_DEBT_SPIRAL_RATE);
      balance = SIMULATOR_DEBT_SPIRAL_AMOUNT; // Emergency credit
      debtSpiral = true;

      if (debtLabel === "" || debtLabel === "Student Loans" || debtLabel === "Car Loan") {
        debtLabel = `${debtLabel}${debtLabel ? " + " : ""}Emergency Credit`;
      }

      activityLog.push({
        month: state.month,
        type: "event",
        text: `Debt spiral! Borrowed $${SIMULATOR_DEBT_SPIRAL_AMOUNT} emergency credit at 24% APR.`,
        emoji: "\uD83D\uDEA8",
        positivity: "negative",
      });
    }

    // True bankruptcy check: debt > 3x monthly salary
    if (debt > salary * SIMULATOR_BANKRUPTCY_RATIO) {
      isBankrupt = true;
    }
  }

  // Round financial values
  balance = Math.round(balance * 100) / 100;
  investments = Math.round(investments * 100) / 100;
  emergencyFund = Math.round(emergencyFund * 100) / 100;
  debt = Math.round(debt * 100) / 100;

  // -----------------------------------------------------------------------
  // Step 12: Age up every 12 months
  // -----------------------------------------------------------------------
  const newAge = state.age + (state.month % 12 === 0 ? 1 : 0);

  // Reset yearly tax counter every 12 months
  const newTaxesWithheld =
    state.month % 12 === 0 ? taxesThisMonth : state.taxesWithheld + taxesThisMonth;

  // -----------------------------------------------------------------------
  // Step 13: Calculate net worth and update life stage
  // -----------------------------------------------------------------------
  const netWorth = balance + emergencyFund + investments - debt;
  const newNetWorthHistory = [...state.netWorthHistory, netWorth];
  const lifeStage = getLifeStage(state.month, netWorth);

  // Check for life stage milestone
  if (lifeStage !== state.lifeStage) {
    activityLog.push({
      month: state.month,
      type: "milestone",
      text: `Reached life stage: ${lifeStage}!`,
      emoji: "\u2B50",
      positivity: "positive",
    });
  }

  // Natural happiness decay toward 50 (equilibrium)
  if (happiness > 55) {
    happiness -= 1;
  } else if (happiness < 45) {
    happiness += 1;
  }

  // Build the new state
  const newState: SimulatorState = {
    ...state,
    age: newAge,
    month: state.month + 1,
    salary,
    balance,
    debt,
    creditScore,
    happiness,
    investments,
    monthlyExpenses,
    savingsAllocation: allocation.savings,
    spendingAllocation: allocation.spending,
    investingAllocation: allocation.investing,
    events: event !== null ? [...state.events, event] : [...state.events],
    emergencyFund,
    taxesWithheld: newTaxesWithheld,
    netWorthHistory: newNetWorthHistory,
    activityLog,
    temporaryIncomeMod,
    temporaryIncomeDuration,
    pendingChoiceEvent,
    lifeStage,
    debtLabel,
    debtInterestRate,
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
    pendingChoice,
    taxesThisMonth,
    debtInterestThisMonth,
    netWorth,
    emergencyFundUsed,
    choiceExplanation,
    debtSpiral,
  };

  return { newState, result };
}
