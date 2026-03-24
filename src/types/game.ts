export type Topic = "credit" | "taxes" | "budgeting";
export type GameId = "budget-blitz" | "tax-dash" | "credit-rush";
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
  arcadeTokens: number;
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

export interface Lesson {
  id: string;
  topic: Topic;
  title: string;
  order: number;
  sections: LessonSection[];
  ceeStandard: string;
  difficulty: Difficulty;
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

export interface LifeEvent {
  id: string;
  name: string;
  description: string;
  category: "positive" | "negative" | "neutral";
  balanceEffect: number;
  creditScoreEffect: number;
  happinessEffect: number;
  probability: number;
  minAge: number;
  maxAge: number;
}

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
}

export interface MonthAllocation {
  savings: number;
  spending: number;
  investing: number;
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
