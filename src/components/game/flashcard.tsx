"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Topic } from "@/types/game";

const topicBorderColor: Record<Topic, string> = {
  credit: "border-arcade",
  taxes: "border-simulator",
  budgeting: "border-learn",
};

const topicBgColor: Record<Topic, string> = {
  credit: "bg-arcade-light",
  taxes: "bg-simulator-light",
  budgeting: "bg-learn-light",
};

interface FlashcardProps {
  term: string;
  definition: string;
  topic: Topic;
  className?: string;
}

const Flashcard: React.FC<FlashcardProps> = ({
  term,
  definition,
  topic,
  className,
}) => {
  const [isFlipped, setIsFlipped] = React.useState(false);

  const handleFlip = () => setIsFlipped((prev) => !prev);

  return (
    <div
      className={cn("perspective-[1000px] cursor-pointer", className)}
      style={{ perspective: "1000px" }}
      onClick={handleFlip}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleFlip();
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={
        isFlipped
          ? `Definition: ${definition}. Click to see the term.`
          : `Term: ${term}. Click to see the definition.`
      }
    >
      <motion.div
        className="relative h-52 w-full sm:h-60"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Front — Term */}
        <div
          className={cn(
            "absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-2xl border-2 bg-card p-6 shadow-lg",
            topicBorderColor[topic]
          )}
          style={{ backfaceVisibility: "hidden" }}
        >
          <span className="text-center text-2xl font-extrabold text-foreground">
            {term}
          </span>
          <span className="flex items-center gap-1 text-xs font-bold text-muted-foreground">
            <RotateCcw className="h-3 w-3" />
            Tap to flip
          </span>
        </div>

        {/* Back — Definition */}
        <div
          className={cn(
            "absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-2xl border-2 p-6 shadow-lg",
            topicBorderColor[topic],
            topicBgColor[topic]
          )}
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <span className="text-center text-base font-semibold leading-relaxed text-foreground">
            {definition}
          </span>
          <span className="flex items-center gap-1 text-xs font-bold text-muted-foreground">
            <RotateCcw className="h-3 w-3" />
            Tap to flip back
          </span>
        </div>
      </motion.div>
    </div>
  );
};

export { Flashcard };
export type { FlashcardProps };
