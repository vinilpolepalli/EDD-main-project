export type Topic = "credit" | "taxes" | "budgeting" | "investing" | "insurance" | "saving";
export type GameId =
  | "budget-blitz"
  | "tax-dash"
  | "credit-rush"
  | "need-or-want"
  | "credit-climb"
  | "budget-blitz-v2"
  | "tax-trivia"
  | "savings-race"
  | "stock-surge"
  | "comic-adventure";
export type Difficulty = "beginner" | "intermediate" | "advanced";

export interface AvatarConfig {
  skinColor: string;
  hairStyle: string;
  hairColor: string;
  outfit: string;
  accessory: string;
}

export interface UserProgress {
  userId: string;
  totalXp: number;
  currentStreak: number;
  lastActiveDate: string;
}

export interface Profile {
  userId: string;
  displayName: string;
  avatarConfig: AvatarConfig;
  createdAt: string;
}

export interface LessonSection {
  type: "text" | "flashcard" | "definition";
  title?: string;
  content: string;
  term?: string;
  definition?: string;
}

export interface LessonVideo {
  youtubeId: string;
  title: string;
  channelName: string;
  durationMinutes: number;
  ceeStandard: string;
}

export interface Lesson {
  id: string;
  topic: Topic;
  title: string;
  order: number;
  sections: LessonSection[];
  ceeStandard: string;
  difficulty: Difficulty;
  videos?: LessonVideo[];
}

export interface QuizQuestion {
  id: string;
  topic: Topic;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  ceeStandard: string;
  difficulty: Difficulty;
}

// ---------------------------------------------------------------------------
// Choice-based event system
// ---------------------------------------------------------------------------

/** A single choice option for a choice-based life event */
export interface EventChoice {
  id: string;
  /** Short label shown on the button, e.g. "Pay in full" */
  label: string;
  /** Educational explanation shown after the player chooses */
  explanation: string;
  /** Financial effects applied when this choice is selected */
  effects: {
    balance?: number;
    debt?: number;
    creditScore?: number;
    happiness?: number;
    investments?: number;
    emergencyFund?: number;
    /** Permanent salary adjustment (positive = raise, negative = pay cut) */
    salaryMod?: number;
    /** Permanent monthly expenses adjustment */
    expensesMod?: number;
    /** Temporary income multiplier (e.g. 0.4 = 40% income for job loss) */
    temporaryIncomeMod?: number;
    /** How many months the temporary income modifier lasts */
    temporaryIncomeDuration?: number;
  };
}

export interface LifeEvent {
  id: string;
  name: string;
  description: string;
  category: "positive" | "negative" | "neutral";
  /** Direct balance effect (used for auto-apply events) */
  balanceEffect: number;
  creditScoreEffect: number;
  happinessEffect: number;
  probability: number;
  minAge: number;
  maxAge: number;
  /** If present, the event requires the player to pick a response */
  choices?: EventChoice[];
}

// ---------------------------------------------------------------------------
// Life Scenario system
// ---------------------------------------------------------------------------

export type ScenarioId = "fresh-grad" | "young-pro" | "mid-career" | "surprise" | "gig-worker";

export interface LifeScenario {
  id: ScenarioId;
  label: string;
  description: string;
  emoji: string;
  age: number;
  salary: number;
  startingBalance: number;
  startingDebt: number;
  /** Human-readable label for the type of debt, e.g. "Student Loans" */
  debtLabel: string;
  /** Monthly interest rate on debt, e.g. 0.005 = 0.5%/month */
  debtInterestRate: number;
  startingExpenses: number;
  goalId: string;
}

// ---------------------------------------------------------------------------
// Simulator Goals
// ---------------------------------------------------------------------------

export interface SimulatorGoal {
  id: string;
  label: string;
  description: string;
  /** Returns progress 0-100 */
  progressValue: (state: SimulatorState) => number;
  /** Returns true when the goal is fully achieved */
  isComplete: (state: SimulatorState) => boolean;
}

// ---------------------------------------------------------------------------
// Activity Feed
// ---------------------------------------------------------------------------

export interface ActivityEntry {
  month: number;
  type: "event" | "choice" | "milestone" | "goal";
  text: string;
  emoji: string;
  positivity: "positive" | "negative" | "neutral";
}

// ---------------------------------------------------------------------------
// Simulator State
// ---------------------------------------------------------------------------

export interface SimulatorState {
  age: number;
  month: number;
  salary: number;
  balance: number;
  debt: number;
  creditScore: number;
  happiness: number;
  monthlyExpenses: number;
  savingsAllocation: number;
  spendingAllocation: number;
  investingAllocation: number;
  investments: number;
  interestRate: number;
  events: LifeEvent[];

  // --- New BitLife-inspired fields ---

  /** Money set aside for emergencies (separate from balance) */
  emergencyFund: number;
  /** Running total of taxes withheld this calendar year (resets every 12 months) */
  taxesWithheld: number;
  /** Net worth at end of each month, used for sparkline charts */
  netWorthHistory: number[];
  /** Scrollable log of every decision and event */
  activityLog: ActivityEntry[];
  /** Which scenario was selected at setup */
  scenarioId: string;
  /** ID of the active goal for this run */
  goalId: string;
  /** Temporary income multiplier (1.0 = normal, 0.4 = job loss, etc.) */
  temporaryIncomeMod: number;
  /** Months remaining for the temporary income modifier */
  temporaryIncomeDuration: number;
  /** Housing situation affects some events */
  housingType: "renting" | "owning";
  /** Event waiting for the player to make a choice before the month can end */
  pendingChoiceEvent: LifeEvent | null;
  /** Current life stage label based on months and net worth */
  lifeStage: string;
  /** Label for what kind of debt the player has */
  debtLabel: string;
  /** Monthly interest rate on debt */
  debtInterestRate: number;
  /** Starting balance for performance comparison */
  startingBalance: number;
}

export interface MonthAllocation {
  savings: number;
  spending: number;
  investing: number;
  emergencyFund: number;
  debtPayment: number;
}

export interface MonthResult {
  event: LifeEvent | null;
  balanceBefore: number;
  balanceAfter: number;
  creditScoreBefore: number;
  creditScoreAfter: number;
  happinessBefore: number;
  happinessAfter: number;
  interestEarned: number;
  investmentReturn: number;
  isBankrupt: boolean;
  /** Set when an event with choices fires and the player must respond */
  pendingChoice: boolean;
  /** Taxes withheld this month */
  taxesThisMonth: number;
  /** Interest accrued on debt this month */
  debtInterestThisMonth: number;
  /** Net worth at end of month */
  netWorth: number;
  /** How much emergency fund absorbed from a negative event */
  emergencyFundUsed: number;
  /** Explanation of a chosen choice */
  choiceExplanation: string | null;
  /** Whether a debt spiral was triggered */
  debtSpiral: boolean;
}

export interface LessonCompletion {
  userId: string;
  topic: Topic;
  lessonId: string;
  score: number;
  completedAt: string;
}

export interface SimulatorRunRecord {
  userId: string;
  runId: string;
  monthsSurvived: number;
  finalBalance: number;
  finalCreditScore: number;
  endedAt: string;
}

export interface ArcadeScore {
  userId: string;
  gameId: GameId;
  score: number;
  comboMultiplier: number;
  playedAt: string;
}

export interface ArcadeGameConfig {
  id: GameId;
  name: string;
  description: string;
  topic: Topic;
  tokenCost: number;
  timeLimit: number;
  icon: string;
  color: string;
}
