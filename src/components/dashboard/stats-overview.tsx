"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  Flame,
  BookCheck,
  Trophy,
  Target,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface StatItem {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}

interface StatsOverviewProps {
  totalXp: number;
  currentStreak: number;
  lessonsCompleted: number;
  simulatorBestMonths: number;
  arcadeHighScore: number;
  className?: string;
}

const StatsOverview: React.FC<StatsOverviewProps> = ({
  totalXp,
  currentStreak,
  lessonsCompleted,
  simulatorBestMonths,
  arcadeHighScore,
  className,
}) => {
  const stats: StatItem[] = [
    {
      label: "Total XP",
      value: totalXp.toLocaleString(),
      icon: <Sparkles className="h-5 w-5" />,
      color: "text-xp",
      bgColor: "bg-xp-light",
    },
    {
      label: "Streak",
      value: `${currentStreak}d`,
      icon: <Flame className="h-5 w-5" />,
      color: "text-orange-500",
      bgColor: "bg-orange-100",
    },
    {
      label: "Lessons",
      value: lessonsCompleted,
      icon: <BookCheck className="h-5 w-5" />,
      color: "text-learn",
      bgColor: "bg-learn-light",
    },
    {
      label: "Best Sim Run",
      value: `${simulatorBestMonths}mo`,
      icon: <Target className="h-5 w-5" />,
      color: "text-simulator",
      bgColor: "bg-simulator-light",
    },
    {
      label: "High Score",
      value: arcadeHighScore.toLocaleString(),
      icon: <Trophy className="h-5 w-5" />,
      color: "text-accent",
      bgColor: "bg-arcade-light",
    },
  ];

  return (
    <div className={cn("grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6", className)}>
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-4 shadow-sm"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.05, type: "spring", stiffness: 300, damping: 20 }}
        >
          <div
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-lg",
              stat.bgColor,
              stat.color
            )}
          >
            {stat.icon}
          </div>
          <span className="text-xl font-extrabold tabular-nums text-foreground">
            {stat.value}
          </span>
          <span className="text-center text-xs font-bold text-muted-foreground">
            {stat.label}
          </span>
        </motion.div>
      ))}
    </div>
  );
};

export { StatsOverview };
export type { StatsOverviewProps };
