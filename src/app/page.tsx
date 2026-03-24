"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  BookOpen,
  Gamepad2,
  TrendingUp,
  Coins,
  Star,
  Zap,
  ChevronRight,
  Shield,
} from "lucide-react";

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

const floatingAnimation = {
  animate: {
    y: [0, -12, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut" as const,
    },
  },
};

const features = [
  {
    title: "Learn Path",
    description:
      "Master money skills with bite-sized lessons on credit, taxes, and budgeting. Earn XP and tokens as you go!",
    icon: BookOpen,
    color: "bg-learn",
    lightColor: "bg-learn-light",
    textColor: "text-learn",
    borderColor: "border-learn/30",
  },
  {
    title: "Life Simulator",
    description:
      "Live a virtual life! Get a job, pay bills, handle surprises, and try not to go bankrupt. Can you make it?",
    icon: TrendingUp,
    color: "bg-simulator",
    lightColor: "bg-simulator-light",
    textColor: "text-simulator",
    borderColor: "border-simulator/30",
  },
  {
    title: "Arcade",
    description:
      "Spend your tokens on fast-paced money games! Race the clock, build combos, and unlock cool cosmetics.",
    icon: Gamepad2,
    color: "bg-arcade",
    lightColor: "bg-arcade-light",
    textColor: "text-arcade",
    borderColor: "border-arcade/30",
  },
];

const stats = [
  { icon: Zap, label: "XP to earn", value: "10,000+" },
  { icon: Coins, label: "Arcade tokens", value: "Unlimited" },
  { icon: Star, label: "Cosmetics", value: "50+" },
  { icon: Shield, label: "CEE aligned", value: "100%" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen overflow-hidden">
      {/* Hero Section */}
      <section className="relative px-4 pt-12 pb-16 sm:pt-20 sm:pb-24 md:pt-28 md:pb-32">
        {/* Background decorative elements */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-10 left-[10%] h-64 w-64 rounded-full bg-learn/10 blur-3xl" />
          <div className="absolute top-40 right-[15%] h-48 w-48 rounded-full bg-arcade/10 blur-3xl" />
          <div className="absolute bottom-10 left-[30%] h-56 w-56 rounded-full bg-simulator/10 blur-3xl" />
        </div>

        <div className="mx-auto max-w-5xl text-center">
          {/* Floating coins decoration */}
          <div className="relative mb-8">
            <motion.div
              className="absolute -top-4 left-[15%] hidden sm:block"
              {...floatingAnimation}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-arcade-light text-arcade">
                <Coins className="h-6 w-6" />
              </div>
            </motion.div>
            <motion.div
              className="absolute -top-2 right-[20%] hidden sm:block"
              animate={{
                y: [0, -16, 0],
                transition: { duration: 3.5, repeat: Infinity, ease: "easeInOut" as const, delay: 0.5 },
              }}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-xp-light text-xp">
                <Star className="h-5 w-5" />
              </div>
            </motion.div>
            <motion.div
              className="absolute top-8 right-[10%] hidden md:block"
              animate={{
                y: [0, -10, 0],
                transition: { duration: 2.8, repeat: Infinity, ease: "easeInOut" as const, delay: 1 },
              }}
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-learn-light text-learn">
                <Zap className="h-4 w-4" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <span className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-bold text-primary">
                Financial Literacy for Kids
              </span>
            </motion.div>
          </div>

          <motion.h1
            className="mb-6 text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <span className="text-primary">Cash</span>
            <span className="text-arcade">Quest</span>
          </motion.h1>

          <motion.p
            className="mx-auto mb-4 max-w-2xl text-xl font-semibold text-foreground sm:text-2xl md:text-3xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Learn Money. Level Up. Have Fun!
          </motion.p>

          <motion.p
            className="mx-auto mb-10 max-w-xl text-base text-muted-foreground sm:text-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            The adventure game that teaches you real money skills. Master
            budgeting, crush credit scores, and become a financial wizard
            — all while having a blast!
          </motion.p>

          <motion.div
            className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Link
              href="/signup"
              className="group inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-4 text-lg font-bold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:scale-105 hover:shadow-xl hover:shadow-primary/30 active:scale-100"
            >
              Start Your Quest!
              <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-xl border-2 border-primary/20 bg-secondary px-8 py-4 text-lg font-bold text-primary transition-all hover:border-primary/40 hover:bg-primary/5"
            >
              I Have an Account
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-y border-border bg-card/50 backdrop-blur-sm">
        <div className="mx-auto max-w-5xl px-4 py-6">
          <motion.div
            className="grid grid-cols-2 gap-6 sm:grid-cols-4"
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
                <span className="text-xl font-extrabold text-foreground sm:text-2xl">
                  {stat.value}
                </span>
                <span className="text-xs font-medium text-muted-foreground sm:text-sm">
                  {stat.label}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="px-4 py-16 sm:py-24">
        <div className="mx-auto max-w-5xl">
          <motion.div
            className="mb-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="mb-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
              Three Ways to Play
            </h2>
            <p className="mx-auto max-w-lg text-base text-muted-foreground sm:text-lg">
              Choose your path. Every mode teaches you real-world money
              skills while you earn XP, tokens, and awesome rewards.
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
                className={`group relative overflow-hidden rounded-2xl border-2 ${feature.borderColor} ${feature.lightColor} p-6 transition-all hover:scale-[1.02] hover:shadow-lg sm:p-8`}
                variants={fadeInUp}
                transition={{ duration: 0.5 }}
              >
                <div
                  className={`mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl ${feature.color} text-white shadow-md`}
                >
                  <feature.icon className="h-7 w-7" />
                </div>
                <h3 className="mb-2 text-xl font-extrabold text-foreground sm:text-2xl">
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {feature.description}
                </p>
                <div
                  className={`absolute -bottom-4 -right-4 h-24 w-24 rounded-full ${feature.color}/10 blur-2xl transition-all group-hover:scale-150`}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="border-t border-border bg-card/30 px-4 py-16 sm:py-24">
        <div className="mx-auto max-w-5xl">
          <motion.div
            className="mb-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="mb-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
              How It Works
            </h2>
            <p className="mx-auto max-w-lg text-base text-muted-foreground sm:text-lg">
              Jump in and start leveling up your money skills in minutes.
            </p>
          </motion.div>

          <motion.div
            className="grid gap-8 sm:grid-cols-3"
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
                  "Complete lessons to earn XP and arcade tokens. The more you learn, the more you earn!",
                color: "bg-learn",
              },
              {
                step: "3",
                title: "Play & Level Up",
                description:
                  "Use tokens in the arcade, run life simulations, and unlock awesome cosmetics!",
                color: "bg-arcade",
              },
            ].map((item) => (
              <motion.div
                key={item.step}
                className="flex flex-col items-center text-center"
                variants={fadeInUp}
                transition={{ duration: 0.5 }}
              >
                <div
                  className={`mb-4 flex h-14 w-14 items-center justify-center rounded-full ${item.color} text-2xl font-extrabold text-white shadow-lg`}
                >
                  {item.step}
                </div>
                <h3 className="mb-2 text-lg font-extrabold">{item.title}</h3>
                <p className="max-w-xs text-sm text-muted-foreground">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="px-4 py-16 sm:py-24">
        <motion.div
          className="mx-auto max-w-3xl rounded-3xl bg-primary p-8 text-center shadow-xl shadow-primary/20 sm:p-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="mb-3 text-3xl font-extrabold text-primary-foreground sm:text-4xl">
            Ready to Start Your Quest?
          </h2>
          <p className="mx-auto mb-8 max-w-md text-base text-primary-foreground/80 sm:text-lg">
            Join thousands of kids learning real money skills the fun way.
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
    </div>
  );
}
