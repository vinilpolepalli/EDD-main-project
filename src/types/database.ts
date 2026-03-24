export type {
  Profile,
  UserProgress,
  LessonCompletion,
  SimulatorRunRecord,
  ArcadeScore,
} from "./game";

export interface Database {
  public: {
    Tables: {
      profiles: { Row: import("./game").Profile };
      progress: { Row: import("./game").UserProgress };
      lesson_completions: { Row: import("./game").LessonCompletion };
      simulator_runs: { Row: import("./game").SimulatorRunRecord };
      arcade_scores: { Row: import("./game").ArcadeScore };
    };
  };
}
