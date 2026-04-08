import type { LifeScenario, SimulatorGoal, SimulatorState } from "@/types/game";

/**
 * Predefined life scenarios for the BitLife-inspired Life Simulator.
 *
 * Each scenario provides a different starting situation that teaches
 * different financial concepts:
 * - Fresh Grad: managing student debt on an entry-level salary
 * - Young Pro: building credit while handling a car loan
 * - Mid-Career: mortgage management with higher income/expenses
 * - Surprise: random situation that tests adaptability
 */
export const SCENARIOS: readonly LifeScenario[] = [
  {
    id: "fresh-grad",
    label: "Fresh Graduate",
    description:
      "Just graduated college. Entry-level job, student debt, but lots of potential!",
    emoji: "\uD83C\uDF93",
    age: 22,
    salary: 2800,
    startingBalance: 1200,
    startingDebt: 15000,
    debtLabel: "Student Loans",
    debtInterestRate: 0.0042, // ~5% APR / 12
    startingExpenses: 1100,
    goalId: "pay-off-debt",
  },
  {
    id: "young-pro",
    label: "Young Professional",
    description:
      "A few years into your career. Car payment, climbing the ladder.",
    emoji: "\uD83D\uDCBC",
    age: 28,
    salary: 4000,
    startingBalance: 3500,
    startingDebt: 8000,
    debtLabel: "Car Loan",
    debtInterestRate: 0.005, // 6% APR / 12
    startingExpenses: 1600,
    goalId: "credit-score-700",
  },
  {
    id: "mid-career",
    label: "Mid-Career",
    description:
      "Established career, mortgage, bigger paycheck \u2014 bigger responsibilities.",
    emoji: "\uD83C\uDFE0",
    age: 38,
    salary: 5500,
    startingBalance: 7000,
    startingDebt: 180000,
    debtLabel: "Mortgage",
    debtInterestRate: 0.0058, // 7% APR / 12
    startingExpenses: 2800,
    goalId: "build-investments",
  },
  {
    id: "surprise",
    label: "Surprise Me!",
    description:
      "Random age, salary, and life situation. Anything could happen!",
    emoji: "\uD83C\uDFB2",
    age: 0,
    salary: 0,
    startingBalance: 0,
    startingDebt: 0,
    debtLabel: "",
    debtInterestRate: 0.005,
    startingExpenses: 0,
    goalId: "survive-24",
  },
] as const;

/**
 * Goals give each simulator run a concrete objective.
 *
 * Each goal has a progress function (0-100) and a completion check.
 * This teaches kids that financial success means working toward
 * specific, measurable targets.
 */
export const SIMULATOR_GOALS: readonly SimulatorGoal[] = [
  {
    id: "pay-off-debt",
    label: "Pay Off Student Debt",
    description: "Eliminate all $15,000 in student loans",
    progressValue: (state: SimulatorState) =>
      Math.min(100, Math.round((1 - state.debt / 15000) * 100)),
    isComplete: (state: SimulatorState) => state.debt <= 0,
  },
  {
    id: "credit-score-700",
    label: "Reach Credit Score 700",
    description: "Build your credit score to 700+",
    progressValue: (state: SimulatorState) =>
      Math.min(
        100,
        Math.round(((state.creditScore - 300) / (700 - 300)) * 100)
      ),
    isComplete: (state: SimulatorState) => state.creditScore >= 700,
  },
  {
    id: "build-investments",
    label: "Build $25,000 in Investments",
    description: "Grow your investment portfolio to $25,000",
    progressValue: (state: SimulatorState) =>
      Math.min(100, Math.round((state.investments / 25000) * 100)),
    isComplete: (state: SimulatorState) => state.investments >= 25000,
  },
  {
    id: "survive-24",
    label: "Survive 24 Months",
    description: "Make it through 2 full years without going bankrupt",
    progressValue: (state: SimulatorState) =>
      Math.min(100, Math.round((state.month / 24) * 100)),
    isComplete: (state: SimulatorState) => state.month >= 24,
  },
] as const;
