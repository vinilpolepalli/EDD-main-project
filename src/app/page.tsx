"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  BarChart2,
  CheckCircle,
  Zap,
  TrendingUp,
  Shield,
  Flame,
} from "lucide-react";
import { LegalDisclaimer } from "@/components/shared/legal-disclaimer";

/* ── animation helpers ── */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] },
});

export default function LandingPage() {
  return (
    <div
      className="min-h-screen overflow-x-hidden"
      style={{ fontFamily: "'Nunito', sans-serif", background: "#FAFBFF" }}
    >
      {/* ─── NAV ──────────────────────────────────────────── */}
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5 sm:px-10">
        <div className="flex items-center gap-2.5">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-xl text-base"
            style={{ background: "linear-gradient(135deg,#16A34A,#15803D)" }}
          >
            💰
          </div>
          <span className="text-[17px] font-extrabold tracking-tight text-slate-900">
            CashQuest
          </span>
        </div>
        <div className="flex items-center gap-6">
          <Link
            href="/dashboard"
            className="hidden text-sm font-semibold text-slate-500 transition hover:text-slate-900 sm:block"
          >
            Dashboard
          </Link>
          <Link
            href="/login"
            className="text-sm font-semibold text-slate-500 transition hover:text-slate-900"
          >
            Log in
          </Link>
          <Link
            href="/dashboard"
            className="rounded-xl px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-green-200 transition-all hover:scale-105 hover:shadow-green-300 active:scale-100"
            style={{ background: "linear-gradient(135deg,#16A34A,#15803D)" }}
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* ─── HERO ─────────────────────────────────────────── */}
      <section className="relative mx-auto max-w-6xl px-6 pb-8 pt-14 sm:px-10 sm:pt-20">
        {/* background accent blobs */}
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div
            className="absolute -right-32 -top-16 h-[480px] w-[480px] rounded-full opacity-30 blur-3xl"
            style={{ background: "radial-gradient(circle,#86EFAC,transparent 70%)" }}
          />
          <div
            className="absolute -left-20 top-40 h-72 w-72 rounded-full opacity-20 blur-3xl"
            style={{ background: "radial-gradient(circle,#34D399,transparent 70%)" }}
          />
        </div>

        <div className="grid items-center gap-16 lg:grid-cols-2">
          {/* Left — copy */}
          <div>
            <motion.span
              {...fadeUp(0)}
              className="mb-5 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold tracking-widest uppercase"
              style={{ background: "#DCFCE7", color: "#16A34A" }}
            >
              <Zap className="h-3 w-3" /> Financial Literacy for Ages 10–14
            </motion.span>

            <motion.h1
              {...fadeUp(0.08)}
              className="mt-2 text-[52px] font-extrabold leading-[1.05] tracking-tight text-slate-900 sm:text-[64px]"
            >
              Learn Money.{" "}
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage: "linear-gradient(135deg,#16A34A 30%,#15803D)",
                }}
              >
                Play Life.
              </span>
            </motion.h1>

            <motion.p
              {...fadeUp(0.16)}
              className="mt-5 max-w-md text-[17px] leading-relaxed text-slate-500"
            >
              Duolingo-style lessons on credit, taxes, and budgeting — plus a
              life simulator where every choice has real financial
              consequences.
            </motion.p>

            <motion.div
              {...fadeUp(0.24)}
              className="mt-9 flex flex-wrap items-center gap-4"
            >
              <Link
                href="/dashboard"
                className="group flex items-center gap-2 rounded-2xl px-7 py-4 text-[15px] font-bold text-white shadow-lg shadow-green-300/50 transition-all hover:scale-105 hover:shadow-green-400/50 active:scale-100"
                style={{ background: "linear-gradient(135deg,#16A34A,#15803D)" }}
              >
                Start for Free
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/login"
                className="rounded-2xl border border-slate-200 bg-white px-7 py-4 text-[15px] font-bold text-slate-700 shadow-sm transition hover:border-green-200 hover:bg-green-50"
              >
                I have an account
              </Link>
            </motion.div>

            <motion.div
              {...fadeUp(0.32)}
              className="mt-8 flex items-center gap-6"
            >
              {[
                { icon: CheckCircle, text: "Free forever" },
                { icon: Shield, text: "CEE-aligned" },
                { icon: Flame, text: "No ads" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-1.5">
                  <Icon className="h-4 w-4 text-emerald-500" />
                  <span className="text-sm font-semibold text-slate-500">{text}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right — product preview cards */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative hidden lg:block"
          >
            {/* Main card — lesson */}
            <div
              className="relative rounded-3xl p-6 shadow-2xl shadow-green-100"
              style={{ background: "#111827" }}
            >
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500">
                  <BookOpen className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-emerald-400">
                    Budgeting · Lesson 3
                  </p>
                  <p className="text-sm font-extrabold text-white">
                    The 50/30/20 Rule
                  </p>
                </div>
              </div>
              <div className="rounded-xl bg-gray-800 p-4">
                <p className="text-xs font-medium text-gray-400">
                  If you earn{" "}
                  <span className="font-bold text-white">$3,000/month</span>,
                  the 50/30/20 rule says:
                </p>
                <div className="mt-3 flex flex-col gap-2">
                  {[
                    { label: "Needs (50%)", value: "$1,500", color: "#16A34A", w: "w-1/2" },
                    { label: "Wants (30%)", value: "$900", color: "#15803D", w: "w-[30%]" },
                    { label: "Savings (20%)", value: "$600", color: "#10B981", w: "w-1/5" },
                  ].map((row) => (
                    <div key={row.label}>
                      <div className="mb-1 flex justify-between text-[11px] font-semibold text-gray-400">
                        <span>{row.label}</span>
                        <span className="text-white">{row.value}</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-gray-700">
                        <div
                          className={`h-full rounded-full ${row.w}`}
                          style={{ background: row.color }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-500">+100 XP on completion</span>
                <span className="rounded-lg bg-green-500/20 px-3 py-1 text-xs font-bold text-green-300">
                  Continue →
                </span>
              </div>
            </div>

            {/* Floating stat chips */}
            <div
              className="absolute -left-8 top-8 rounded-2xl p-4 shadow-xl"
              style={{ background: "white" }}
            >
              <div className="flex items-center gap-2">
                <span className="text-2xl">🔥</span>
                <div>
                  <p className="text-lg font-extrabold text-slate-900">7</p>
                  <p className="text-[10px] font-bold text-slate-400">Day Streak</p>
                </div>
              </div>
            </div>

            <div
              className="absolute -bottom-4 -right-4 rounded-2xl p-4 shadow-xl"
              style={{ background: "white" }}
            >
              <div className="flex items-center gap-2">
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-lg"
                  style={{ background: "#DCFCE7" }}
                >
                  <Zap className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-base font-extrabold text-slate-900">1,250 XP</p>
                  <p className="text-[10px] font-bold text-slate-400">Total Earned</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── STATS BAR ────────────────────────────────────── */}
      <section
        className="mt-16 py-10"
        style={{ background: "linear-gradient(135deg,#16A34A,#15803D)" }}
      >
        <div className="mx-auto grid max-w-4xl grid-cols-2 gap-6 px-8 sm:grid-cols-4">
          {[
            { value: "24", label: "Lessons" },
            { value: "60+", label: "Quiz Questions" },
            { value: "45+", label: "Life Events" },
            { value: "3", label: "Topics" },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              className="text-center"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.45 }}
            >
              <p className="text-4xl font-extrabold text-white">{s.value}</p>
              <p className="mt-1 text-sm font-semibold text-green-200">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── FEATURES ─────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-6 py-24 sm:px-10">
        <motion.div
          className="mb-14 text-center"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl font-extrabold tracking-tight text-slate-900">
            Two ways to build wealth IQ
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-base text-slate-500">
            Both modes teach concepts straight from the Council for Economic
            Education curriculum — but actually feel fun.
          </p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2">
          {/* Learn card */}
          <motion.div
            className="group rounded-3xl p-8 transition-shadow hover:shadow-xl"
            style={{ background: "#F0FDF4", border: "1.5px solid #BBF7D0" }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div
              className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl shadow-md"
              style={{ background: "linear-gradient(135deg,#10B981,#059669)" }}
            >
              <BookOpen className="h-7 w-7 text-white" />
            </div>
            <h3 className="mb-2 text-2xl font-extrabold text-slate-900">
              Learn Path
            </h3>
            <p className="mb-6 text-sm leading-relaxed text-slate-600">
              Duolingo-style winding path. Complete lessons in order, flip
              flashcards, and test yourself with quizzes that explain every
              answer — right or wrong.
            </p>
            <div className="grid grid-cols-2 gap-2">
              {["Credit & FICO scores", "Tax brackets", "Budgeting rules", "Compound interest"].map(
                (item) => (
                  <div key={item} className="flex items-center gap-2">
                    <CheckCircle className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
                    <span className="text-xs font-semibold text-slate-600">{item}</span>
                  </div>
                )
              )}
            </div>
            <div className="mt-6 flex items-center gap-2 text-sm font-bold text-emerald-600">
              Start learning <ArrowRight className="h-4 w-4" />
            </div>
          </motion.div>

          {/* Simulator card */}
          <motion.div
            className="group rounded-3xl p-8 transition-shadow hover:shadow-xl"
            style={{ background: "#F0FDF4", border: "1.5px solid #BBF7D0" }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div
              className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl shadow-md"
              style={{ background: "linear-gradient(135deg,#16A34A,#15803D)" }}
            >
              <BarChart2 className="h-7 w-7 text-white" />
            </div>
            <h3 className="mb-2 text-2xl font-extrabold text-slate-900">
              Life Simulator
            </h3>
            <p className="mb-6 text-sm leading-relaxed text-slate-600">
              Pick a life scenario — Fresh Grad, Young Pro, or Mid-Career.
              Manage salary, handle 45+ surprise events, make choices with real
              consequences, and watch your net worth grow or crash.
            </p>
            <div className="grid grid-cols-2 gap-2">
              {["4 life scenarios", "Choice-based events", "Debt & interest", "Net worth tracking"].map(
                (item) => (
                  <div key={item} className="flex items-center gap-2">
                    <CheckCircle className="h-3.5 w-3.5 shrink-0 text-green-500" />
                    <span className="text-xs font-semibold text-slate-600">{item}</span>
                  </div>
                )
              )}
            </div>
            <div className="mt-6 flex items-center gap-2 text-sm font-bold text-green-600">
              Play simulator <ArrowRight className="h-4 w-4" />
            </div>
          </motion.div>
        </div>

        {/* Bottom 3 pills */}
        <motion.div
          className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {[
            { icon: TrendingUp, title: "XP & Streaks", desc: "Level up with every lesson. Keep a streak to multiply rewards.", color: "#16A34A" },
            { icon: Zap, title: "Instant Feedback", desc: "Every quiz answer includes a detailed explanation — not just right/wrong.", color: "#F59E0B" },
            { icon: Shield, title: "CEE Curriculum", desc: "Every lesson maps to Council for Economic Education standards.", color: "#10B981" },
          ].map((f) => (
            <div
              key={f.title}
              className="rounded-2xl bg-white p-5 shadow-sm"
              style={{ border: "1.5px solid #E2E8F0" }}
            >
              <div
                className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-xl"
                style={{ background: f.color + "18" }}
              >
                <f.icon className="h-4.5 w-4.5" style={{ color: f.color }} />
              </div>
              <h4 className="mb-1 text-sm font-extrabold text-slate-900">{f.title}</h4>
              <p className="text-xs leading-relaxed text-slate-500">{f.desc}</p>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ─── CTA ──────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-6 pb-24 sm:px-10">
        <motion.div
          className="relative overflow-hidden rounded-3xl px-10 py-16 text-center shadow-2xl shadow-indigo-200"
          style={{ background: "linear-gradient(135deg,#16A34A 0%,#15803D 60%,#14532D 100%)" }}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* decorative circles */}
          <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-white/10" />
          <div className="pointer-events-none absolute -bottom-8 left-16 h-32 w-32 rounded-full bg-white/5" />

          <div className="relative z-10">
            <p className="mb-3 text-4xl">🚀</p>
            <h2 className="mb-3 text-3xl font-extrabold text-white sm:text-4xl">
              Your financial future starts today.
            </h2>
            <p className="mx-auto mb-8 max-w-sm text-base text-green-200">
              Free forever. No ads. Real knowledge that lasts a lifetime.
            </p>
            <Link
              href="/dashboard"
              className="group inline-flex items-center gap-2 rounded-2xl bg-white px-8 py-4 text-base font-bold text-green-700 shadow-lg transition-all hover:scale-105 active:scale-100"
            >
              Start for Free
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ─── FOOTER ───────────────────────────────────────── */}
      <footer
        className="border-t px-6 py-8 sm:px-10"
        style={{ borderColor: "#E2E8F0" }}
      >
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <div
              className="flex h-7 w-7 items-center justify-center rounded-lg text-sm"
              style={{ background: "linear-gradient(135deg,#16A34A,#15803D)" }}
            >
              💰
            </div>
            <span className="text-sm font-bold text-slate-700">CashQuest</span>
          </div>
          <p className="text-xs text-slate-400">
            © 2026 CashQuest · Team #4 · Built for financial literacy education
          </p>
        </div>
        <div className="mx-auto mt-4 max-w-6xl">
          <LegalDisclaimer />
        </div>
      </footer>
    </div>
  );
}
