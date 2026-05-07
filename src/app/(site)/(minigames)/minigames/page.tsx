"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { GameLayout } from "@/components/shared/game-layout";
import { useLocalProgress } from "@/hooks/use-local-progress";
import type { GameId } from "@/types/game";

interface GameCard {
  id: GameId;
  title: string;
  tagline: string;
  description: string;
  href: string;
  gradient: string;
  ceeStandard: string;
  difficulty: "Easy" | "Medium" | "Hard";
  duration: string;
  topic: string;
  emoji: string;
}

const GAMES: GameCard[] = [
  {
    id: "need-or-want",
    title: "Need or Want?",
    tagline: "Swipe to decide!",
    description: "Cards fly at you — is it a NEED or a WANT? Beat the clock and build your streak.",
    href: "/minigames/need-or-want",
    gradient: "from-accent to-accent",
    ceeStandard: "CEE.PF.2",
    difficulty: "Easy",
    duration: "60 sec",
    topic: "Budgeting",
    emoji: "🛒",
  },
  {
    id: "credit-climb",
    title: "Credit Climb",
    tagline: "Higher or Lower?",
    description: "Does this action raise or drop your credit score? Survive until you hit 850 or crash to 300.",
    href: "/minigames/credit-climb",
    gradient: "from-ink to-ink",
    ceeStandard: "CEE.PF.4",
    difficulty: "Medium",
    duration: "Survival",
    topic: "Credit",
    emoji: "📈",
  },
  {
    id: "budget-blitz-v2",
    title: "Budget Blitz",
    tagline: "Allocate fast!",
    description: "Salary drops in — split it across Rent, Food, Fun, and Savings. Balance it before time runs out.",
    href: "/minigames/budget-blitz-v2",
    gradient: "from-accent to-accent",
    ceeStandard: "CEE.PF.2",
    difficulty: "Medium",
    duration: "90 sec",
    topic: "Budgeting",
    emoji: "💰",
  },
  {
    id: "tax-trivia",
    title: "Tax Trivia",
    tagline: "Test your tax IQ",
    description: "Multiple-choice questions on W-2s, deductions, refunds, and gross vs net. Build your refund total.",
    href: "/minigames/tax-trivia",
    gradient: "from-rose-500 to-ink",
    ceeStandard: "CEE.PF.5",
    difficulty: "Hard",
    duration: "5 rounds",
    topic: "Taxes",
    emoji: "🧾",
  },
  {
    id: "savings-race",
    title: "Savings Race",
    tagline: "Compound wins!",
    description: "Pick your savings rate each round. Watch compound interest snowball over 10 simulated years.",
    href: "/minigames/savings-race",
    gradient: "from-ink to-ink",
    ceeStandard: "CEE.PF.3",
    difficulty: "Easy",
    duration: "5 min",
    topic: "Saving",
    emoji: "🐷",
  },
  {
    id: "stock-surge",
    title: "Stock Surge",
    tagline: "Buy low, sell high",
    description: "Watch a simulated ticker. Buy and sell at the right moment. Ends when the clock hits zero.",
    href: "/minigames/stock-surge",
    gradient: "from-accent to-accent",
    ceeStandard: "CEE.PF.3",
    difficulty: "Hard",
    duration: "3 min",
    topic: "Investing",
    emoji: "📊",
  },
  {
    id: "comic-adventure",
    title: "Comic Adventure",
    tagline: "Story-driven choices",
    description: "Follow Alex through college, first job, and apartment hunting. Every panel is a financial decision.",
    href: "/minigames/comic-adventure",
    gradient: "from-ink to-ink",
    ceeStandard: "CEE.PF.1",
    difficulty: "Medium",
    duration: "10 min",
    topic: "All Topics",
    emoji: "📖",
  },
];

const TOPICS = ["All", "Budgeting", "Credit", "Taxes", "Saving", "Investing", "All Topics"];

const difficultyColors = {
  Easy: "bg-accent-soft text-accent",
  Medium: "bg-paper-2 text-accent",
  Hard: "bg-red-100 text-red-700",
};

export default function MinigamesHubPage() {
  const [filter, setFilter] = useState<string>("All");
  const { arcadeScores, isLoaded } = useLocalProgress();

  const filteredGames = useMemo(() => {
    if (filter === "All") return GAMES;
    return GAMES.filter((g) => g.topic === filter || (filter === "All Topics" && g.topic === "All Topics"));
  }, [filter]);

  const gamesPlayed = isLoaded ? new Set(arcadeScores.map((s) => s.gameId)).size : 0;

  return (
    <GameLayout title="Mini-Game Arcade" module="arcade" backHref="/dashboard">
      <div className="flex flex-col gap-6 pb-8">
        {/* Header */}
        <motion.div
          className="flex flex-col gap-2 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
        >
          <span className="text-5xl">🕹️</span>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
            Mini-Game Arcade
          </h1>
          <p className="text-sm font-semibold text-muted-foreground">
            7 games. Every area of personal finance. Learn by playing.
          </p>
          {isLoaded && gamesPlayed > 0 && (
            <span className="mx-auto mt-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
              🎮 You&apos;ve played {gamesPlayed} game{gamesPlayed !== 1 ? "s" : ""}
            </span>
          )}
        </motion.div>

        {/* Topic filter pills */}
        <motion.div
          className="flex flex-wrap justify-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          {TOPICS.map((topic) => (
            <button
              key={topic}
              onClick={() => setFilter(topic)}
              className={cn(
                "min-h-[36px] rounded-full px-4 py-1.5 text-xs font-bold transition-colors",
                filter === topic
                  ? "bg-primary text-white"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              {topic}
            </button>
          ))}
        </motion.div>

        {/* Game grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredGames.map((game, index) => {
            const bestScore = isLoaded
              ? arcadeScores.filter((s) => s.gameId === game.id).reduce<number | null>((best, s) => best === null || s.score > best ? s.score : best, null)
              : null;

            return (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.07, type: "spring", stiffness: 200, damping: 20 }}
              >
                <Link href={game.href} className="block h-full">
                  <motion.div
                    className="group flex h-full flex-col overflow-hidden rounded-2xl border-2 border-border bg-card shadow-sm hover:shadow-md"
                    whileHover={{ y: -6, scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  >
                    {/* Gradient header */}
                    <div className={cn("flex items-center gap-3 bg-paper-2 p-4 text-white", game.gradient)}>
                      <span className="text-3xl">{game.emoji}</span>
                      <div className="flex flex-1 flex-col">
                        <span className="font-extrabold leading-tight">{game.title}</span>
                        <span className="text-xs font-semibold text-white/80">{game.tagline}</span>
                      </div>
                      {bestScore !== null && (
                        <span className="shrink-0 rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-bold backdrop-blur-sm">
                          Best: {bestScore.toLocaleString()}
                        </span>
                      )}
                    </div>

                    {/* Body */}
                    <div className="flex flex-1 flex-col gap-3 p-4">
                      <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                        {game.description}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5">
                        <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-bold", difficultyColors[game.difficulty])}>
                          {game.difficulty}
                        </span>
                        <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-bold text-gray-600">
                          ⏱ {game.duration}
                        </span>
                        <span className="rounded-full bg-paper-2 px-2 py-0.5 text-[10px] font-bold text-ink">
                          {game.topic}
                        </span>
                      </div>

                      {/* CEE standard */}
                      <p className="text-[10px] font-mono text-muted-foreground/60 mt-auto">
                        📚 {game.ceeStandard}
                      </p>
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </GameLayout>
  );
}
