"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Gamepad2,
  ShoppingCart,
  Receipt,
  CreditCard,
  Play,
  Coins,
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { GameLayout } from "@/components/shared/game-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Timer } from "@/components/game/timer";
import { ScoreDisplay } from "@/components/game/score-display";
import { ComboMeter } from "@/components/game/combo-meter";
import { GameOver } from "@/components/game/game-over";
import { useTimer } from "@/hooks/use-timer";
import { useTokens } from "@/hooks/use-tokens";
import { useGameState } from "@/hooks/use-game-state";
import { useLocalProgress } from "@/hooks/use-local-progress";
import {
  calculateScore,
  updateCombo,
  calculateTimeBonus,
  calculateXpEarned,
  getComboMultiplier,
} from "@/lib/game-engine/arcade";
import { ARCADE_GAMES, ARCADE_TIME_LIMIT } from "@/lib/constants/game-balance";
import type { GameId, ArcadeGameConfig } from "@/types/game";

// ---------------------------------------------------------------------------
// Game Item Data
// ---------------------------------------------------------------------------

interface GameItem {
  text: string;
  answer: string;
}

const BUDGET_ITEMS: GameItem[] = [
  { text: "Groceries", answer: "need" },
  { text: "Netflix Subscription", answer: "want" },
  { text: "Electricity Bill", answer: "need" },
  { text: "New Sneakers", answer: "want" },
  { text: "Rent Payment", answer: "need" },
  { text: "Movie Tickets", answer: "want" },
  { text: "Health Insurance", answer: "need" },
  { text: "Video Game", answer: "want" },
  { text: "Water Bill", answer: "need" },
  { text: "Designer Clothes", answer: "want" },
  { text: "Medicine", answer: "need" },
  { text: "Candy Bar", answer: "want" },
  { text: "School Supplies", answer: "need" },
  { text: "Concert Tickets", answer: "want" },
  { text: "Bus Pass", answer: "need" },
  { text: "Smartphone Case", answer: "want" },
  { text: "Toothpaste", answer: "need" },
  { text: "Pizza Delivery", answer: "want" },
  { text: "Winter Coat", answer: "need" },
  { text: "Streaming Music", answer: "want" },
];

const TAX_ITEMS: GameItem[] = [
  { text: "Your Weekly Salary", answer: "taxable" },
  { text: "A Gift from Grandma", answer: "not-taxable" },
  { text: "Profit from Selling Lemonade", answer: "taxable" },
  { text: "Birthday Money ($50)", answer: "not-taxable" },
  { text: "Interest from Savings Account", answer: "taxable" },
  { text: "Prize from School Contest", answer: "taxable" },
  { text: "Allowance from Parents", answer: "not-taxable" },
  { text: "Tips from Dog Walking", answer: "taxable" },
  { text: "Holiday Gift Card", answer: "not-taxable" },
  { text: "Freelance Web Design Pay", answer: "taxable" },
  { text: "Scholarship Money", answer: "not-taxable" },
  { text: "Garage Sale Earnings", answer: "taxable" },
  { text: "Inheritance from Relative", answer: "not-taxable" },
  { text: "Rental Income", answer: "taxable" },
  { text: "Lottery Winnings", answer: "taxable" },
  { text: "Child Support Received", answer: "not-taxable" },
  { text: "Bonus at Work", answer: "taxable" },
  { text: "Returned Security Deposit", answer: "not-taxable" },
  { text: "Commission on Sales", answer: "taxable" },
  { text: "Life Insurance Payout", answer: "not-taxable" },
];

const CREDIT_ITEMS: GameItem[] = [
  { text: "Pay all bills on time", answer: "helps" },
  { text: "Max out your credit card", answer: "hurts" },
  { text: "Check your credit report", answer: "helps" },
  { text: "Open 5 new credit cards at once", answer: "hurts" },
  { text: "Keep old accounts open", answer: "helps" },
  { text: "Miss a loan payment", answer: "hurts" },
  { text: "Use less than 30% of credit limit", answer: "helps" },
  { text: "Apply for many loans in one week", answer: "hurts" },
  { text: "Set up automatic payments", answer: "helps" },
  { text: "Close your oldest credit card", answer: "hurts" },
  { text: "Pay more than the minimum", answer: "helps" },
  { text: "Ignore bills and letters", answer: "hurts" },
  { text: "Have a mix of credit types", answer: "helps" },
  { text: "Co-sign a loan for a stranger", answer: "hurts" },
  { text: "Report errors on credit report", answer: "helps" },
  { text: "Take a cash advance", answer: "hurts" },
  { text: "Keep credit utilization low", answer: "helps" },
  { text: "Default on a student loan", answer: "hurts" },
  { text: "Build a long credit history", answer: "helps" },
  { text: "Only make minimum payments", answer: "hurts" },
];

// ---------------------------------------------------------------------------
// Game Config Map
// ---------------------------------------------------------------------------

interface GameConfig {
  items: GameItem[];
  buttonLabels: [string, string];
  buttonValues: [string, string];
  buttonColors: [string, string];
  icon: React.ReactNode;
}

const GAME_CONFIGS: Record<GameId, GameConfig> = {
  "budget-blitz": {
    items: BUDGET_ITEMS,
    buttonLabels: ["Need", "Want"],
    buttonValues: ["need", "want"],
    buttonColors: [
      "bg-green-500 hover:bg-green-600 text-white",
      "bg-orange-500 hover:bg-orange-600 text-white",
    ],
    icon: <ShoppingCart className="h-7 w-7" />,
  },
  "tax-dash": {
    items: TAX_ITEMS,
    buttonLabels: ["Taxable", "Not Taxable"],
    buttonValues: ["taxable", "not-taxable"],
    buttonColors: [
      "bg-purple-500 hover:bg-purple-600 text-white",
      "bg-teal-500 hover:bg-teal-600 text-white",
    ],
    icon: <Receipt className="h-7 w-7" />,
  },
  "credit-rush": {
    items: CREDIT_ITEMS,
    buttonLabels: ["Helps Score", "Hurts Score"],
    buttonValues: ["helps", "hurts"],
    buttonColors: [
      "bg-green-500 hover:bg-green-600 text-white",
      "bg-red-500 hover:bg-red-600 text-white",
    ],
    icon: <CreditCard className="h-7 w-7" />,
  },
};

const VALID_GAME_IDS: GameId[] = ["budget-blitz", "tax-dash", "credit-rush"];

// ---------------------------------------------------------------------------
// Shuffle utility (Fisher-Yates)
// ---------------------------------------------------------------------------

function shuffle<T>(array: readonly T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// ---------------------------------------------------------------------------
// Game Phases
// ---------------------------------------------------------------------------

type Phase = "pregame" | "playing" | "gameover";

// ---------------------------------------------------------------------------
// Feedback Flash Component
// ---------------------------------------------------------------------------

function FeedbackFlash({ isCorrect }: { isCorrect: boolean | null }) {
  if (isCorrect === null) return null;

  return (
    <motion.div
      className={`pointer-events-none absolute inset-0 z-20 rounded-2xl ${
        isCorrect ? "bg-green-400/20" : "bg-red-400/20"
      }`}
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    />
  );
}

// ---------------------------------------------------------------------------
// Arcade Game Page Component
// ---------------------------------------------------------------------------

export default function ArcadeGamePage() {
  const params = useParams();
  const router = useRouter();
  const gameParam = params.game as string;

  // Validate game param
  const isValidGame = VALID_GAME_IDS.includes(gameParam as GameId);
  const gameId = isValidGame ? (gameParam as GameId) : null;
  const arcadeGame: ArcadeGameConfig | undefined = ARCADE_GAMES.find(
    (g) => g.id === gameId
  );
  const gameConfig = gameId ? GAME_CONFIGS[gameId] : null;

  // Hooks
  const { tokens, spendTokens, canAfford, isLoaded: tokensLoaded } = useTokens();
  const { progress, updateXp, updateStreak } = useGameState();
  const { addArcadeScore } = useLocalProgress();
  const timer = useTimer(ARCADE_TIME_LIMIT);

  // Game State
  const [phase, setPhase] = useState<Phase>("pregame");
  const [items, setItems] = useState<GameItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [basePoints, setBasePoints] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [feedback, setFeedback] = useState<boolean | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const hasEndedRef = useRef(false);

  const currentMultiplier = getComboMultiplier(combo);

  // ---------------------------------------------------------------------------
  // End game handler
  // ---------------------------------------------------------------------------

  const endGame = useCallback(() => {
    if (hasEndedRef.current) return;
    hasEndedRef.current = true;

    timer.pause();
    setPhase("gameover");
  }, [timer]);

  // Watch for timer expiry
  useEffect(() => {
    if (timer.isExpired && phase === "playing") {
      endGame();
    }
  }, [timer.isExpired, phase, endGame]);

  // Check if all items answered
  useEffect(() => {
    if (phase === "playing" && items.length > 0 && currentIndex >= items.length) {
      endGame();
    }
  }, [currentIndex, items.length, phase, endGame]);

  // ---------------------------------------------------------------------------
  // Start game handler
  // ---------------------------------------------------------------------------

  const handleStartGame = useCallback(() => {
    if (!gameId || !gameConfig || !arcadeGame) return;

    const success = spendTokens(arcadeGame.tokenCost);
    if (!success) return;

    const shuffled = shuffle(gameConfig.items);
    setItems(shuffled);
    setCurrentIndex(0);
    setScore(0);
    setBasePoints(0);
    setCombo(0);
    setMaxCombo(0);
    setCorrectCount(0);
    setFeedback(null);
    hasEndedRef.current = false;
    timer.reset();

    setPhase("playing");
    timer.start();
  }, [gameId, gameConfig, arcadeGame, spendTokens, timer]);

  // ---------------------------------------------------------------------------
  // Answer handler
  // ---------------------------------------------------------------------------

  const handleAnswer = useCallback(
    (answer: string) => {
      if (phase !== "playing" || currentIndex >= items.length) return;

      const currentItem = items[currentIndex];
      const isCorrect = currentItem.answer === answer;
      const newCombo = updateCombo(combo, isCorrect);

      setFeedback(isCorrect);

      if (isCorrect) {
        const multiplier = getComboMultiplier(newCombo);
        const pointsEarned = Math.round(100 * multiplier);
        setBasePoints((prev) => prev + 100);
        setScore((prev) => prev + pointsEarned);
        setCorrectCount((prev) => prev + 1);
      }

      setCombo(newCombo);
      setMaxCombo((prev) => Math.max(prev, newCombo));

      // Clear feedback and advance after a short delay
      setTimeout(() => {
        setFeedback(null);
        setCurrentIndex((prev) => prev + 1);
      }, 250);
    },
    [phase, currentIndex, items, combo]
  );

  // ---------------------------------------------------------------------------
  // Final score calculations
  // ---------------------------------------------------------------------------

  const timeBonus = phase === "gameover" ? calculateTimeBonus(timer.timeLeft, ARCADE_TIME_LIMIT) : 0;
  const finalScore = phase === "gameover" ? score + timeBonus : score;
  const xpEarned = phase === "gameover" ? calculateXpEarned(finalScore, progress.currentStreak) : 0;

  // Save score on game over
  const hasSavedRef = useRef(false);
  useEffect(() => {
    if (phase === "gameover" && gameId && !hasSavedRef.current) {
      hasSavedRef.current = true;
      updateXp(xpEarned);
      updateStreak();
      addArcadeScore(gameId, finalScore, getComboMultiplier(maxCombo));
    }
  }, [phase, gameId, xpEarned, finalScore, maxCombo, updateXp, updateStreak, addArcadeScore]);

  // ---------------------------------------------------------------------------
  // Play again handler
  // ---------------------------------------------------------------------------

  const handlePlayAgain = useCallback(() => {
    if (!arcadeGame || !canAfford(arcadeGame.tokenCost)) {
      router.push("/arcade");
      return;
    }
    hasSavedRef.current = false;
    handleStartGame();
  }, [arcadeGame, canAfford, handleStartGame, router]);

  const handleBackToArcade = useCallback(() => {
    router.push("/arcade");
  }, [router]);

  // ---------------------------------------------------------------------------
  // Invalid game
  // ---------------------------------------------------------------------------

  if (!isValidGame || !gameId || !arcadeGame || !gameConfig) {
    return (
      <GameLayout title="Arcade" module="arcade" backHref="/arcade">
        <div className="flex flex-col items-center gap-6 py-16 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-red-100">
            <AlertCircle className="h-10 w-10 text-red-500" />
          </div>
          <h2 className="text-xl font-extrabold text-foreground">
            Game Not Found
          </h2>
          <p className="max-w-sm text-sm text-muted-foreground">
            The game &ldquo;{gameParam}&rdquo; doesn&rsquo;t exist. Choose a game from the Arcade!
          </p>
          <Link href="/arcade">
            <Button className="bg-amber-500 text-white hover:bg-amber-600">
              <ArrowLeft className="h-4 w-4" />
              Back to Arcade
            </Button>
          </Link>
        </div>
      </GameLayout>
    );
  }

  // ---------------------------------------------------------------------------
  // Pre-game Screen
  // ---------------------------------------------------------------------------

  if (phase === "pregame") {
    const affordable = canAfford(arcadeGame.tokenCost);

    return (
      <GameLayout title={arcadeGame.name} module="arcade" backHref="/arcade">
        <div className="flex flex-col items-center gap-8 py-8">
          {/* Game Icon */}
          <motion.div
            className="flex h-24 w-24 items-center justify-center rounded-3xl shadow-xl"
            style={{ backgroundColor: arcadeGame.color }}
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
          >
            <span className="text-white">{gameConfig.icon}</span>
          </motion.div>

          {/* Game Info */}
          <motion.div
            className="flex flex-col items-center gap-3 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h2 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
              {arcadeGame.name}
            </h2>
            <p className="max-w-sm text-sm text-muted-foreground">
              {arcadeGame.description}
            </p>
          </motion.div>

          {/* Rules Card */}
          <motion.div
            className="w-full max-w-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-2 border-amber-200">
              <CardContent className="flex flex-col gap-3 p-5">
                <h3 className="text-sm font-extrabold text-amber-700">
                  HOW TO PLAY
                </h3>
                {[
                  `You have ${ARCADE_TIME_LIMIT} seconds to answer as many questions as you can`,
                  `Choose "${gameConfig.buttonLabels[0]}" or "${gameConfig.buttonLabels[1]}" for each item`,
                  "Correct answers in a row build your combo multiplier!",
                  "Wrong answers reset your combo — stay sharp!",
                ].map((rule, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-100 text-xs font-extrabold text-amber-700">
                      {i + 1}
                    </span>
                    <p className="text-sm text-foreground">{rule}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Token Cost */}
          <motion.div
            className="flex items-center gap-3 rounded-xl bg-amber-50 px-5 py-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Coins className="h-5 w-5 text-amber-600" />
            <span className="text-sm font-bold text-amber-700">
              Cost: {arcadeGame.tokenCost} tokens
            </span>
            <span className="text-sm text-muted-foreground">
              (You have {tokens})
            </span>
          </motion.div>

          {/* Start Button */}
          <motion.div
            className="w-full max-w-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            {affordable ? (
              <Button
                size="lg"
                className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 text-white hover:from-amber-600 hover:to-yellow-600"
                onClick={handleStartGame}
              >
                <Play className="h-6 w-6" />
                Start Game!
              </Button>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full border-amber-300 text-amber-700"
                  disabled
                >
                  Not Enough Tokens
                </Button>
                <p className="text-sm font-bold text-muted-foreground">
                  Complete lessons to earn more tokens!
                </p>
                <Link href="/learn">
                  <Button variant="outline" className="border-green-300 text-green-700">
                    Go to Learn Path
                  </Button>
                </Link>
              </div>
            )}
          </motion.div>
        </div>
      </GameLayout>
    );
  }

  // ---------------------------------------------------------------------------
  // Game Over Screen
  // ---------------------------------------------------------------------------

  if (phase === "gameover") {
    const canPlayAgain = canAfford(arcadeGame.tokenCost);

    return (
      <GameLayout title={arcadeGame.name} module="arcade" backHref="/arcade">
        <div className="flex flex-col items-center gap-6 py-8">
          <GameOver
            score={finalScore}
            xpEarned={xpEarned}
            tokensEarned={0}
            comboMax={getComboMultiplier(maxCombo)}
            isGoodScore={correctCount >= items.length * 0.7}
            onPlayAgain={canPlayAgain ? handlePlayAgain : handleBackToArcade}
            onBackToDashboard={handleBackToArcade}
          />

          {/* Detailed Stats */}
          <motion.div
            className="w-full max-w-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Card className="border-2 border-amber-200">
              <CardContent className="flex flex-col gap-2 p-4">
                <h4 className="text-sm font-extrabold text-amber-700">
                  BREAKDOWN
                </h4>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Correct</span>
                  <span className="font-extrabold text-green-600">
                    {correctCount} / {Math.min(currentIndex, items.length)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Base Score</span>
                  <span className="font-extrabold tabular-nums text-foreground">
                    {score.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Time Bonus</span>
                  <span className="font-extrabold tabular-nums text-blue-600">
                    +{timeBonus.toLocaleString()}
                  </span>
                </div>
                <div className="border-t border-amber-100 pt-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-bold text-foreground">Final Score</span>
                    <span className="text-lg font-extrabold tabular-nums text-amber-700">
                      {finalScore.toLocaleString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {!canPlayAgain && (
            <motion.p
              className="text-center text-sm font-bold text-amber-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              Need more tokens to play again. Complete lessons to earn them!
            </motion.p>
          )}
        </div>
      </GameLayout>
    );
  }

  // ---------------------------------------------------------------------------
  // Active Gameplay
  // ---------------------------------------------------------------------------

  const currentItem = currentIndex < items.length ? items[currentIndex] : null;
  const progressPercent =
    items.length > 0 ? (currentIndex / items.length) * 100 : 0;

  return (
    <GameLayout
      title={arcadeGame.name}
      module="arcade"
      headerRight={
        <div className="flex items-center gap-3">
          <ScoreDisplay score={score} />
        </div>
      }
    >
      <div className="flex flex-col gap-6 pb-8">
        {/* Top Row: Timer + Combo */}
        <div className="flex items-start justify-between">
          <Timer timeLeft={timer.timeLeft} totalTime={ARCADE_TIME_LIMIT} />
          <ComboMeter multiplier={currentMultiplier} />
        </div>

        {/* Progress Bar */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between text-xs font-bold text-muted-foreground">
            <span>
              Question {Math.min(currentIndex + 1, items.length)} of {items.length}
            </span>
            <span>{correctCount} correct</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <motion.div
              className="h-full rounded-full bg-amber-500"
              animate={{ width: `${progressPercent}%` }}
              transition={{ type: "spring", stiffness: 200, damping: 25 }}
            />
          </div>
        </div>

        {/* Current Item Card */}
        <div className="relative min-h-[200px]">
          <AnimatePresence mode="wait">
            {currentItem && (
              <motion.div
                key={`item-${currentIndex}`}
                className="relative"
                initial={{ x: 80, opacity: 0, scale: 0.95 }}
                animate={{ x: 0, opacity: 1, scale: 1 }}
                exit={{ x: -80, opacity: 0, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              >
                <Card className="relative overflow-hidden border-3 border-amber-300 shadow-lg">
                  {/* Feedback Flash Overlay */}
                  <FeedbackFlash isCorrect={feedback} />

                  <CardContent className="flex flex-col items-center gap-4 p-8 sm:p-10">
                    {/* Item Icon */}
                    <div
                      className="flex h-16 w-16 items-center justify-center rounded-2xl shadow-md"
                      style={{ backgroundColor: arcadeGame.color }}
                    >
                      <span className="text-white">{gameConfig.icon}</span>
                    </div>

                    {/* Item Text */}
                    <h3 className="text-center text-xl font-extrabold text-foreground sm:text-2xl">
                      {currentItem.text}
                    </h3>

                    {/* Feedback Icon */}
                    <AnimatePresence>
                      {feedback !== null && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                          transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 15,
                          }}
                        >
                          {feedback ? (
                            <CheckCircle2 className="h-10 w-10 text-green-500" />
                          ) : (
                            <XCircle className="h-10 w-10 text-red-500" />
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Answer Buttons */}
        {currentItem && (
          <div className="grid grid-cols-2 gap-4">
            {gameConfig.buttonLabels.map((label, idx) => (
              <motion.button
                key={label}
                className={`flex h-16 items-center justify-center rounded-2xl text-lg font-extrabold shadow-md transition-transform active:scale-95 sm:h-20 sm:text-xl ${gameConfig.buttonColors[idx]}`}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleAnswer(gameConfig.buttonValues[idx])}
                disabled={feedback !== null}
              >
                {label}
              </motion.button>
            ))}
          </div>
        )}
      </div>
    </GameLayout>
  );
}
