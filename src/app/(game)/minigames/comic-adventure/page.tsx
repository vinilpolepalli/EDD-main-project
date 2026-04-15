"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GameLayout } from "@/components/shared/game-layout";
import { Button } from "@/components/ui/button";
import { useLocalProgress } from "@/hooks/use-local-progress";
import { cn } from "@/lib/utils";
import type { GameId } from "@/types/game";

interface Choice {
  label: string;
  outcome: string;
  balanceDelta: number;
  creditDelta: number;
  happinessDelta: number;
  ceeLesson: string;
}

interface Scene {
  id: string;
  panel: number;
  setting: string;
  situation: string;
  question: string;
  choices: Choice[];
}

const SCENES: Scene[] = [
  {
    id: "scene-1",
    panel: 1,
    setting: "🎓 College Move-In Day",
    situation: "Alex just moved into their first dorm. The campus bookstore sells required textbooks for $400. A student at the door offers the same books used for $180, or Alex can rent them online for $80/semester.",
    question: "How does Alex get the textbooks?",
    choices: [
      { label: "Buy new from bookstore ($400)", outcome: "Alex has the books but spent $400. No resale value next year.", balanceDelta: -400, creditDelta: 0, happinessDelta: 5, ceeLesson: "New is often the most expensive option — alternatives exist." },
      { label: "Buy used from student ($180)", outcome: "Good deal! Alex saves $220 and can resell later.", balanceDelta: -180, creditDelta: 0, happinessDelta: 8, ceeLesson: "Secondhand purchases stretch your budget significantly." },
      { label: "Rent online ($80)", outcome: "Cheapest option this semester, but Alex pays again next time if needed.", balanceDelta: -80, creditDelta: 0, happinessDelta: 6, ceeLesson: "Renting vs buying depends on how long you need something." },
    ],
  },
  {
    id: "scene-2",
    panel: 2,
    setting: "💳 First Credit Card Offer",
    situation: "Alex gets a pre-approved credit card offer in the mail: $500 limit, 24% APR. A friend says 'don't get one, they're dangerous.' The financial aid office says 'use it for emergencies only and pay in full each month.'",
    question: "What does Alex do?",
    choices: [
      { label: "Decline — credit cards are too risky", outcome: "Alex avoids debt but also doesn't build any credit history.", balanceDelta: 0, creditDelta: -5, happinessDelta: 3, ceeLesson: "Not having credit can make it harder to rent an apartment or get a car loan later." },
      { label: "Accept and use responsibly, pay in full monthly", outcome: "Alex starts building credit responsibly.", balanceDelta: 0, creditDelta: 15, happinessDelta: 7, ceeLesson: "Paying your balance in full each month costs nothing in interest and builds credit." },
      { label: "Accept and use it for fun spending", outcome: "Alex racks up $300 in debt at 24% APR. Minimum payments barely cover interest.", balanceDelta: -300, creditDelta: -10, happinessDelta: -5, ceeLesson: "Carrying a balance on a high-APR card is one of the most expensive financial mistakes." },
    ],
  },
  {
    id: "scene-3",
    panel: 3,
    setting: "💼 First Real Job Offer",
    situation: "Alex graduates and gets a $42,000/yr job offer. Take-home after taxes is about $2,900/month. Rent in a nice apartment is $1,400/mo. Rent with a roommate is $750/mo each. Alex also has $18,000 in student loans.",
    question: "Where does Alex live?",
    choices: [
      { label: "Nice apartment alone ($1,400/mo)", outcome: "Alex enjoys the space but has only $200/mo left after bills. Zero savings.", balanceDelta: -200, creditDelta: 0, happinessDelta: 8, ceeLesson: "Housing should cost no more than 30% of gross income." },
      { label: "Share with a roommate ($750/mo)", outcome: "Alex saves $650/mo. Emergency fund grows fast.", balanceDelta: 650, creditDelta: 5, happinessDelta: 5, ceeLesson: "Shared housing is one of the biggest levers for early financial progress." },
      { label: "Move back home (free)", outcome: "Alex saves $1,400/mo but feels limited. Uses it to attack student loans aggressively.", balanceDelta: 1400, creditDelta: 10, happinessDelta: 2, ceeLesson: "Short-term sacrifice for long-term gain is a valid financial strategy." },
    ],
  },
  {
    id: "scene-4",
    panel: 4,
    setting: "🚨 The Emergency",
    situation: "Alex's car breaks down. The mechanic quotes $900 to fix it — needed to commute to work. Alex has $600 in savings. Options: drain the savings and put $300 on a credit card, take a payday loan for the full $900, or ask family for a short-term loan.",
    question: "How does Alex handle the emergency?",
    choices: [
      { label: "Savings + $300 credit card", outcome: "Emergency fund gone, small debt, but situation resolved without predatory interest.", balanceDelta: -600, creditDelta: -5, happinessDelta: 3, ceeLesson: "Using savings + a little credit for emergencies beats high-interest alternatives." },
      { label: "Payday loan ($900 at 400% APR)", outcome: "The loan costs $1,200 to repay next month. Alex spirals into debt.", balanceDelta: -1200, creditDelta: -20, happinessDelta: -15, ceeLesson: "Payday loans have APRs that can exceed 400%. Avoid them at all costs." },
      { label: "Interest-free family loan", outcome: "Alex pays family back over 3 months. No interest, maintains relationship.", balanceDelta: 0, creditDelta: 0, happinessDelta: 5, ceeLesson: "When available, personal loans from trusted family can be the safest emergency option." },
    ],
  },
  {
    id: "scene-5",
    panel: 5,
    setting: "📈 The 401(k) Decision",
    situation: "Alex's employer offers a 401(k) with 4% employer match. Contributing 4% of Alex's $42,000 salary = $1,680/yr from Alex + $1,680 free from the employer. Alex worries about having less take-home pay now.",
    question: "Does Alex contribute to the 401(k)?",
    choices: [
      { label: "No contribution — need every dollar now", outcome: "Alex misses $1,680/yr in free money. Over 30 years this costs over $200,000 in lost growth.", balanceDelta: 0, creditDelta: 0, happinessDelta: -3, ceeLesson: "Not capturing an employer match is leaving part of your salary on the table." },
      { label: "Contribute 4% to get the full match", outcome: "Alex earns $1,680 in free employer money annually, compounding tax-deferred.", balanceDelta: 140, creditDelta: 0, happinessDelta: 8, ceeLesson: "Always contribute at least enough to capture the full employer match — it's an instant 100% return." },
      { label: "Contribute 10% (more than match)", outcome: "Alex reduces take-home but maximizes tax-advantaged retirement savings.", balanceDelta: -100, creditDelta: 0, happinessDelta: 6, ceeLesson: "Saving more than the match accelerates long-term wealth significantly." },
    ],
  },
];

function getEndingNarrative(totalBalance: number, totalCredit: number, totalHappiness: number): string {
  if (totalBalance > 500 && totalCredit > 10 && totalHappiness > 20) {
    return "Alex made smart, consistent choices at every turn — building credit, growing savings, and maintaining happiness. This is the foundation of financial independence.";
  }
  if (totalBalance > 0 || totalCredit > 0) {
    return "Alex learned some hard lessons along the way but made some solid moves. With experience comes wisdom — the next chapter will be even better.";
  }
  return "Alex struggled, but these are lessons real adults face every day. The most important step is learning from each decision. Alex has already started.";
}

export default function ComicAdventurePage() {
  const { addArcadeScore } = useLocalProgress();

  const [currentPanel, setCurrentPanel] = useState(0);
  const [phase, setPhase] = useState<"choice" | "reveal" | "ended">("choice");
  const [totalBalance, setTotalBalance] = useState(0);
  const [totalCredit, setTotalCredit] = useState(0);
  const [totalHappiness, setTotalHappiness] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<Choice | null>(null);

  useEffect(() => {
    if (phase === "ended") {
      const totalScore = Math.round(totalBalance + totalCredit * 10 + totalHappiness * 5);
      addArcadeScore("comic-adventure" as GameId, totalScore, 1);
    }
  }, [phase, totalBalance, totalCredit, totalHappiness, addArcadeScore]);

  const handleChoice = useCallback((choice: Choice) => {
    if (phase !== "choice") return;
    setSelectedChoice(choice);
    setTotalBalance((b) => b + choice.balanceDelta);
    setTotalCredit((c) => c + choice.creditDelta);
    setTotalHappiness((h) => h + choice.happinessDelta);
    setPhase("reveal");
  }, [phase]);

  const handleNext = useCallback(() => {
    if (currentPanel + 1 >= SCENES.length) {
      setPhase("ended");
    } else {
      setCurrentPanel((p) => p + 1);
      setSelectedChoice(null);
      setPhase("choice");
    }
  }, [currentPanel]);

  const handlePlayAgain = useCallback(() => {
    setCurrentPanel(0);
    setPhase("choice");
    setTotalBalance(0);
    setTotalCredit(0);
    setTotalHappiness(0);
    setSelectedChoice(null);
  }, []);

  const scene = SCENES[currentPanel];

  return (
    <GameLayout
      title="Comic Adventure"
      module="arcade"
      backHref="/minigames"
    >
      <div className="flex flex-col items-center gap-5 py-4">
        {/* Running stats */}
        {phase !== "ended" && (
          <motion.div
            className="flex w-full max-w-md items-center justify-around rounded-2xl border-2 border-border bg-card p-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="flex flex-col items-center">
              <span className="text-base font-extrabold">
                {totalBalance >= 0 ? "+" : ""}{totalBalance}
              </span>
              <span className="text-[10px] font-bold text-muted-foreground">💰 Balance</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-base font-extrabold">
                {totalCredit >= 0 ? "+" : ""}{totalCredit}
              </span>
              <span className="text-[10px] font-bold text-muted-foreground">📊 Credit</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-base font-extrabold">
                {totalHappiness >= 0 ? "+" : ""}{totalHappiness}
              </span>
              <span className="text-[10px] font-bold text-muted-foreground">😊 Happiness</span>
            </div>
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          {phase !== "ended" && (
            <motion.div
              key={`panel-${currentPanel}`}
              className="flex w-full max-w-md flex-col gap-5"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              {/* Panel progress */}
              <div className="flex items-center gap-2">
                {SCENES.map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      "h-2 flex-1 rounded-full transition-colors",
                      i < currentPanel ? "bg-primary" : i === currentPanel ? "bg-primary/50" : "bg-muted"
                    )}
                  />
                ))}
              </div>
              <p className="text-xs font-bold text-muted-foreground text-center">
                Panel {currentPanel + 1} of {SCENES.length}
              </p>

              {/* Scene card */}
              <div className="rounded-2xl border-2 border-border bg-card p-5 shadow-sm">
                <div className="mb-3 flex items-center gap-2">
                  <span className="text-sm font-extrabold">{scene.setting}</span>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">{scene.situation}</p>
                <p className="mt-3 text-sm font-extrabold text-foreground">{scene.question}</p>
              </div>

              {/* Choices / Reveal */}
              {phase === "choice" && (
                <div className="flex flex-col gap-3">
                  {scene.choices.map((choice, i) => (
                    <motion.button
                      key={i}
                      onClick={() => handleChoice(choice)}
                      className="min-h-[56px] rounded-2xl border-2 border-border bg-card px-4 py-3 text-left text-sm font-bold hover:bg-muted transition-colors"
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      {choice.label}
                    </motion.button>
                  ))}
                </div>
              )}

              {phase === "reveal" && selectedChoice && (
                <motion.div
                  className="flex flex-col gap-3"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="rounded-2xl border-2 border-primary/20 bg-primary/5 p-4">
                    <p className="text-sm font-bold text-foreground">{selectedChoice.outcome}</p>
                    <div className="mt-2 flex gap-3 text-xs font-bold">
                      <span className={selectedChoice.balanceDelta >= 0 ? "text-emerald-600" : "text-red-600"}>
                        💰 {selectedChoice.balanceDelta >= 0 ? "+" : ""}{selectedChoice.balanceDelta}
                      </span>
                      <span className={selectedChoice.creditDelta >= 0 ? "text-emerald-600" : "text-red-600"}>
                        📊 {selectedChoice.creditDelta >= 0 ? "+" : ""}{selectedChoice.creditDelta}
                      </span>
                      <span className={selectedChoice.happinessDelta >= 0 ? "text-emerald-600" : "text-red-600"}>
                        😊 {selectedChoice.happinessDelta >= 0 ? "+" : ""}{selectedChoice.happinessDelta}
                      </span>
                    </div>
                  </div>
                  <div className="rounded-xl border border-border bg-muted/30 px-4 py-3">
                    <p className="text-xs font-bold text-muted-foreground">💡 Lesson</p>
                    <p className="mt-0.5 text-sm font-semibold text-foreground">{selectedChoice.ceeLesson}</p>
                  </div>
                  <Button
                    className="min-h-[48px] w-full rounded-xl bg-primary font-extrabold text-white"
                    onClick={handleNext}
                  >
                    {currentPanel + 1 >= SCENES.length ? "See Your Story →" : "Next Panel →"}
                  </Button>
                </motion.div>
              )}

              <p className="text-center text-[10px] font-mono text-muted-foreground/60">
                📚 CEE.PF.1 — Earning Income
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
              <span className="text-6xl">📖</span>
              <h2 className="text-2xl font-extrabold">Your Story</h2>

              <div className="flex w-full justify-around rounded-2xl border-2 border-border bg-card p-4">
                <div className="flex flex-col items-center gap-1">
                  <span className={cn("text-xl font-extrabold", totalBalance >= 0 ? "text-emerald-600" : "text-red-600")}>
                    {totalBalance >= 0 ? "+" : ""}{totalBalance}
                  </span>
                  <span className="text-[10px] font-bold text-muted-foreground">Balance</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <span className={cn("text-xl font-extrabold", totalCredit >= 0 ? "text-emerald-600" : "text-red-600")}>
                    {totalCredit >= 0 ? "+" : ""}{totalCredit}
                  </span>
                  <span className="text-[10px] font-bold text-muted-foreground">Credit</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <span className={cn("text-xl font-extrabold", totalHappiness >= 0 ? "text-emerald-600" : "text-red-600")}>
                    {totalHappiness >= 0 ? "+" : ""}{totalHappiness}
                  </span>
                  <span className="text-[10px] font-bold text-muted-foreground">Happiness</span>
                </div>
              </div>

              <p className="text-sm leading-relaxed text-muted-foreground">
                {getEndingNarrative(totalBalance, totalCredit, totalHappiness)}
              </p>

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
