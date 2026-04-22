"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const sections = [
  {
    emoji: "📚",
    title: "Learn Path",
    color: "border-emerald-400 bg-emerald-50",
    titleColor: "text-emerald-700",
    steps: [
      "Pick a topic: Credit, Taxes, or Budgeting.",
      "Read the micro-lesson and flip through the flashcards.",
      "Take the knowledge-check quiz at the end.",
      "Pass → earn XP + Arcade Tokens. Fail → review the lesson and retry.",
    ],
  },
  {
    emoji: "🏠",
    title: "Life Simulator",
    color: "border-purple-400 bg-purple-50",
    titleColor: "text-purple-700",
    steps: [
      "You're assigned a random age, salary, and starting balance.",
      "Each month: view your fixed expenses, then allocate the rest across Savings, Spending, and Investing.",
      "A random life event hits (flat tire, medical bill, job bonus…) — it affects your balance and credit score.",
      "Survive as many months as possible. If your balance hits $0 → BANKRUPT.",
    ],
  },
  {
    emoji: "🕹️",
    title: "Mini-Game Arcade",
    color: "border-amber-400 bg-amber-50",
    titleColor: "text-amber-700",
    steps: [
      "Spend Arcade Tokens (earned in Learn Path) to play games.",
      "7 games available: Need or Want, Credit Climb, Budget Blitz, Tax Trivia, Savings Race, Stock Surge, and Comic Adventure.",
      "Each game is 60–90 seconds. Build answer streaks to activate combo multipliers.",
      "Finish a game → earn XP and unlock cosmetics.",
    ],
  },
];

const tips = [
  { emoji: "🔥", text: "Log in every day to keep your streak alive — streaks boost XP earnings." },
  { emoji: "💰", text: "Always keep an emergency fund in the Life Simulator. Life events are random and expensive." },
  { emoji: "⚡", text: "Combo multipliers in the Arcade can triple your score — don't break your streak." },
  { emoji: "🎯", text: "Start with Learn Path to bank Arcade Tokens before hitting the games." },
  { emoji: "📈", text: "In Credit Climb, paying bills on time and keeping low balances raises your score fastest." },
];

export default function GuidePage() {
  return (
    <div className="flex flex-col gap-8 pb-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="flex flex-col gap-2"
      >
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
          How to Play CashQuest
        </h1>
        <p className="text-muted-foreground text-sm font-medium">
          Everything you need to know to earn XP, survive the simulator, and dominate the arcade.
        </p>
      </motion.div>

      {/* Module sections */}
      {sections.map((section, i) => (
        <motion.div
          key={section.title}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1, type: "spring", stiffness: 200, damping: 20 }}
          className={`rounded-2xl border-2 p-6 ${section.color}`}
        >
          <h2 className={`mb-4 flex items-center gap-2 text-xl font-extrabold ${section.titleColor}`}>
            <span className="text-2xl">{section.emoji}</span>
            {section.title}
          </h2>
          <ol className="flex flex-col gap-3">
            {section.steps.map((step, j) => (
              <li key={j} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white text-xs font-extrabold text-gray-700 shadow-sm">
                  {j + 1}
                </span>
                <span className="text-sm leading-relaxed text-gray-700">{step}</span>
              </li>
            ))}
          </ol>
        </motion.div>
      ))}

      {/* Tips */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, type: "spring", stiffness: 200, damping: 20 }}
        className="rounded-2xl border-2 border-sky-300 bg-sky-50 p-6"
      >
        <h2 className="mb-4 flex items-center gap-2 text-xl font-extrabold text-sky-700">
          <span className="text-2xl">💡</span>
          Pro Tips
        </h2>
        <ul className="flex flex-col gap-3">
          {tips.map((tip, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-gray-700 leading-relaxed">
              <span className="text-lg">{tip.emoji}</span>
              {tip.text}
            </li>
          ))}
        </ul>
      </motion.div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.45 }}
        className="flex flex-wrap gap-3"
      >
        <Link
          href="/learn"
          className="flex min-h-[44px] items-center rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-bold text-white shadow transition-colors hover:bg-emerald-700"
        >
          Start Learning →
        </Link>
        <Link
          href="/simulator"
          className="flex min-h-[44px] items-center rounded-xl bg-purple-600 px-6 py-2.5 text-sm font-bold text-white shadow transition-colors hover:bg-purple-700"
        >
          Try the Simulator →
        </Link>
        <Link
          href="/minigames"
          className="flex min-h-[44px] items-center rounded-xl bg-amber-500 px-6 py-2.5 text-sm font-bold text-white shadow transition-colors hover:bg-amber-600"
        >
          Hit the Arcade →
        </Link>
      </motion.div>
    </div>
  );
}
