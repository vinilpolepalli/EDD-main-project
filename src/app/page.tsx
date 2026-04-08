"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  BookOpen,
  BarChart2,
  ChevronRight,
  TrendingUp,
  Zap,
  Shield,
  CheckCircle,
  Flame,
} from "lucide-react";
import { LegalDisclaimer } from "@/components/shared/legal-disclaimer";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

export default function LandingPage() {
  return (
    <div className="min-h-screen overflow-hidden bg-[#0A0E1A]">
      {/* ── NAV ─────────────────────────────────────────────── */}
      <nav className="flex items-center justify-between px-6 py-5 sm:px-10">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500 text-lg">
            💰
          </div>
          <span className="text-lg font-extrabold text-white">CashQuest</span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm font-semibold text-slate-400 transition hover:text-white"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="rounded-xl bg-indigo-500 px-5 py-2 text-sm font-bold text-white transition hover:bg-indigo-400"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* ── HERO ────────────────────────────────────────────── */}
      <section className="relative px-6 pb-24 pt-16 text-center sm:px-10 sm:pt-24">
        {/* Glow blobs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 -translate-y-1/4 rounded-full bg-indigo-600/20 blur-[120px]" />
          <div className="absolute left-[10%] top-1/2 h-64 w-64 rounded-full bg-emerald-500/10 blur-[80px]" />
          <div className="absolute right-[10%] top-1/3 h-64 w-64 rounded-full bg-purple-500/10 blur-[80px]" />
        </div>

        <motion.div
          className="relative z-10 mx-auto max-w-4xl"
          variants={stagger}
          initial="hidden"
          animate="show"
        >
          {/* Pill badge */}
          <motion.div variants={fadeUp} transition={{ duration: 0.5 }}>
            <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-sm font-bold text-indigo-300">
              <Zap className="h-3.5 w-3.5" />
              The Duolingo for Finance
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            className="mt-4 text-5xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-6xl md:text-7xl"
            variants={fadeUp}
            transition={{ duration: 0.6 }}
          >
            Learn Money.
            <br />
            <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-emerald-400 bg-clip-text text-transparent">
              Play Life.
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            className="mx-auto mt-6 max-w-xl text-lg text-slate-400 sm:text-xl"
            variants={fadeUp}
            transition={{ duration: 0.6 }}
          >
            Bite-sized lessons, real-life simulations, and choice-based events
            that teach kids aged 10–14 how money actually works.
          </motion.p>

          {/* CTAs */}
          <motion.div
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
            variants={fadeUp}
            transition={{ duration: 0.5 }}
          >
            <Link
              href="/dashboard"
              className="group flex items-center gap-2 rounded-2xl bg-indigo-500 px-8 py-4 text-base font-bold text-white shadow-lg shadow-indigo-500/30 transition-all hover:bg-indigo-400 hover:shadow-indigo-400/40 hover:scale-105 active:scale-100"
            >
              Start for Free
              <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/login"
              className="rounded-2xl border border-white/10 bg-white/5 px-8 py-4 text-base font-bold text-white backdrop-blur-sm transition hover:bg-white/10"
            >
              I Have an Account
            </Link>
          </motion.div>

          {/* Social proof */}
          <motion.p
            className="mt-5 text-xs font-medium text-slate-600"
            variants={fadeUp}
            transition={{ duration: 0.4 }}
          >
            Free forever · No credit card needed · CEE-aligned curriculum
          </motion.p>
        </motion.div>

        {/* ── FLOATING PREVIEW CARDS ── */}
        <motion.div
          className="relative z-10 mx-auto mt-20 grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3"
          variants={stagger}
          initial="hidden"
          animate="show"
        >
          {[
            {
              icon: "🎓",
              label: "Lesson complete",
              sub: "+100 XP earned",
              accent: "border-emerald-500/30 bg-emerald-500/10",
              textAccent: "text-emerald-400",
            },
            {
              icon: "🔥",
              label: "7-day streak!",
              sub: "Keep it going",
              accent: "border-indigo-500/30 bg-indigo-500/10",
              textAccent: "text-indigo-400",
            },
            {
              icon: "💡",
              label: "Life event",
              sub: "Car broke down — what do you do?",
              accent: "border-amber-500/30 bg-amber-500/10",
              textAccent: "text-amber-400",
            },
          ].map((card) => (
            <motion.div
              key={card.label}
              variants={fadeUp}
              transition={{ duration: 0.5 }}
              className={`rounded-2xl border p-5 text-left backdrop-blur-sm ${card.accent}`}
            >
              <div className="mb-2 text-2xl">{card.icon}</div>
              <p className={`text-sm font-bold ${card.textAccent}`}>
                {card.label}
              </p>
              <p className="mt-0.5 text-xs text-slate-500">{card.sub}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── STATS BAND ──────────────────────────────────────── */}
      <section className="border-y border-white/5 bg-white/[0.03] px-6 py-12">
        <div className="mx-auto grid max-w-4xl grid-cols-2 gap-8 sm:grid-cols-4">
          {[
            { value: "24", label: "Financial lessons", icon: BookOpen },
            { value: "60+", label: "Quiz questions", icon: CheckCircle },
            { value: "45+", label: "Life events", icon: Flame },
            { value: "100%", label: "CEE-aligned", icon: Shield },
          ].map((s) => (
            <motion.div
              key={s.label}
              className="flex flex-col items-center gap-1 text-center"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <s.icon className="mb-1 h-5 w-5 text-indigo-400" />
              <span className="text-3xl font-extrabold text-white">
                {s.value}
              </span>
              <span className="text-xs font-medium text-slate-500">
                {s.label}
              </span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ────────────────────────────────────────── */}
      <section className="px-6 py-24 sm:px-10">
        <div className="mx-auto max-w-5xl">
          <motion.div
            className="mb-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              Two ways to get smarter with money
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-base text-slate-400">
              Every mode is built around real financial concepts — no fluff.
            </p>
          </motion.div>

          <div className="grid gap-5 sm:grid-cols-2">
            {/* Learn card — big */}
            <motion.div
              className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/5 p-8 ring-1 ring-emerald-500/20"
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500 shadow-lg shadow-emerald-500/30">
                <BookOpen className="h-7 w-7 text-white" />
              </div>
              <h3 className="mb-2 text-2xl font-extrabold text-white">
                Learn Path
              </h3>
              <p className="mb-6 text-sm leading-relaxed text-slate-400">
                Duolingo-style lessons on Credit, Taxes, and Budgeting. Unlock
                each lesson in order, take quizzes with a 3-heart lives system,
                and earn XP for every correct answer.
              </p>
              <ul className="flex flex-col gap-2">
                {[
                  "8 lessons per topic",
                  "20 quiz questions each",
                  "Flashcard flip cards",
                  "CEE curriculum-aligned",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-2 text-sm font-medium text-slate-300"
                  >
                    <CheckCircle className="h-4 w-4 shrink-0 text-emerald-400" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="pointer-events-none absolute right-0 top-0 h-40 w-40 rounded-full bg-emerald-500/5 blur-3xl" />
            </motion.div>

            {/* Simulator card */}
            <motion.div
              className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-500/20 to-indigo-600/5 p-8 ring-1 ring-indigo-500/20"
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500 shadow-lg shadow-indigo-500/30">
                <BarChart2 className="h-7 w-7 text-white" />
              </div>
              <h3 className="mb-2 text-2xl font-extrabold text-white">
                Life Simulator
              </h3>
              <p className="mb-6 text-sm leading-relaxed text-slate-400">
                BitLife meets personal finance. Pick a life scenario, manage
                your salary, handle surprise events, make real choices — and
                try not to go bankrupt.
              </p>
              <ul className="flex flex-col gap-2">
                {[
                  "4 life scenarios",
                  "45+ random life events",
                  "Choice-based consequences",
                  "Net worth tracking",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-2 text-sm font-medium text-slate-300"
                  >
                    <CheckCircle className="h-4 w-4 shrink-0 text-indigo-400" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="pointer-events-none absolute right-0 top-0 h-40 w-40 rounded-full bg-indigo-500/5 blur-3xl" />
            </motion.div>
          </div>

          {/* Bottom feature strip */}
          <motion.div
            className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3"
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            {[
              {
                icon: TrendingUp,
                title: "Track Progress",
                desc: "XP, streaks, and life stages show your growth over time.",
                color: "text-violet-400",
                ring: "ring-violet-500/20",
                bg: "bg-violet-500/10",
              },
              {
                icon: Zap,
                title: "Earn XP",
                desc: "Every lesson and quiz answer rewards you with experience points.",
                color: "text-amber-400",
                ring: "ring-amber-500/20",
                bg: "bg-amber-500/10",
              },
              {
                icon: Shield,
                title: "Real Knowledge",
                desc: "Content aligns with Council for Economic Education standards.",
                color: "text-emerald-400",
                ring: "ring-emerald-500/20",
                bg: "bg-emerald-500/10",
              },
            ].map((f) => (
              <motion.div
                key={f.title}
                variants={fadeUp}
                transition={{ duration: 0.5 }}
                className={`rounded-2xl p-5 ring-1 ${f.ring} ${f.bg}`}
              >
                <f.icon className={`mb-3 h-6 w-6 ${f.color}`} />
                <h4 className="mb-1 font-bold text-white">{f.title}</h4>
                <p className="text-sm text-slate-500">{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── BOTTOM CTA ──────────────────────────────────────── */}
      <section className="px-6 pb-24 sm:px-10">
        <motion.div
          className="relative mx-auto max-w-3xl overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 to-violet-600 p-12 text-center shadow-2xl shadow-indigo-500/20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute -bottom-10 -left-10 h-48 w-48 rounded-full bg-white/5 blur-2xl" />
          </div>
          <div className="relative z-10">
            <div className="mb-4 text-4xl">🚀</div>
            <h2 className="mb-3 text-3xl font-extrabold text-white sm:text-4xl">
              Ready for Your Quest?
            </h2>
            <p className="mx-auto mb-8 max-w-sm text-base text-white/70">
              Free forever. No ads. Just real financial knowledge that will
              last a lifetime.
            </p>
            <Link
              href="/dashboard"
              className="group inline-flex items-center gap-2 rounded-2xl bg-white px-8 py-4 text-base font-bold text-indigo-600 shadow-lg transition-all hover:scale-105 hover:shadow-xl active:scale-100"
            >
              Start Learning Now
              <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────── */}
      <footer className="border-t border-white/5 px-6 py-8">
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-col items-center gap-3 text-center sm:flex-row sm:justify-between sm:text-left">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500 text-sm">
                💰
              </div>
              <span className="text-sm font-bold text-white">CashQuest</span>
            </div>
            <p className="text-xs text-slate-600">
              © 2026 CashQuest. Built for financial literacy education.
            </p>
          </div>
          <div className="mt-4">
            <LegalDisclaimer />
          </div>
        </div>
      </footer>
    </div>
  );
}
