"use client";

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "cashquest-tokens";

function loadTokens(): number {
  if (typeof window === "undefined") return 0;

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored !== null) {
      const parsed = Number(stored);
      if (!Number.isNaN(parsed) && parsed >= 0) {
        return parsed;
      }
    }
  } catch {
    // Corrupted storage
  }

  return 0;
}

function saveTokens(amount: number): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEY, String(amount));
  } catch {
    // Storage full or unavailable
  }
}

export function useTokens() {
  const [tokens, setTokens] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setTokens(loadTokens());
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      saveTokens(tokens);
    }
  }, [tokens, isLoaded]);

  const spendTokens = useCallback(
    (amount: number): boolean => {
      if (amount <= 0) return false;
      if (tokens < amount) return false;

      setTokens((prev) => prev - amount);
      return true;
    },
    [tokens]
  );

  const earnTokens = useCallback((amount: number) => {
    if (amount <= 0) return;
    setTokens((prev) => prev + amount);
  }, []);

  const canAfford = useCallback(
    (cost: number): boolean => {
      return tokens >= cost;
    },
    [tokens]
  );

  return {
    tokens,
    isLoaded,
    spendTokens,
    earnTokens,
    canAfford,
  };
}
