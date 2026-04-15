"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GameLayout } from "@/components/shared/game-layout";
import { Button } from "@/components/ui/button";
import { useLocalProgress } from "@/hooks/use-local-progress";
import { cn } from "@/lib/utils";
import type { GameId } from "@/types/game";

const TOTAL_YEARS = 10;
const STARTING_BALANCE = 1000;
const INFLATION_RATE = 0.03;

const RATE_POOLS = [
  [0.01, 0.03, 0.05],
  [0.02, 0.05, 0.08],
  [0.03, 0.06, 0.10],
  [0.005, 0.02, 0.04],
];

function compoundYear(principal: number, rate: number): number {
  return principal * (1 + rate / 12) ** 12;
}

function formatDollar(n: number) {
  return `$${Math.round(n).toLocaleString()}`;
}

export default function SavingsRacePage() {
  const { addArcadeScore } = useLocalProgress();

  const [year, setYear] = useState(1);
  const [balance, setBalance] = useState(STARTING_BALANCE);
  const [history, setHistory] = useState<{ year: number; balance: number }[]>([
    { year: 0, balance: STARTING_BALANCE },
  ]);
  const [phase, setPhase] = useState<"playing" | "ended">("playing");
  const [selectedRate, setSelectedRate] = useState<number | null>(null);

  const currentRates = useMemo(() => {
    const pool = RATE_POOLS[year % RATE_POOLS.length];
    return pool;
  }, [year]);

  useEffect(() => {
    if (phase === "ended") {
      addArcadeScore("savings-race" as GameId, Math.round(balance), 1);
    }
  }, [phase, balance, addArcadeScore]);

  const handlePickRate = useCallback(
    (rate: number) => {
      if (phase !== "playing") return;
      const newBalance = compoundYear(balance, rate);
      const newHistory = [...history, { year, balance: newBalance }];
      setSelectedRate(rate);
      setBalance(newBalance);
      setHistory(newHistory);

      setTimeout(() => {
        setSelectedRate(null);
        if (year >= TOTAL_YEARS) {
          setPhase("ended");
        } else {
          setYear((y) => y + 1);
        }
      }, 1200);
    },
    [phase, balance, history, year]
  );

  const handlePlayAgain = useCallback(() => {
    setYear(1);
    setBalance(STARTING_BALANCE);
    setHistory([{ year: 0, balance: STARTING_BALANCE }]);
    setPhase("playing");
    setSelectedRate(null);
  }, []);

  const inflationAdjusted = STARTING_BALANCE * (1 + INFLATION_RATE) ** TOTAL_YEARS;
  const maxBarValue = Math.max(...history.map((h) => h.balance));

  return (
    <GameLayout
      title="Savings Race"
      module="arcade"
      backHref="/minigames"
      headerRight={
        phase === "playing" ? (
          <div className="text-white text-sm font-bold">
            Year {year} of {TOTAL_YEARS}
          </div>
        ) : undefined
      }
    >
      <div className="flex flex-col items-center gap-6 py-4">
        <AnimatePresence mode="wait">
          {phase === "playing" && (
            <motion.div
              key="playing"
              className="flex w-full max-w-md flex-col gap-5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Balance display */}
              <div className="flex flex-col items-center gap-1 rounded-2xl border-2 border-cyan-200 bg-cyan-50 p-4 text-center">
                <p className="text-xs font-bold text-cyan-600">Current Balance</p>
                <p className="text-4xl font-extrabold text-cyan-700 tabular-nums">
                  {formatDollar(balance)}
                </p>
                <p className="text-xs text-muted-foreground">Year {year - 1} complete</p>
              </div>

              {/* Bar chart */}
              <div className="flex items-end gap-1 h-28 rounded-xl border border-border bg-card p-3">
                {history.map((h) => (
                  <motion.div
                    key={h.year}
                    className="flex-1 rounded-t-sm bg-cyan-400"
                    style={{ height: `${Math.max(4, (h.balance / maxBarValue) * 100)}%` }}
                    layout
                    title={`Year ${h.year}: ${formatDollar(h.balance)}`}
                  />
                ))}
                {/* Future placeholders */}
                {Array.from({ length: TOTAL_YEARS - history.length + 1 }).map((_, i) => (
                  <div key={`placeholder-${i}`} className="flex-1 rounded-t-sm bg-muted" style={{ height: "4px" }} />
                ))}
              </div>

              {/* Rate picker */}
              <p className="text-center text-sm font-extrabold text-foreground">
                Pick your savings rate for Year {year}:
              </p>
              <div className="flex flex-col gap-3">
                {currentRates.map((rate) => {
                  const earned = compoundYear(balance, rate) - balance;
                  const isSelected = selectedRate === rate;
                  return (
                    <motion.button
                      key={rate}
                      onClick={() => handlePickRate(rate)}
                      disabled={selectedRate !== null}
                      className={cn(
                        "flex min-h-[64px] items-center justify-between rounded-2xl border-2 px-5 py-3 text-left font-bold transition-colors",
                        isSelected
                          ? "border-cyan-400 bg-cyan-50 text-cyan-800"
                          : "border-border bg-card hover:bg-muted"
                      )}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span className="text-lg font-extrabold">{(rate * 100).toFixed(1)}% APY</span>
                      <span className="text-sm text-muted-foreground">
                        +{formatDollar(earned)} this year
                      </span>
                    </motion.button>
                  );
                })}
              </div>

              <p className="text-center text-[10px] font-mono text-muted-foreground/60">
                📚 CEE.PF.3 — Saving
              </p>
            </motion.div>
          )}

          {phase === "ended" && (
            <motion.div
              key="ended"
              className="flex w-full max-w-sm flex-col items-center gap-6 text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <span className="text-6xl">🐷</span>
              <div>
                <h2 className="text-4xl font-extrabold text-cyan-600">{formatDollar(balance)}</h2>
                <p className="font-bold text-muted-foreground">After 10 years</p>
              </div>

              <div className="w-full rounded-2xl border-2 border-border bg-card p-4 text-left">
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm font-bold">Your ending balance</span>
                  <span className="font-extrabold text-cyan-600">{formatDollar(balance)}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-t border-border">
                  <span className="text-sm font-bold">Inflation-adjusted need</span>
                  <span className="font-extrabold text-orange-500">{formatDollar(inflationAdjusted)}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-t border-border">
                  <span className="text-sm font-bold">You started with</span>
                  <span className="font-extrabold">{formatDollar(STARTING_BALANCE)}</span>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  {balance > inflationAdjusted
                    ? "🎉 You beat inflation! Your money grew in real terms."
                    : "⚠️ Your savings didn't beat inflation. Higher rates matter!"}
                </p>
              </div>

              <div className="flex w-full flex-col gap-3">
                <Button
                  className="min-h-[48px] w-full rounded-xl bg-primary font-extrabold text-white"
                  onClick={handlePlayAgain}
                >
                  🔄 Play Again
                </Button>
                <Button
                  variant="outline"
                  className="min-h-[48px] w-full rounded-xl font-extrabold"
                  onClick={() => window.location.href = "/minigames"}
                >
                  ← Back to Arcade
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </GameLayout>
  );
}
