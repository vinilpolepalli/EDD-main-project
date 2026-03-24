"use client";

import { useState, useEffect, useCallback } from "react";
import type {
  Topic,
  LessonCompletion,
  SimulatorRunRecord,
  ArcadeScore,
  GameId,
} from "@/types/game";

const KEYS = {
  lessons: "cashquest-lesson-completions",
  simulator: "cashquest-simulator-runs",
  arcade: "cashquest-arcade-scores",
} as const;

function loadFromStorage<T>(key: string): T[] {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem(key);
    if (stored) {
      const parsed: unknown = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        return parsed as T[];
      }
    }
  } catch {
    // Corrupted storage
  }

  return [];
}

function saveToStorage<T>(key: string, data: T[]): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    // Storage full or unavailable
  }
}

export function useLocalProgress() {
  const [completedLessons, setCompletedLessons] = useState<
    LessonCompletion[]
  >([]);
  const [simulatorRuns, setSimulatorRuns] = useState<SimulatorRunRecord[]>([]);
  const [arcadeScores, setArcadeScores] = useState<ArcadeScore[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setCompletedLessons(loadFromStorage<LessonCompletion>(KEYS.lessons));
    setSimulatorRuns(loadFromStorage<SimulatorRunRecord>(KEYS.simulator));
    setArcadeScores(loadFromStorage<ArcadeScore>(KEYS.arcade));
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      saveToStorage(KEYS.lessons, completedLessons);
    }
  }, [completedLessons, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      saveToStorage(KEYS.simulator, simulatorRuns);
    }
  }, [simulatorRuns, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      saveToStorage(KEYS.arcade, arcadeScores);
    }
  }, [arcadeScores, isLoaded]);

  const markLessonComplete = useCallback(
    (topic: Topic, lessonId: string, score: number) => {
      const completion: LessonCompletion = {
        userId: "local",
        topic,
        lessonId,
        score,
        completedAt: new Date().toISOString(),
      };

      setCompletedLessons((prev) => {
        const existingIndex = prev.findIndex(
          (lc) => lc.lessonId === lessonId && lc.topic === topic
        );

        if (existingIndex >= 0) {
          const updated = [...prev];
          updated[existingIndex] = completion;
          return updated;
        }

        return [...prev, completion];
      });
    },
    []
  );

  const addSimulatorRun = useCallback(
    (run: Omit<SimulatorRunRecord, "userId" | "endedAt">) => {
      const record: SimulatorRunRecord = {
        ...run,
        userId: "local",
        endedAt: new Date().toISOString(),
      };

      setSimulatorRuns((prev) => [...prev, record]);
    },
    []
  );

  const addArcadeScore = useCallback(
    (gameId: GameId, score: number, comboMultiplier: number) => {
      const record: ArcadeScore = {
        userId: "local",
        gameId,
        score,
        comboMultiplier,
        playedAt: new Date().toISOString(),
      };

      setArcadeScores((prev) => [...prev, record]);
    },
    []
  );

  const getTopicProgress = useCallback(
    (topic: Topic) => {
      const topicLessons = completedLessons.filter(
        (lc) => lc.topic === topic
      );
      const totalScore = topicLessons.reduce((sum, lc) => sum + lc.score, 0);
      const averageScore =
        topicLessons.length > 0 ? totalScore / topicLessons.length : 0;

      return {
        completedCount: topicLessons.length,
        averageScore,
        lessons: topicLessons,
      };
    },
    [completedLessons]
  );

  const getBestArcadeScore = useCallback(
    (gameId: GameId): ArcadeScore | null => {
      const gameScores = arcadeScores.filter((s) => s.gameId === gameId);
      if (gameScores.length === 0) return null;

      return gameScores.reduce((best, current) =>
        current.score > best.score ? current : best
      );
    },
    [arcadeScores]
  );

  const getSimulatorBest = useCallback((): SimulatorRunRecord | null => {
    if (simulatorRuns.length === 0) return null;

    return simulatorRuns.reduce((best, current) =>
      current.monthsSurvived > best.monthsSurvived ? current : best
    );
  }, [simulatorRuns]);

  return {
    completedLessons,
    simulatorRuns,
    arcadeScores,
    isLoaded,
    markLessonComplete,
    addSimulatorRun,
    addArcadeScore,
    getTopicProgress,
    getBestArcadeScore,
    getSimulatorBest,
  };
}
