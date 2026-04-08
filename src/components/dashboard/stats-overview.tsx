"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  Zap,
  Star,
  Flame,
  BookCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getLevel } from "@/components/dashboard/xp-bar";

interface StatItem {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
}

interface StatsOverviewProps {
  totalXp: number;
  currentStreak: number;
  arcadeTokens: number;
  lessonsCompleted: number;
  simulatorBestMonths: number;
  arcadeHighScore: number;
  className?: string;
}

const StatsOverview: React.FC<StatsOverviewProps> = ({
  totalXp,
  currentStreak,
  lessonsCompleted,
  className,
}) => {
  const level = getLevel(totalXp);

  const stats: StatItem[] = [
    {
      label: "Total XP",
      value: totalXp.toLocaleString(),
      icon: <Zap className="h-5 w-5" />,
      iconBg: "bg-amber-100",
      iconColor: "text-amber-500",
    },
    {
      label: "Current Level",
      value: level,
      icon: <Star className="h-5 w-5" />,
      iconBg: "bg-indigo-100",
      iconColor: "text-indigo-500",
    },
    {
      label: "Streak",
      value: `${currentStreak}d`,
      icon: <Flame className="h-5 w-5" />,
      iconBg: "bg-orange-100",
      iconColor: "text-orange-500",
    },
    {
      label: "Lessons Done",
      value: lessonsCompleted,
      icon: <BookCheck className="h-5 w-5" />,
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-500",
    },
  ];

  return (
    <div className={cn("grid grid-cols-2 gap-4 lg:grid-cols-4", className)}>
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: i * 0.06,
            type: "spring",
            stiffness: 300,
            damping: 20,
          }}
        >
          <div
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
              stat.iconBg,
              stat.iconColor
            )}
          >
            {stat.icon}
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-extrabold tabular-nums text-foreground">
              {stat.value}
            </span>
            <span className="text-xs font-medium text-muted-foreground">
              {stat.label}
            </span>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export { StatsOverview };
export type { StatsOverviewProps };
