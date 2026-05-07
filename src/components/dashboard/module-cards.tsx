"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { BookOpen, BarChart2, ChevronRight, Gamepad2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModuleCardData {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  href: string;
  buttonLabel: string;
  icon: React.ReactNode;
  gradientFrom: string;
  gradientTo: string;
  badges?: string[];
}

const modules: ModuleCardData[] = [
  {
    id: "learn",
    title: "Learn Path",
    subtitle: "Financial Education",
    description: "Master credit, taxes, and budgeting with bite-sized interactive lessons and quizzes.",
    href: "/learn",
    buttonLabel: "Continue Learning",
    icon: <BookOpen className="h-8 w-8" />,
    gradientFrom: "from-accent",
    gradientTo: "to-accent",
    badges: ["Credit", "Taxes", "Budgeting"],
  },
  {
    id: "simulator",
    title: "Life Simulator",
    subtitle: "Real Financial Decisions",
    description: "Live a virtual month! Earn a salary, handle expenses, and survive random life events.",
    href: "/simulator",
    buttonLabel: "Play Now",
    icon: <BarChart2 className="h-8 w-8" />,
    gradientFrom: "from-accent",
    gradientTo: "to-accent",
  },
  {
    id: "minigames",
    title: "Mini-Games",
    subtitle: "Quick Finance Challenges",
    description: "7 fast-paced games covering budgeting, credit, taxes, saving, and investing.",
    href: "/minigames",
    buttonLabel: "Play Now",
    icon: <Gamepad2 className="h-8 w-8" />,
    gradientFrom: "from-accent",
    gradientTo: "to-accent",
    badges: ["Credit", "Taxes", "Budgeting", "Investing"],
  },
];

interface ModuleCardsProps {
  progress?: Record<string, number>;
  simulatorLastMonth?: number;
  className?: string;
}

const ModuleCards: React.FC<ModuleCardsProps> = ({
  progress = {},
  simulatorLastMonth,
  className,
}) => {
  return (
    <div className={cn("grid gap-5 sm:grid-cols-2 lg:grid-cols-3", className)}>
      {modules.map((mod, index) => {
        const progressValue = progress[mod.id] ?? 0;

        return (
          <motion.div
            key={mod.id}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: index * 0.1,
              type: "spring",
              stiffness: 200,
              damping: 20,
            }}
          >
            <Link href={mod.href} className="block h-full">
              <motion.div
                className={cn(
                  "group relative flex h-full flex-col overflow-hidden rounded-2xl bg-paper-2 p-6 text-white shadow-lg transition-shadow hover:shadow-xl",
                  mod.gradientFrom,
                  mod.gradientTo
                )}
                whileHover={{ y: -4, scale: 1.01 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
              >
                {/* Decorative circles */}
                <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/10" />
                <div className="absolute -bottom-4 -right-4 h-16 w-16 rounded-full bg-white/5" />

                {/* Icon + Title */}
                <div className="relative z-10 mb-4 flex items-start gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                    {mod.icon}
                  </div>
                  <div className="flex flex-col">
                    <h3 className="text-lg font-extrabold">{mod.title}</h3>
                    <span className="text-sm font-medium text-white/80">
                      {mod.subtitle}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <p className="relative z-10 mb-4 text-sm leading-relaxed text-white/90">
                  {mod.description}
                </p>

                {/* Progress or info */}
                <div className="relative z-10 mb-4 mt-auto">
                  {mod.id === "learn" && (
                    <span className="text-sm font-semibold text-white/80">
                      {progressValue}% completed
                    </span>
                  )}
                  {mod.id === "simulator" && (
                    <span className="text-sm font-semibold text-white/80">
                      {simulatorLastMonth !== undefined && simulatorLastMonth > 0
                        ? `Best: ${simulatorLastMonth} months survived`
                        : "Start your first run"}
                    </span>
                  )}
                </div>

                {/* Badges */}
                {mod.badges && (
                  <div className="relative z-10 mb-4 flex flex-wrap gap-2">
                    {mod.badges.map((badge) => (
                      <span
                        key={badge}
                        className="rounded-full bg-white/20 px-3 py-1 text-xs font-bold backdrop-blur-sm"
                      >
                        {badge}
                      </span>
                    ))}
                  </div>
                )}

                {/* CTA Button */}
                <div className="relative z-10 flex min-h-[44px] items-center justify-center gap-1 rounded-xl bg-white/20 py-2.5 text-sm font-bold backdrop-blur-sm transition-colors group-hover:bg-white/30">
                  {mod.buttonLabel}
                  <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </div>
              </motion.div>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
};

export { ModuleCards };
export type { ModuleCardsProps };
