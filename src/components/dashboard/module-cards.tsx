"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { BookOpen, TrendingUp, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

interface ModuleCardData {
  id: string;
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  bgClass: string;
  lightBgClass: string;
  textClass: string;
  progressColor: string;
}

const modules: ModuleCardData[] = [
  {
    id: "learn",
    title: "Learn Path",
    description: "Master credit, taxes, and budgeting with fun micro-lessons and quizzes!",
    href: "/learn",
    icon: <BookOpen className="h-7 w-7" />,
    bgClass: "bg-learn",
    lightBgClass: "bg-learn-light",
    textClass: "text-learn",
    progressColor: "bg-learn",
  },
  {
    id: "simulator",
    title: "Life Simulator",
    description: "Live a virtual month! Earn a salary, pay bills, and survive random events.",
    href: "/simulator",
    icon: <TrendingUp className="h-7 w-7" />,
    bgClass: "bg-simulator",
    lightBgClass: "bg-simulator-light",
    textClass: "text-simulator",
    progressColor: "bg-simulator",
  },
];

interface ModuleCardsProps {
  /** Optional progress values 0-100 for each module, keyed by module id */
  progress?: Record<string, number>;
  className?: string;
}

const ModuleCards: React.FC<ModuleCardsProps> = ({ progress = {}, className }) => {
  return (
    <div className={cn("grid gap-4 sm:grid-cols-2 lg:grid-cols-3", className)}>
      {modules.map((mod, index) => (
        <motion.div
          key={mod.id}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, type: "spring", stiffness: 200, damping: 20 }}
        >
          <Link href={mod.href} className="block h-full">
            <motion.div
              className={cn(
                "group relative flex h-full flex-col overflow-hidden rounded-2xl border-2 border-transparent bg-card shadow-md transition-shadow hover:shadow-lg",
                `hover:border-${mod.id === "learn" ? "learn" : "simulator"}`
              )}
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
              {/* Icon strip */}
              <div className={cn("flex items-center gap-3 p-5 pb-3", mod.lightBgClass)}>
                <div
                  className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-xl text-white shadow-sm",
                    mod.bgClass
                  )}
                >
                  {mod.icon}
                </div>
                <h3 className={cn("text-lg font-extrabold", mod.textClass)}>
                  {mod.title}
                </h3>
              </div>

              {/* Content */}
              <div className="flex flex-1 flex-col gap-4 p-5 pt-3">
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {mod.description}
                </p>

                {/* Progress */}
                <div className="mt-auto flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-xs font-bold text-muted-foreground">
                    <span>Progress</span>
                    <span className="tabular-nums">{progress[mod.id] ?? 0}%</span>
                  </div>
                  <Progress
                    value={progress[mod.id] ?? 0}
                    color={mod.progressColor}
                    height="h-2"
                  />
                </div>

                {/* Play button area */}
                <div
                  className={cn(
                    "flex min-h-[44px] items-center justify-center gap-1 rounded-lg py-2 text-sm font-bold text-white transition-colors",
                    mod.bgClass,
                    "group-hover:brightness-110"
                  )}
                >
                  Play
                  <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </div>
              </div>
            </motion.div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
};

export { ModuleCards };
export type { ModuleCardsProps };
