"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GameLayout } from "@/components/shared/game-layout";
import { Button } from "@/components/ui/button";
import { useLocalProgress } from "@/hooks/use-local-progress";
import { cn } from "@/lib/utils";
import type { GameId } from "@/types/game";

const GAME_DURATION = 180; // 3 minutes
const TICK_INTERVAL = 1500; // price updates every 1.5s
const STARTING_CASH = 500;
const STARTING_PRICE = 50;
const MAX_PRICE_HISTORY = 25;

function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function nextPrice(current: number, seed: number): number {
  const change = (seededRandom(seed) - 0.48) * 8;
  return Math.max(10, Math.round((current + change) * 100) / 100);
}

function formatMoney(n: number) {
  return `$${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function StockSurgePage() {
  const { addArcadeScore } = useLocalProgress();

  const [phase, setPhase] = useState<"playing" | "ended">("playing");
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [cash, setCash] = useState(STARTING_CASH);
  const [shares, setShares] = useState(0);
  const [currentPrice, setCurrentPrice] = useState(STARTING_PRICE);
  const [priceHistory, setPriceHistory] = useState<number[]>([STARTING_PRICE]);
  const [lastDirection, setLastDirection] = useState<"up" | "down" | "flat">("flat");
  const seedRef = useRef(Math.floor(Math.random() * 10000));

  const portfolioValue = cash + shares * currentPrice;
  const profitLoss = portfolioValue - STARTING_CASH;
  const holdValue = (STARTING_CASH / STARTING_PRICE) * currentPrice;
  const maxBarValue = Math.max(...priceHistory);
  const minBarValue = Math.min(...priceHistory);

  // Timer
  useEffect(() => {
    if (phase !== "playing") return;
    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timer);
          setPhase("ended");
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [phase]);

  // Price tick
  useEffect(() => {
    if (phase !== "playing") return;
    const tick = setInterval(() => {
      seedRef.current += 1;
      setCurrentPrice((prev) => {
        const newPrice = nextPrice(prev, seedRef.current);
        setLastDirection(newPrice > prev ? "up" : newPrice < prev ? "down" : "flat");
        setPriceHistory((h) => [...h.slice(-MAX_PRICE_HISTORY + 1), newPrice]);
        return newPrice;
      });
    }, TICK_INTERVAL);
    return () => clearInterval(tick);
  }, [phase]);

  useEffect(() => {
    if (phase === "ended") {
      const finalValue = Math.round(cash + shares * currentPrice);
      addArcadeScore("stock-surge" as GameId, finalValue, 1);
    }
  }, [phase, cash, shares, currentPrice, addArcadeScore]);

  const handleBuy = useCallback(() => {
    if (cash < currentPrice) return;
    setCash((c) => Math.round((c - currentPrice) * 100) / 100);
    setShares((s) => s + 1);
  }, [cash, currentPrice]);

  const handleSell = useCallback(() => {
    if (shares === 0) return;
    setCash((c) => Math.round((c + currentPrice) * 100) / 100);
    setShares((s) => s - 1);
  }, [shares, currentPrice]);

  const handlePlayAgain = useCallback(() => {
    setPhase("playing");
    setTimeLeft(GAME_DURATION);
    setCash(STARTING_CASH);
    setShares(0);
    setCurrentPrice(STARTING_PRICE);
    setPriceHistory([STARTING_PRICE]);
    setLastDirection("flat");
    seedRef.current = Math.floor(Math.random() * 10000);
  }, []);

  const barRange = maxBarValue - minBarValue || 1;

  return (
    <GameLayout
      title="Stock Surge"
      module="arcade"
      backHref="/minigames"
      headerRight={
        phase === "playing" ? (
          <div className="flex items-center gap-3 text-white">
            <span className={cn("text-lg font-extrabold tabular-nums", timeLeft < 30 && "animate-pulse text-red-300")}>
              {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, "0")}
            </span>
          </div>
        ) : undefined
      }
    >
      <div className="flex flex-col items-center gap-5 py-4">
        <AnimatePresence mode="wait">
          {phase === "playing" && (
            <motion.div
              key="playing"
              className="flex w-full max-w-md flex-col gap-5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Stats row */}
              <div className="grid grid-cols-3 gap-3">
                <div className="flex flex-col items-center gap-1 rounded-xl bg-accent-soft p-3">
                  <p className="text-[10px] font-bold text-muted-foreground">Cash</p>
                  <p className="text-base font-extrabold tabular-nums text-accent">{formatMoney(cash)}</p>
                </div>
                <div className="flex flex-col items-center gap-1 rounded-xl bg-paper-2 p-3">
                  <p className="text-[10px] font-bold text-muted-foreground">Shares</p>
                  <p className="text-base font-extrabold tabular-nums text-ink">{shares}</p>
                </div>
                <div className="flex flex-col items-center gap-1 rounded-xl bg-paper-2 p-3">
                  <p className="text-[10px] font-bold text-muted-foreground">Portfolio</p>
                  <p className="text-base font-extrabold tabular-nums text-ink">{formatMoney(portfolioValue)}</p>
                </div>
              </div>

              {/* Price display */}
              <div className="flex flex-col items-center gap-1 rounded-2xl border-2 border-border bg-card p-4">
                <p className="text-xs font-bold text-muted-foreground">CQST Price</p>
                <motion.p
                  key={currentPrice}
                  className={cn(
                    "text-4xl font-extrabold tabular-nums",
                    lastDirection === "up" ? "text-accent" : lastDirection === "down" ? "text-red-600" : "text-foreground"
                  )}
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                >
                  {formatMoney(currentPrice)}
                </motion.p>
                <span className={cn(
                  "text-sm font-bold",
                  lastDirection === "up" ? "text-accent" : lastDirection === "down" ? "text-red-500" : "text-muted-foreground"
                )}>
                  {lastDirection === "up" ? "▲" : lastDirection === "down" ? "▼" : "—"}
                </span>
              </div>

              {/* Sparkline */}
              <div className="flex items-end gap-0.5 h-20 rounded-xl border border-border bg-card px-3 pb-2 pt-3">
                {priceHistory.map((p, i) => (
                  <div
                    key={i}
                    className={cn(
                      "flex-1 rounded-t-sm",
                      i === priceHistory.length - 1 ? "bg-primary" : "bg-primary/30"
                    )}
                    style={{ height: `${Math.max(4, ((p - minBarValue) / barRange) * 60 + 10)}px` }}
                  />
                ))}
              </div>

              {/* Action buttons */}
              <div className="flex gap-4">
                <Button
                  className="flex-1 min-h-[56px] rounded-2xl bg-accent text-lg font-extrabold text-white hover:bg-accent disabled:opacity-40"
                  onClick={handleBuy}
                  disabled={cash < currentPrice}
                >
                  BUY
                </Button>
                <Button
                  className="flex-1 min-h-[56px] rounded-2xl bg-red-500 text-lg font-extrabold text-white hover:bg-red-600 disabled:opacity-40"
                  onClick={handleSell}
                  disabled={shares === 0}
                >
                  SELL
                </Button>
              </div>

              <p className="text-center text-[10px] font-mono text-muted-foreground/60">
                📚 CEE.PF.3 — Investing
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
              <span className="text-6xl">{profitLoss >= 0 ? "📈" : "📉"}</span>
              <div>
                <h2 className="text-4xl font-extrabold">{formatMoney(portfolioValue)}</h2>
                <p className={cn("font-bold", profitLoss >= 0 ? "text-accent" : "text-red-600")}>
                  {profitLoss >= 0 ? "+" : ""}{formatMoney(profitLoss)} vs start
                </p>
              </div>

              <div className="w-full rounded-2xl border-2 border-border bg-card p-4 text-left">
                <div className="flex justify-between py-2 text-sm">
                  <span className="font-bold">Your portfolio</span>
                  <span className={cn("font-extrabold", profitLoss >= 0 ? "text-accent" : "text-red-600")}>{formatMoney(portfolioValue)}</span>
                </div>
                <div className="flex justify-between py-2 text-sm border-t border-border">
                  <span className="font-bold">"Just held" strategy</span>
                  <span className="font-extrabold text-ink">{formatMoney(holdValue)}</span>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  {portfolioValue >= holdValue
                    ? "🎉 You beat the buy-and-hold strategy! Great trading!"
                    : "💡 Holding from the start would have been better. Time in the market beats timing!"}
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
