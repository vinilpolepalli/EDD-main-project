"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Flame } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { useGameState } from "@/hooks/use-game-state";
import { useLocalProgress } from "@/hooks/use-local-progress";
import {
  getLevel,
  getXpForCurrentLevel,
} from "@/components/dashboard/xp-bar";

const DAILY_TIPS = [
  "The earlier you start saving, the more your money grows thanks to compound interest.",
  "A budget is a plan for your money — it tells every dollar where to go.",
  "Your credit score is like a report card for how you handle money.",
  "Paying bills on time is one of the best ways to build a strong credit score.",
  "An emergency fund is money saved for unexpected expenses, like a flat tire.",
  "The difference between needs and wants is key to smart spending.",
  "Investing means putting money to work so it can grow over time.",
  "Taxes help pay for schools, roads, and other public services we all use.",
  "A good rule of thumb: save at least 20% of your income each month.",
  "Diversifying investments means not putting all your eggs in one basket.",
] as const;

function getDailyTip(): string {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) /
      86400000,
  );
  return DAILY_TIPS[dayOfYear % DAILY_TIPS.length];
}

interface StatCardProps {
  label: string;
  value: string | number;
  hint?: string;
  accent?: boolean;
}

function StatCard({ label, value, hint, accent }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-line bg-white p-6">
      <div className="font-sans text-[0.7rem] font-medium uppercase tracking-[0.12em] text-muted">
        {label}
      </div>
      <div
        className={`mt-3 font-serif font-normal ${accent ? "text-accent" : "text-ink"}`}
        style={{ fontSize: "2.25rem", lineHeight: 1 }}
      >
        {value}
      </div>
      {hint && (
        <div className="mt-2 font-sans text-[0.8125rem] text-muted">
          {hint}
        </div>
      )}
    </div>
  );
}

interface SparklineProps {
  data: number[];
  height?: number;
}

/** Hand-rolled SVG sparkline, no dep needed. */
function Sparkline({ data, height = 80 }: SparklineProps) {
  if (data.length === 0) return null;
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const range = max - min || 1;
  const stepX = 100 / (data.length - 1 || 1);
  const points = data
    .map((v, i) => {
      const x = i * stepX;
      const y = 100 - ((v - min) / range) * 100;
      return `${x},${y}`;
    })
    .join(" ");
  const areaPath = `M0,100 L${points
    .split(" ")
    .join(" L")} L100,100 Z`;

  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className="block w-full"
      style={{ height }}
      aria-hidden
    >
      <defs>
        <linearGradient id="spark-fill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.18" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill="url(#spark-fill)" className="text-accent" />
      <polyline
        points={points}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
        className="text-accent"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

export default function DashboardPage() {
  const { user } = useUser();
  const { progress, isLoaded: gameLoaded, updateStreak } = useGameState();
  const {
    completedLessons,
    simulatorRuns,
    arcadeScores,
    isLoaded: localLoaded,
    getSimulatorBest,
  } = useLocalProgress();

  const [dailyTip] = useState(getDailyTip);

  useEffect(() => {
    if (gameLoaded) updateStreak();
  }, [gameLoaded, updateStreak]);

  const isLoaded = gameLoaded && localLoaded;

  const level = isLoaded ? getLevel(progress.totalXp) : 1;
  const { current, required } = isLoaded
    ? getXpForCurrentLevel(progress.totalXp)
    : { current: 0, required: 100 };
  const xpPercent = Math.min((current / required) * 100, 100);

  const simulatorBest = useMemo(() => getSimulatorBest(), [getSimulatorBest]);
  const arcadeHigh = useMemo(() => {
    if (arcadeScores.length === 0) return 0;
    return arcadeScores.reduce((m, s) => (s.score > m ? s.score : m), 0);
  }, [arcadeScores]);

  // Build a 7-day sparkline of XP earned per day (best-effort from completed lessons)
  const sparkData = useMemo(() => {
    const days = 7;
    const buckets = Array(days).fill(0) as number[];
    const now = Date.now();
    completedLessons.forEach((l) => {
      if (!l.completedAt) return;
      const ageMs = now - new Date(l.completedAt).getTime();
      const dayIdx = days - 1 - Math.floor(ageMs / 86_400_000);
      if (dayIdx >= 0 && dayIdx < days) buckets[dayIdx] += l.score ?? 0;
    });
    arcadeScores.forEach((s) => {
      if (!s.playedAt) return;
      const ageMs = now - new Date(s.playedAt).getTime();
      const dayIdx = days - 1 - Math.floor(ageMs / 86_400_000);
      if (dayIdx >= 0 && dayIdx < days) buckets[dayIdx] += s.score ?? 0;
    });
    return buckets;
  }, [completedLessons, arcadeScores]);

  const firstName = user?.firstName ?? "there";

  if (!isLoaded) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center font-sans text-[0.875rem] text-muted">
        Loading…
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10">
      {/* Greeting */}
      <header className="flex flex-col gap-2">
        <h1
          className="font-serif font-normal text-ink"
          style={{
            fontSize: "clamp(2rem, 4vw, 3rem)",
            letterSpacing: "-0.02em",
            lineHeight: 1.05,
          }}
        >
          Hello {firstName}.
        </h1>
        <p className="font-sans text-[0.9375rem] text-muted">
          {progress.currentStreak > 0
            ? `You're on a ${progress.currentStreak}-day streak. Keep it going.`
            : "Ready to start your money quest?"}
        </p>
      </header>

      {/* Stat cards */}
      <section
        aria-label="Your stats"
        className="grid grid-cols-2 gap-4 lg:grid-cols-4"
      >
        <StatCard label="Total XP" value={progress.totalXp} accent />
        <StatCard
          label="Streak"
          value={progress.currentStreak}
          hint={progress.currentStreak === 1 ? "day" : "days"}
        />
        <StatCard
          label="Lessons done"
          value={completedLessons.length}
          hint="across credit, taxes, budgeting"
        />
        <StatCard
          label="Sim best"
          value={simulatorBest?.monthsSurvived ?? 0}
          hint="months survived"
        />
      </section>

      {/* Continue learning feature */}
      <section className="rounded-2xl border border-line bg-white p-8 md:p-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-2">
            <span className="font-sans text-[0.7rem] font-medium uppercase tracking-[0.12em] text-accent">
              Continue learning
            </span>
            <h2
              className="font-serif font-normal text-ink"
              style={{ fontSize: "1.875rem", lineHeight: 1.1 }}
            >
              Pick up where you left off.
            </h2>
            <p className="max-w-[36rem] font-sans text-[0.9375rem] text-muted">
              Your next quest in the Learn Path. Earn XP, build a streak, and
              unlock arcade tokens.
            </p>
          </div>
          <Link
            href="/learn"
            className="inline-flex h-11 items-center gap-2 self-start rounded-full bg-ink px-6 font-sans text-[0.875rem] font-medium text-white hover:bg-ink/90"
          >
            Continue
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Level + XP progress bar */}
        <div className="mt-8 border-t border-line pt-6">
          <div className="flex items-center justify-between font-sans text-[0.8125rem]">
            <span className="text-muted">Level {level}</span>
            <span className="tabular-nums text-muted">
              {current} / {required} XP
            </span>
          </div>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-paper-2">
            <div
              className="h-full rounded-full bg-accent transition-all"
              style={{ width: `${xpPercent}%` }}
            />
          </div>
        </div>
      </section>

      {/* Two-column lower row */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Stats card spanning 2 */}
        <div className="rounded-2xl border border-line bg-white p-8 lg:col-span-2">
          <div className="flex items-baseline justify-between">
            <h3 className="font-serif text-[1.25rem] font-normal text-ink">
              Your activity
            </h3>
            <span className="font-sans text-[0.75rem] uppercase tracking-[0.1em] text-muted">
              Last 7 days
            </span>
          </div>
          <div className="mt-6">
            <Sparkline data={sparkData} height={120} />
          </div>
          <div className="mt-4 flex items-center gap-6 font-sans text-[0.8125rem] text-muted">
            <span className="inline-flex items-center gap-2">
              <span
                aria-hidden
                className="inline-block h-2 w-2 rounded-full bg-accent"
              />
              XP earned per day
            </span>
            <span className="inline-flex items-center gap-2">
              <Flame className="h-3.5 w-3.5 text-accent" />
              Streak {progress.currentStreak}
            </span>
            <span className="hidden sm:inline">
              Arcade high: {arcadeHigh.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Daily tip / promo */}
        <div className="flex flex-col justify-between rounded-2xl bg-ink p-8 text-white">
          <div>
            <span className="font-sans text-[0.7rem] font-medium uppercase tracking-[0.12em] text-muted-dark">
              Did you know?
            </span>
            <p
              className="mt-4 font-serif text-white"
              style={{ fontSize: "1.25rem", lineHeight: 1.4 }}
            >
              {dailyTip}
            </p>
          </div>
          <Link
            href="/learn"
            className="mt-8 inline-flex h-11 items-center justify-center gap-2 rounded-full bg-white px-6 font-sans text-[0.875rem] font-medium text-ink hover:bg-white/90"
          >
            Explore lessons
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
