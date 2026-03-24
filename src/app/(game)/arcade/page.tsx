"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Gamepad2,
  Coins,
  ShoppingCart,
  Receipt,
  CreditCard,
  Lock,
  Trophy,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import { GameLayout } from "@/components/shared/game-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useTokens } from "@/hooks/use-tokens";
import { useLocalProgress } from "@/hooks/use-local-progress";
import { ARCADE_GAMES } from "@/lib/constants/game-balance";
import type { ArcadeGameConfig, GameId } from "@/types/game";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
} as const;

const cardVariants = {
  hidden: { opacity: 0, y: 25, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring" as const, stiffness: 200, damping: 20 },
  },
} as const;

const iconMap: Record<string, React.ReactNode> = {
  ShoppingCart: <ShoppingCart className="h-7 w-7" />,
  Receipt: <Receipt className="h-7 w-7" />,
  CreditCard: <CreditCard className="h-7 w-7" />,
};

const topicColorMap: Record<string, { bg: string; text: string; border: string }> = {
  budgeting: { bg: "bg-green-100", text: "text-green-700", border: "border-green-300" },
  taxes: { bg: "bg-purple-100", text: "text-purple-700", border: "border-purple-300" },
  credit: { bg: "bg-amber-100", text: "text-amber-700", border: "border-amber-300" },
};

function GameCard({
  game,
  bestScore,
  canAfford,
  onPlay,
  onCantAfford,
}: {
  game: ArcadeGameConfig;
  bestScore: number | null;
  canAfford: boolean;
  onPlay: () => void;
  onCantAfford: () => void;
}) {
  const topicColors = topicColorMap[game.topic] ?? topicColorMap.budgeting;

  return (
    <motion.div variants={cardVariants}>
      <Card className="overflow-hidden border-2 border-amber-200 transition-shadow hover:shadow-xl">
        {/* Color Bar */}
        <div
          className="h-2 w-full"
          style={{ backgroundColor: game.color }}
        />

        <CardContent className="flex flex-col gap-4 p-5">
          {/* Header */}
          <div className="flex items-start gap-4">
            <motion.div
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl shadow-md"
              style={{ backgroundColor: game.color }}
              whileHover={{ rotate: [0, -5, 5, 0] }}
              transition={{ duration: 0.4 }}
            >
              <span className="text-white">{iconMap[game.icon]}</span>
            </motion.div>
            <div className="flex flex-1 flex-col gap-1">
              <h3 className="text-lg font-extrabold text-foreground">
                {game.name}
              </h3>
              <Badge className={`w-fit ${topicColors.bg} ${topicColors.text}`}>
                {game.topic}
              </Badge>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm leading-relaxed text-muted-foreground">
            {game.description}
          </p>

          {/* Stats Row */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 rounded-lg bg-amber-50 px-3 py-1.5">
              <Coins className="h-4 w-4 text-amber-600" />
              <span className="text-sm font-extrabold text-amber-700">
                {game.tokenCost} tokens
              </span>
            </div>
            {bestScore !== null && (
              <div className="flex items-center gap-1.5 rounded-lg bg-purple-50 px-3 py-1.5">
                <Trophy className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-extrabold text-purple-700">
                  Best: {bestScore.toLocaleString()}
                </span>
              </div>
            )}
          </div>

          {/* Play Button */}
          {canAfford ? (
            <Button
              size="lg"
              className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 text-white hover:from-amber-600 hover:to-yellow-600"
              onClick={onPlay}
            >
              <Gamepad2 className="h-5 w-5" />
              Play
            </Button>
          ) : (
            <Button
              size="lg"
              variant="outline"
              className="w-full border-amber-300 text-amber-700 hover:bg-amber-50"
              onClick={onCantAfford}
            >
              <Lock className="h-5 w-5" />
              Need {game.tokenCost} Tokens
            </Button>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

function ArcadeSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <Skeleton className="mx-auto h-12 w-40 rounded-xl" />
      {Array.from({ length: 3 }).map((_, i) => (
        <Skeleton key={i} className="h-72 w-full rounded-xl" />
      ))}
    </div>
  );
}

export default function ArcadePage() {
  const router = useRouter();
  const { tokens, canAfford, isLoaded: tokensLoaded } = useTokens();
  const { getBestArcadeScore, isLoaded: progressLoaded } = useLocalProgress();
  const [showNeedTokens, setShowNeedTokens] = useState(false);

  const isLoaded = tokensLoaded && progressLoaded;

  const handlePlay = (gameId: GameId) => {
    router.push(`/arcade/${gameId}`);
  };

  const handleCantAfford = () => {
    setShowNeedTokens(true);
    setTimeout(() => setShowNeedTokens(false), 3000);
  };

  return (
    <GameLayout title="Arcade" module="arcade" backHref="/dashboard">
      <motion.div
        className="flex flex-col gap-8"
        variants={containerVariants}
        initial="hidden"
        animate={isLoaded ? "visible" : "hidden"}
      >
        {/* Token Balance */}
        <motion.div
          className="flex items-center justify-center"
          variants={cardVariants}
        >
          <div className="flex items-center gap-3 rounded-2xl bg-gradient-to-r from-amber-100 to-yellow-100 px-6 py-3 shadow-md">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500 shadow-sm">
              <Coins className="h-5 w-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-amber-600">Your Tokens</span>
              <span className="text-2xl font-extrabold tabular-nums text-amber-800">
                {tokens}
              </span>
            </div>
          </div>
        </motion.div>

        {/* "Need more tokens" banner */}
        {showNeedTokens && (
          <motion.div
            className="flex items-center gap-3 rounded-xl bg-amber-50 border-2 border-amber-200 p-4"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <AlertCircle className="h-5 w-5 shrink-0 text-amber-600" />
            <p className="text-sm font-bold text-amber-700">
              Need more tokens! Complete lessons in the Learn Path to earn them.
            </p>
            <Link href="/learn">
              <Button size="sm" variant="outline" className="shrink-0 border-amber-300 text-amber-700">
                <Sparkles className="h-4 w-4" />
                Learn
              </Button>
            </Link>
          </motion.div>
        )}

        {/* Game Cards */}
        {!isLoaded ? (
          <ArcadeSkeleton />
        ) : (
          <motion.div
            className="flex flex-col gap-6"
            variants={containerVariants}
          >
            {ARCADE_GAMES.map((game) => {
              const best = getBestArcadeScore(game.id);
              return (
                <GameCard
                  key={game.id}
                  game={game}
                  bestScore={best?.score ?? null}
                  canAfford={canAfford(game.tokenCost)}
                  onPlay={() => handlePlay(game.id)}
                  onCantAfford={handleCantAfford}
                />
              );
            })}
          </motion.div>
        )}

        {/* Earn Tokens Hint */}
        <motion.div
          variants={cardVariants}
          className="flex flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-amber-200 bg-amber-50/50 p-5 text-center"
        >
          <Sparkles className="h-6 w-6 text-amber-400" />
          <p className="text-sm font-bold text-muted-foreground">
            Earn tokens by completing lessons in the{" "}
            <Link href="/learn" className="font-extrabold text-green-600 underline">
              Learn Path
            </Link>
            !
          </p>
        </motion.div>
      </motion.div>
    </GameLayout>
  );
}
