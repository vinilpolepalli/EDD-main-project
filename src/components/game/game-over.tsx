"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Trophy, Sparkles, Coins, RotateCcw, Home } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface GameOverProps {
  score: number;
  xpEarned: number;
  tokensEarned: number;
  comboMax?: number;
  /** Whether the player achieved a good score (triggers confetti) */
  isGoodScore?: boolean;
  onPlayAgain: () => void;
  onBackToDashboard: () => void;
  className?: string;
}

/** Simple confetti dot component */
const ConfettiDot: React.FC<{ index: number }> = ({ index }) => {
  const colors = [
    "bg-learn",
    "bg-simulator",
    "bg-accent",
    "bg-xp",
    "bg-primary",
    "bg-success",
  ];
  const color = colors[index % colors.length];
  const randomX = (index * 37) % 100;
  const randomDelay = (index * 0.12) % 1;
  const size = index % 3 === 0 ? "h-3 w-3" : "h-2 w-2";

  return (
    <motion.span
      className={cn("absolute rounded-full", size, color)}
      style={{ left: `${randomX}%` }}
      initial={{ y: -20, opacity: 1, rotate: 0 }}
      animate={{
        y: 400,
        opacity: 0,
        rotate: 360 + index * 45,
        x: (index % 2 === 0 ? 1 : -1) * (20 + (index * 11) % 40),
      }}
      transition={{
        duration: 2 + randomDelay,
        delay: randomDelay,
        ease: "easeOut",
      }}
    />
  );
};

const GameOver: React.FC<GameOverProps> = ({
  score,
  xpEarned,
  tokensEarned,
  comboMax,
  isGoodScore = false,
  onPlayAgain,
  onBackToDashboard,
  className,
}) => {
  return (
    <motion.div
      className={cn(
        "relative flex flex-col items-center gap-6 overflow-hidden rounded-2xl border border-border bg-card p-8 shadow-xl",
        className
      )}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
    >
      {/* Confetti overlay */}
      {isGoodScore && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          {Array.from({ length: 24 }).map((_, i) => (
            <ConfettiDot key={i} index={i} />
          ))}
        </div>
      )}

      {/* Trophy */}
      <motion.div
        className="flex h-20 w-20 items-center justify-center rounded-2xl bg-accent text-white shadow-lg"
        initial={{ scale: 0, rotate: -30 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.2 }}
      >
        <Trophy className="h-10 w-10" />
      </motion.div>

      <h2 className="text-2xl font-extrabold text-foreground">Game Over!</h2>

      {/* Stats */}
      <div className="grid w-full max-w-xs grid-cols-2 gap-3">
        <StatBubble
          icon={<Trophy className="h-4 w-4 text-accent" />}
          label="Score"
          value={score.toLocaleString()}
          delay={0.3}
        />
        <StatBubble
          icon={<Sparkles className="h-4 w-4 text-xp" />}
          label="XP Earned"
          value={`+${xpEarned}`}
          delay={0.4}
        />
        <StatBubble
          icon={<Coins className="h-4 w-4 text-accent" />}
          label="Tokens"
          value={`+${tokensEarned}`}
          delay={0.5}
        />
        {comboMax !== undefined && (
          <StatBubble
            icon={<span className="text-sm">⚡</span>}
            label="Max Combo"
            value={`${comboMax.toFixed(2)}x`}
            delay={0.6}
          />
        )}
      </div>

      {/* Actions */}
      <div className="flex w-full max-w-xs flex-col gap-3 sm:flex-row">
        <Button
          variant="default"
          className="flex-1"
          onClick={onPlayAgain}
        >
          <RotateCcw className="h-4 w-4" />
          Play Again
        </Button>
        <Button
          variant="outline"
          className="flex-1"
          onClick={onBackToDashboard}
        >
          <Home className="h-4 w-4" />
          Dashboard
        </Button>
      </div>
    </motion.div>
  );
};

interface StatBubbleProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  delay: number;
}

const StatBubble: React.FC<StatBubbleProps> = ({ icon, label, value, delay }) => (
  <motion.div
    className="flex flex-col items-center gap-1 rounded-xl bg-muted p-3"
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, type: "spring", stiffness: 200, damping: 20 }}
  >
    {icon}
    <span className="text-lg font-extrabold tabular-nums text-foreground">
      {value}
    </span>
    <span className="text-[10px] font-bold text-muted-foreground">{label}</span>
  </motion.div>
);

export { GameOver };
export type { GameOverProps };
