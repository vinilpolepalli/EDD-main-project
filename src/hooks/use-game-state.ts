"use client";

import { useState, useEffect, useCallback } from "react";
import type { UserProgress } from "@/types/game";

const STORAGE_KEY = "cashquest-progress";

const DEFAULT_PROGRESS: UserProgress = {
  userId: "local",
  totalXp: 0,
  currentStreak: 0,
  lastActiveDate: new Date().toISOString().split("T")[0],
  arcadeTokens: 0,
};

function loadProgress(): UserProgress {
  if (typeof window === "undefined") {
    return DEFAULT_PROGRESS;
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed: unknown = JSON.parse(stored);
      if (
        parsed !== null &&
        typeof parsed === "object" &&
        "userId" in parsed &&
        "totalXp" in parsed &&
        "currentStreak" in parsed &&
        "lastActiveDate" in parsed &&
        "arcadeTokens" in parsed
      ) {
        return parsed as UserProgress;
      }
    }
  } catch {
    // Corrupted storage — fall back to defaults
  }

  return DEFAULT_PROGRESS;
}

function saveProgress(progress: UserProgress): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // Storage full or unavailable
  }
}

export function useGameState() {
  const [progress, setProgress] = useState<UserProgress>(DEFAULT_PROGRESS);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setProgress(loadProgress());
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      saveProgress(progress);
    }
  }, [progress, isLoaded]);

  const updateXp = useCallback((amount: number) => {
    setProgress((prev) => ({
      ...prev,
      totalXp: Math.max(0, prev.totalXp + amount),
    }));
  }, []);

  const updateTokens = useCallback((amount: number) => {
    setProgress((prev) => ({
      ...prev,
      arcadeTokens: Math.max(0, prev.arcadeTokens + amount),
    }));
  }, []);

  const updateStreak = useCallback(() => {
    setProgress((prev) => {
      const today = new Date().toISOString().split("T")[0];
      const lastActive = prev.lastActiveDate;

      if (lastActive === today) {
        return prev;
      }

      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split("T")[0];

      const newStreak =
        lastActive === yesterdayStr ? prev.currentStreak + 1 : 1;

      return {
        ...prev,
        currentStreak: newStreak,
        lastActiveDate: today,
      };
    });
  }, []);

  const resetProgress = useCallback(() => {
    const reset = { ...DEFAULT_PROGRESS };
    setProgress(reset);
    saveProgress(reset);
  }, []);

  return {
    progress,
    isLoaded,
    updateXp,
    updateTokens,
    updateStreak,
    resetProgress,
  };
}
