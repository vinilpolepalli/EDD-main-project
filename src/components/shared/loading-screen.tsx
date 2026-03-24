"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Coins } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingScreenProps {
  message?: string;
  className?: string;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({
  message = "Loading...",
  className,
}) => {
  return (
    <div
      className={cn(
        "flex min-h-[60vh] flex-col items-center justify-center gap-6",
        className
      )}
      role="status"
      aria-label={message}
    >
      <motion.div
        className="flex h-20 w-20 items-center justify-center rounded-2xl bg-accent text-white shadow-lg"
        animate={{
          y: [0, -18, 0],
          rotateY: [0, 360],
        }}
        transition={{
          y: {
            duration: 0.8,
            repeat: Infinity,
            ease: "easeInOut",
          },
          rotateY: {
            duration: 1.2,
            repeat: Infinity,
            ease: "easeInOut",
          },
        }}
      >
        <Coins className="h-10 w-10" />
      </motion.div>

      <div className="flex flex-col items-center gap-2">
        <motion.p
          className="text-lg font-extrabold text-foreground"
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          {message}
        </motion.p>
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="h-2 w-2 rounded-full bg-primary"
              animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export { LoadingScreen };
export type { LoadingScreenProps };
