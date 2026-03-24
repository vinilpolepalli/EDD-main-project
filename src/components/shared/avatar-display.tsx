"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import type { AvatarConfig } from "@/types/game";

const sizeMap = {
  sm: "h-10 w-10",
  md: "h-16 w-16",
  lg: "h-24 w-24",
} as const;

type AvatarSize = keyof typeof sizeMap;

interface AvatarDisplayProps {
  config: AvatarConfig;
  size?: AvatarSize;
  className?: string;
}

/**
 * Hair path data keyed by hair style.
 * Each is an SVG path designed for a 100x100 viewBox avatar circle.
 */
const hairPaths: Record<string, string> = {
  short:
    "M25 38 C25 20 75 20 75 38 L75 32 C75 15 25 15 25 32 Z",
  long:
    "M20 38 C20 15 80 15 80 38 L82 65 C82 70 78 72 76 68 L75 50 L25 50 L24 68 C22 72 18 70 18 65 Z",
  curly:
    "M22 40 C22 18 78 18 78 40 C82 38 84 30 80 24 C76 18 70 14 50 14 C30 14 24 18 20 24 C16 30 18 38 22 40 Z M26 38 C24 42 22 48 24 52 C24 48 26 44 26 38 Z M74 38 C76 42 78 48 76 52 C76 48 74 44 74 38 Z",
  spiky:
    "M25 40 L30 10 L40 30 L50 5 L60 30 L70 10 L75 40 C75 20 25 20 25 40 Z",
};

/** Simple accessory overlays */
const accessoryRender: Record<string, React.ReactNode> = {
  glasses: (
    <g>
      <circle cx="38" cy="48" r="8" fill="none" stroke="#1C1917" strokeWidth="2" />
      <circle cx="62" cy="48" r="8" fill="none" stroke="#1C1917" strokeWidth="2" />
      <line x1="46" y1="48" x2="54" y2="48" stroke="#1C1917" strokeWidth="2" />
      <line x1="30" y1="46" x2="25" y2="42" stroke="#1C1917" strokeWidth="2" />
      <line x1="70" y1="46" x2="75" y2="42" stroke="#1C1917" strokeWidth="2" />
    </g>
  ),
  hat: (
    <g>
      <rect x="20" y="22" width="60" height="6" rx="2" fill="#1C1917" />
      <rect x="30" y="8" width="40" height="18" rx="6" fill="#1C1917" />
    </g>
  ),
  headphones: (
    <g>
      <path
        d="M22 50 C22 30 78 30 78 50"
        fill="none"
        stroke="#1C1917"
        strokeWidth="3"
      />
      <rect x="18" y="48" width="8" height="12" rx="3" fill="#1C1917" />
      <rect x="74" y="48" width="8" height="12" rx="3" fill="#1C1917" />
    </g>
  ),
  none: null,
};

/** Outfit base shapes drawn at the bottom of the avatar */
const outfitRender: Record<string, (color: string) => React.ReactNode> = {
  "t-shirt": () => (
    <path
      d="M30 78 C30 72 38 68 50 68 C62 68 70 72 70 78 L70 90 L30 90 Z"
      fill="#0D9488"
    />
  ),
  hoodie: () => (
    <g>
      <path
        d="M28 78 C28 70 38 66 50 66 C62 66 72 70 72 78 L72 90 L28 90 Z"
        fill="#7C3AED"
      />
      <path
        d="M42 66 C42 70 50 74 50 74 C50 74 58 70 58 66"
        fill="none"
        stroke="#6D28D9"
        strokeWidth="1.5"
      />
    </g>
  ),
  dress: () => (
    <path
      d="M35 72 C35 68 42 66 50 66 C58 66 65 68 65 72 L70 90 L30 90 Z"
      fill="#EC4899"
    />
  ),
  jacket: () => (
    <g>
      <path
        d="M28 78 C28 70 38 66 50 66 C62 66 72 70 72 78 L72 90 L28 90 Z"
        fill="#1C1917"
      />
      <line x1="50" y1="68" x2="50" y2="90" stroke="#374151" strokeWidth="1.5" />
    </g>
  ),
};

const AvatarDisplay: React.FC<AvatarDisplayProps> = ({
  config,
  size = "md",
  className,
}) => {
  const hairPath = hairPaths[config.hairStyle] ?? hairPaths.short;
  const accessory = accessoryRender[config.accessory] ?? null;
  const outfit = outfitRender[config.outfit] ?? outfitRender["t-shirt"];

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-full border-2 border-border bg-muted shadow-md",
        sizeMap[size],
        className
      )}
      role="img"
      aria-label="User avatar"
    >
      <svg
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full"
      >
        {/* Background circle */}
        <circle cx="50" cy="50" r="50" fill="#E0F2FE" />

        {/* Outfit (drawn behind the head so collar peeks out) */}
        {outfit(config.skinColor)}

        {/* Head */}
        <circle cx="50" cy="48" r="22" fill={config.skinColor} />

        {/* Eyes */}
        <circle cx="42" cy="47" r="2.5" fill="#1C1917" />
        <circle cx="58" cy="47" r="2.5" fill="#1C1917" />
        <circle cx="43" cy="46" r="0.8" fill="#FFFFFF" />
        <circle cx="59" cy="46" r="0.8" fill="#FFFFFF" />

        {/* Smile */}
        <path
          d="M43 55 Q50 61 57 55"
          fill="none"
          stroke="#1C1917"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Hair */}
        <path d={hairPath} fill={config.hairColor} />

        {/* Accessory overlay */}
        {accessory}
      </svg>
    </div>
  );
};

export { AvatarDisplay };
export type { AvatarDisplayProps, AvatarSize };
