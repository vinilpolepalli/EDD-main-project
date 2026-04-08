"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  BookOpen,
  BarChart2,
  TrendingUp,
  ChevronRight,
  Coins,
  Shield,
  Zap,
  Star,
} from "lucide-react";
import { LegalDisclaimer } from "@/components/shared/legal-disclaimer";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const features = [
  {
    title: "Learn",
    description:
      "Master money skills with bite-sized lessons on credit, taxes, and budgeting. Earn XP as you go!",
    icon: BookOpen,
    gradientFrom: "from-emerald-500",
    gradientTo: "to-emerald-600",
  },
  {
    title: "Simulate",
    description:
      "Live a virtual life! Get a job, pay bills, handle surprises, and try not to go bankrupt.",
    icon: BarChart2,
    gradientFrom: "from-indigo-500",
    gradientTo: "to-indigo-600",
  },
  {
    title: "Grow",
    description:
      "Track your progress, level up, build streaks, and become a financial wizard.",
    icon: TrendingUp,
    gradientFrom: "from-amber-500",
    gradientTo: "to-amber-600",
  },
];

const stats = [
  { icon: Zap, label: "XP to earn", value: "10,000+" },
  { icon: Coins, label: "Financial topics", value: "3+" },
  { icon: Star, label: "Micro-lessons", value: "15+" },
  { icon: Shield, label: "CEE aligned", value: "100%" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen overflow-hidden bg-white">
      {/* Hero Section */}
      <section className="relative px-4 pt-16 pb-20 sm:pt-24 sm:pb-32 md:pt-32 md:pb-40">
        {/* Subtle background decoration */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-20 left-[10%] h-96 w-96 rounded-full bg-indigo-50 blur-3xl" />
          <div className="absolute top-40 right-[5%] h-64 w-64 rounded-full bg-emerald-50 blur-3xl" />
        </div>

        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <span className="mb-6 inline-flex items-center gap-2 rounded-full bg-indigo-50 px-4 py-1.5 text-sm font-bold text-indigo-600">
              <Coins className="h-4 w-4" />
              Financial Literacy for Kids
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            className="mt-6 text-5xl font-extrabold tracking-tight text-foreground sm:text-6xl md:text-7xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Learn Money.
            <br />
            <span className="text-primary">Play Life.</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground sm:text-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
          >
            The interactive game that teaches kids real money skills through
            lessons, life simulations, and hands-on challenges.
          </motion.p>

          {/* CTAs */}
          <motion.div
            className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Link
              href="/signup"
              className="group inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-4 text-lg font-bold text-white shadow-lg shadow-primary/25 transition-all hover:scale-105 hover:shadow-xl hover:shadow-primary/30 active:scale-100"
            >
              Start Learning
              <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-xl border-2 border-border bg-white px-8 py-4 text-lg font-bold text-foreground transition-all hover:border-primary/30 hover:bg-indigo-50"
            >
              I Have an Account
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-y border-border bg-background">
        <div className="mx-auto max-w-5xl px-4 py-8">
          <motion.div
            className="grid grid-cols-2 gap-8 sm:grid-cols-4"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-50px" }}
          >
            {stats.map((stat) => (
              <motion.div
                key={stat.label}
                className="flex flex-col items-center gap-1 text-center"
                variants={fadeInUp}
                transition={{ duration: 0.5 }}
              >
                <stat.icon className="mb-1 h-6 w-6 text-primary" />
                <span className="text-2xl font-extrabold text-foreground">
                  {stat.value}
                </span>
                <span className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="px-4 py-20 sm:py-28">
        <div className="mx-auto max-w-5xl">
          <motion.div
            className="mb-14 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="mb-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              Three Ways to Play
            </h2>
            <p className="mx-auto max-w-lg text-base text-muted-foreground sm:text-lg">
              Choose your path. Every mode teaches you real-world money
              skills while you earn XP and level up.
            </p>
          </motion.div>

          <motion.div
            className="grid gap-6 sm:grid-cols-3"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-50px" }}
          >
            {features.map((feature) => (
              <motion.div
                key={feature.title}
                className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm ring-1 ring-border transition-all hover:shadow-lg hover:ring-primary/20 sm:p-8"
                variants={fadeInUp}
                transition={{ duration: 0.5 }}
              >
                <div
                  className={`mb-5 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${feature.gradientFrom} ${feature.gradientTo} text-white shadow-md`}
                >
                  <feature.icon className="h-7 w-7" />
                </div>
                <h3 className="mb-2 text-xl font-extrabold text-foreground">
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="border-t border-border bg-background px-4 py-20 sm:py-28">
        <div className="mx-auto max-w-5xl">
          <motion.div
            className="mb-14 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="mb-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              How It Works
            </h2>
            <p className="mx-auto max-w-lg text-base text-muted-foreground sm:text-lg">
              Jump in and start leveling up your money skills in minutes.
            </p>
          </motion.div>

          <motion.div
            className="grid gap-10 sm:grid-cols-3"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-50px" }}
          >
            {[
              {
                step: "1",
                title: "Create Your Avatar",
                description:
                  "Pick your look and jump into the world of CashQuest. Your adventure starts here!",
                color: "bg-primary",
              },
              {
                step: "2",
                title: "Learn & Earn",
                description:
                  "Complete lessons to earn XP and track your progress. The more you learn, the more you grow!",
                color: "bg-emerald-500",
              },
              {
                step: "3",
                title: "Simulate & Level Up",
                description:
                  "Run life simulations, make financial decisions, and see how your choices play out!",
                color: "bg-amber-500",
              },
            ].map((stepItem) => (
              <motion.div
                key={stepItem.step}
                className="flex flex-col items-center text-center"
                variants={fadeInUp}
                transition={{ duration: 0.5 }}
              >
                <div
                  className={`mb-5 flex h-14 w-14 items-center justify-center rounded-2xl ${stepItem.color} text-2xl font-extrabold text-white shadow-lg`}
                >
                  {stepItem.step}
                </div>
                <h3 className="mb-2 text-lg font-extrabold text-foreground">
                  {stepItem.title}
                </h3>
                <p className="max-w-xs text-sm text-muted-foreground">
                  {stepItem.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="px-4 py-20 sm:py-28">
        <motion.div
          className="mx-auto max-w-3xl rounded-3xl bg-gradient-to-br from-indigo-500 to-indigo-600 p-10 text-center shadow-xl shadow-indigo-500/20 sm:p-14"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="mb-4 text-3xl font-extrabold text-white sm:text-4xl">
            Ready to Start Your Quest?
          </h2>
          <p className="mx-auto mb-8 max-w-md text-base text-white/80 sm:text-lg">
            Join kids learning real money skills the fun way.
            It is completely free!
          </p>
          <Link
            href="/signup"
            className="group inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-lg font-bold text-primary shadow-lg transition-all hover:scale-105 hover:shadow-xl active:scale-100"
          >
            Create Free Account
            <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-4 py-6">
        <LegalDisclaimer />
      </footer>
    </div>
  );
}
