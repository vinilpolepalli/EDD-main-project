"use client";

import { motion } from "framer-motion";
import Link from "next/link";

type Step = {
  title: string;
  body: string;
  callouts?: string[];
};

type Section = {
  id: string;
  emoji: string;
  label: string;
  title: string;
  intro: string;
  borderClass: string;
  bgClass: string;
  badgeClass: string;
  titleColorClass: string;
  steps: Step[];
};

const sections: Section[] = [
  {
    id: "getting-in",
    emoji: "🚪",
    label: "Step 1",
    title: "Getting Into CashQuest",
    intro:
      "Everything starts at cashquest-two.vercel.app. From the landing page you can sign up, log in, or jump straight to the dashboard.",
    borderClass: "border-accent",
    bgClass: "bg-accent-soft",
    badgeClass: "bg-accent text-white",
    titleColorClass: "text-accent",
    steps: [
      {
        title: "Open the landing page",
        body: "Go to https://cashquest-two.vercel.app. The first screen is the CashQuest landing page — it shows what the app does and how to get started.",
        callouts: [
          "Top-right Login takes you to the sign-in screen.",
          "Top-right Get Started takes you to the sign-up screen.",
          "The two buttons in the hero (Start for Free / I have an account) do the exact same thing as the navbar buttons.",
        ],
      },
      {
        title: "Choose Sign Up or Log In",
        body: "If you already have an account, click Login or I have an account. New users should click either Get Started button to make a profile.",
      },
    ],
  },
  {
    id: "sign-up",
    emoji: "🔐",
    label: "Step 2",
    title: "Creating Your Account",
    intro:
      "CashQuest uses Clerk to handle authentication. You can sign up with email + password, or with Google or Apple — we recommend Google or Apple since we don't yet have 2-factor auth.",
    borderClass: "border-accent",
    bgClass: "bg-accent-soft",
    badgeClass: "bg-accent text-white",
    titleColorClass: "text-accent",
    steps: [
      {
        title: "Pick a sign-up method",
        body: "On the Create your account screen, choose Apple, Google, or sign up with email and password. Apple and Google are the more secure options.",
      },
      {
        title: "Authorize with Clerk (Google / Apple)",
        body: "Clerk shows a Sign in to Clerk screen. Google or Apple will share only your name and email — that is all the data CashQuest stores. Click Continue to finish.",
      },
      {
        title: "Or finish with email",
        body: "If you signed up with email, enter your address and create a password, then click Continue. You can edit your display name on the next screen.",
      },
      {
        title: "Add a profile picture",
        body: "On the Add a Profile Picture screen, click the avatar circle to upload a PNG, JPG, WEBP, or GIF (max 5 MB). Hit Save & Start Playing — or click Skip for now to use your initials.",
      },
    ],
  },
  {
    id: "dashboard",
    emoji: "🏡",
    label: "Step 3",
    title: "Your Dashboard",
    intro:
      "The dashboard is your home base. It shows your XP, streak, level, and lessons done, and gives you two ways to jump into any module.",
    borderClass: "border-accent",
    bgClass: "bg-accent-soft",
    badgeClass: "bg-accent text-white",
    titleColorClass: "text-accent",
    steps: [
      {
        title: "Use the sidebar for fast navigation",
        body: "The left sidebar lists every page in CashQuest: Dashboard, Learn, Life Simulator, Mini-Games, and How to Play. Click any item to go straight there.",
      },
      {
        title: "Or use the module cards",
        body: "The three big cards in the middle (Learn Path, Life Simulator, Mini-Games) are a second way to launch each module — useful on smaller screens.",
      },
      {
        title: "Track your progress at a glance",
        body: "The top stat row shows your total XP, current level, daily streak, and lessons completed. Logging in every day keeps your streak going.",
      },
    ],
  },
  {
    id: "learn",
    emoji: "📚",
    label: "Step 4",
    title: "Learn Path",
    intro:
      "The Learn Path is your Duolingo-style track of micro-lessons. Each topic is a row of circles you click through in order — and every unit ends with a quiz.",
    borderClass: "border-accent",
    bgClass: "bg-accent-soft",
    badgeClass: "bg-accent text-white",
    titleColorClass: "text-accent",
    steps: [
      {
        title: "Pick a lesson circle",
        body: "Each circle on the Learn Path is one micro-lesson. Some are locked until you finish the previous one — finish in order to unlock the rest.",
      },
      {
        title: "Read the lesson + flashcards",
        body: "Every lesson opens with a short blurb explaining the concept (for example, Why Budgets Are Powerful) and a stack of flashcards for the key terms.",
      },
      {
        title: "Take the end-of-unit quiz",
        body: "After the last lesson in a unit, you'll get a knowledge-check quiz. Pass to earn XP and Arcade Tokens. Fail and you'll loop back to review the flashcards.",
      },
      {
        title: "Aligned to CEE standards",
        body: "Lessons cover Credit, Taxes, and Budgeting and are tagged to the Council for Economic Education (CEE) standards we're aiming to meet.",
      },
    ],
  },
  {
    id: "simulator",
    emoji: "🏠",
    label: "Step 5",
    title: "Life Simulator",
    intro:
      "Life Simulator drops you into a fictional adult life and asks you to budget month by month. Every choice changes your balance, debt, and credit score.",
    borderClass: "border-paper-2",
    bgClass: "bg-paper-2",
    badgeClass: "bg-ink text-white",
    titleColorClass: "text-ink",
    steps: [
      {
        title: "Open the Life Simulator",
        body: "From the simulator landing page, hit Start New Simulation in the purple banner. The How It Works panel below explains the rules, and Previous Runs at the bottom shows past attempts.",
      },
      {
        title: "Choose your life",
        body: "Pick a starting scenario: Fresh Graduate, Young Professional, Mid-Career, Gig Economy Worker, or Surprise Me. Each one comes with its own age, salary, savings, debt, and goal — for example, the Fresh Graduate's goal is to pay off student loans as fast as possible.",
      },
      {
        title: "Allocate your monthly budget",
        body: "On the simulator dashboard, drag the sliders to split your monthly money across Emergency Fund, Savings, Investing, and Spending. You'll get periodic alerts as your stats change.",
      },
      {
        title: "Survive random life events",
        body: "Each month a random event hits — a flat tire, a tax refund, a medical bill, a job bonus. The event applies to your balance and credit score before the next month begins.",
      },
      {
        title: "Don't go bankrupt",
        body: "If your balance hits $0 with debt remaining, the run ends in BANKRUPT. Your goal is to survive as many months as possible and hit your scenario's goal.",
      },
    ],
  },
  {
    id: "arcade",
    emoji: "🕹️",
    label: "Step 6",
    title: "Mini-Game Arcade",
    intro:
      "The arcade is where you spend the Arcade Tokens you earned in Learn Path. There are 7 fast 60-second games covering different finance concepts.",
    borderClass: "border-paper-2",
    bgClass: "bg-paper-2",
    badgeClass: "bg-accent text-white",
    titleColorClass: "text-accent",
    steps: [
      {
        title: "Browse the arcade",
        body: "Open the Mini-Game Arcade to see all 7 games as colorful tiles. Pick one to start, or use the topic filters at the top to narrow them down.",
      },
      {
        title: "Filter by topic",
        body: "Filter the library by Budgeting, Credit, Taxes, Saving, Investing, or All Topics. Useful when you want to drill the exact skill from your last lesson.",
      },
      {
        title: "Play a 60-second round",
        body: "Each game is a 60-to-90-second drill. Need or Want shows an item and you tap Need or Want as fast as you can — correct answers add to your score.",
      },
      {
        title: "Build combos for big scores",
        body: "Streaks of correct answers activate combo multipliers that can multiply your score. Break the streak and the multiplier resets.",
      },
      {
        title: "Earn XP + cosmetics",
        body: "Finishing a game awards XP and can unlock cosmetics. Then play again or head back to the dashboard.",
      },
    ],
  },
];

const tips = [
  { emoji: "🔥", text: "Log in every day to keep your streak alive — streaks boost XP earnings on every module." },
  { emoji: "💰", text: "Always keep an Emergency Fund slider above 0% in the Life Simulator. Random events are expensive." },
  { emoji: "⚡", text: "Combo multipliers in the arcade can triple your score — don't break the streak on easy questions." },
  { emoji: "🎯", text: "Start with Learn Path to bank Arcade Tokens before heading to the games." },
  { emoji: "🛡️", text: "Sign in with Google or Apple if you can — we don't have 2-factor auth yet, so it's the safest option." },
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
          A step-by-step walkthrough from your first sign-up to dominating the arcade.
        </p>
      </motion.div>

      {/* Quick jump nav */}
      <motion.nav
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05, type: "spring", stiffness: 200, damping: 20 }}
        className="flex flex-wrap gap-2"
        aria-label="Jump to section"
      >
        {sections.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className="flex min-h-[44px] items-center gap-2 rounded-full border-2 border-gray-200 bg-white px-4 py-2 text-xs font-bold text-gray-700 shadow-sm transition-colors hover:border-accent hover:text-accent"
          >
            <span className="text-base">{s.emoji}</span>
            {s.title}
          </a>
        ))}
      </motion.nav>

      {/* Walkthrough sections */}
      {sections.map((section, i) => (
        <motion.section
          key={section.id}
          id={section.id}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ delay: i * 0.05, type: "spring", stiffness: 200, damping: 22 }}
          className={`scroll-mt-6 rounded-2xl border-2 ${section.borderClass} ${section.bgClass} p-6`}
        >
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <span
                className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-extrabold uppercase tracking-wide ${section.badgeClass}`}
              >
                {section.label}
              </span>
              <h2
                className={`flex items-center gap-2 text-xl font-extrabold ${section.titleColorClass}`}
              >
                <span className="text-2xl">{section.emoji}</span>
                {section.title}
              </h2>
            </div>
            <p className="text-sm leading-relaxed text-gray-700">{section.intro}</p>

            <ol className="flex flex-col gap-4">
              {section.steps.map((step, j) => (
                <li
                  key={j}
                  className="flex items-start gap-3 rounded-xl bg-white/70 p-4 shadow-sm"
                >
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-xs font-extrabold text-gray-700 shadow-sm ring-1 ring-gray-200">
                    {j + 1}
                  </span>
                  <div className="flex flex-col gap-2">
                    <h3 className="text-sm font-extrabold text-gray-900">
                      {step.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-gray-700">{step.body}</p>
                    {step.callouts && step.callouts.length > 0 && (
                      <ul className="mt-1 flex flex-col gap-1.5 rounded-lg bg-white/80 p-3 ring-1 ring-gray-200">
                        {step.callouts.map((c, k) => (
                          <li
                            key={k}
                            className="flex items-start gap-2 text-xs leading-relaxed text-gray-600"
                          >
                            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-400" />
                            {c}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </motion.section>
      ))}

      {/* Tips */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ type: "spring", stiffness: 200, damping: 22 }}
        className="rounded-2xl border-2 border-paper-2 bg-paper-2 p-6"
      >
        <h2 className="mb-4 flex items-center gap-2 text-xl font-extrabold text-ink">
          <span className="text-2xl">💡</span>
          Pro Tips
        </h2>
        <ul className="flex flex-col gap-3">
          {tips.map((tip, i) => (
            <li
              key={i}
              className="flex items-start gap-3 text-sm leading-relaxed text-gray-700"
            >
              <span className="text-lg">{tip.emoji}</span>
              {tip.text}
            </li>
          ))}
        </ul>
      </motion.div>

      {/* Disclaimer */}
      <p className="text-center text-xs text-muted-foreground">
        All game content and financial advice is for educational purposes only and does not
        constitute professional financial advice.
      </p>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.45 }}
        className="flex flex-wrap gap-3"
      >
        <Link
          href="/learn"
          className="flex min-h-[44px] items-center rounded-xl bg-accent px-6 py-2.5 text-sm font-bold text-white shadow transition-colors hover:bg-accent"
        >
          Start Learning →
        </Link>
        <Link
          href="/simulator"
          className="flex min-h-[44px] items-center rounded-xl bg-ink px-6 py-2.5 text-sm font-bold text-white shadow transition-colors hover:bg-ink"
        >
          Try the Simulator →
        </Link>
        <Link
          href="/minigames"
          className="flex min-h-[44px] items-center rounded-xl bg-accent px-6 py-2.5 text-sm font-bold text-white shadow transition-colors hover:bg-accent"
        >
          Hit the Arcade →
        </Link>
      </motion.div>
    </div>
  );
}
