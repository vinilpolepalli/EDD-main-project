"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AvatarDisplay } from "@/components/shared/avatar-display";
import { cn } from "@/lib/utils";
import type { AvatarConfig } from "@/types/game";

/* ── Option catalogs ─────────────────────────────────────────────────── */

const SKIN_COLORS = [
  { value: "#FDEBD0", label: "Light peach" },
  { value: "#F5CBA7", label: "Medium" },
  { value: "#D4A574", label: "Tan" },
  { value: "#A0724A", label: "Brown" },
  { value: "#6B4226", label: "Dark brown" },
  { value: "#3E2117", label: "Deep" },
] as const;

const HAIR_STYLES = [
  { value: "short", label: "Short" },
  { value: "long", label: "Long" },
  { value: "curly", label: "Curly" },
  { value: "spiky", label: "Spiky" },
] as const;

const HAIR_COLORS = [
  { value: "#1C1917", label: "Black" },
  { value: "#6B4226", label: "Brown" },
  { value: "#F5D078", label: "Blonde" },
  { value: "#C0392B", label: "Red" },
  { value: "#3B82F6", label: "Blue" },
  { value: "#A855F7", label: "Purple" },
] as const;

const OUTFITS = [
  { value: "t-shirt", label: "T-Shirt" },
  { value: "hoodie", label: "Hoodie" },
  { value: "dress", label: "Dress" },
  { value: "jacket", label: "Jacket" },
] as const;

const ACCESSORIES = [
  { value: "none", label: "None" },
  { value: "glasses", label: "Glasses" },
  { value: "hat", label: "Hat" },
  { value: "headphones", label: "Headphones" },
] as const;

const DEFAULT_AVATAR: AvatarConfig = {
  skinColor: "#F5D0A9",
  hairStyle: "short",
  hairColor: "#4A3728",
  outfit: "t-shirt",
  accessory: "none",
};

/* ── Component ───────────────────────────────────────────────────────── */

export default function AvatarPage() {
  const router = useRouter();
  const [avatar, setAvatar] = React.useState<AvatarConfig>(DEFAULT_AVATAR);

  function update<K extends keyof AvatarConfig>(key: K, value: AvatarConfig[K]) {
    setAvatar((prev) => ({ ...prev, [key]: value }));
  }

  function handleSave() {
    localStorage.setItem("cashquest-avatar", JSON.stringify(avatar));
    router.push("/dashboard");
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 24 }}
      className="flex flex-col items-center gap-6"
    >
      {/* Title */}
      <h1 className="text-center text-2xl font-extrabold text-white drop-shadow-md sm:text-3xl">
        Create Your Avatar
      </h1>

      {/* Avatar preview */}
      <div className="relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={JSON.stringify(avatar)}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <AvatarDisplay
              config={avatar}
              size="lg"
              className="h-32 w-32 border-4 border-white shadow-xl sm:h-40 sm:w-40"
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Customization card */}
      <Card className="w-full overflow-hidden border-2 border-white/20 shadow-2xl">
        <CardContent className="flex flex-col gap-6 p-5">
          {/* Skin Color */}
          <OptionSection label="Skin Color">
            <div className="flex flex-wrap gap-3">
              {SKIN_COLORS.map((opt) => (
                <ColorCircle
                  key={opt.value}
                  color={opt.value}
                  label={opt.label}
                  selected={avatar.skinColor === opt.value}
                  onClick={() => update("skinColor", opt.value)}
                />
              ))}
            </div>
          </OptionSection>

          {/* Hair Style */}
          <OptionSection label="Hair Style">
            <div className="flex flex-wrap gap-2">
              {HAIR_STYLES.map((opt) => (
                <TextOption
                  key={opt.value}
                  label={opt.label}
                  selected={avatar.hairStyle === opt.value}
                  onClick={() => update("hairStyle", opt.value)}
                />
              ))}
            </div>
          </OptionSection>

          {/* Hair Color */}
          <OptionSection label="Hair Color">
            <div className="flex flex-wrap gap-3">
              {HAIR_COLORS.map((opt) => (
                <ColorCircle
                  key={opt.value}
                  color={opt.value}
                  label={opt.label}
                  selected={avatar.hairColor === opt.value}
                  onClick={() => update("hairColor", opt.value)}
                />
              ))}
            </div>
          </OptionSection>

          {/* Outfit */}
          <OptionSection label="Outfit">
            <div className="flex flex-wrap gap-2">
              {OUTFITS.map((opt) => (
                <TextOption
                  key={opt.value}
                  label={opt.label}
                  selected={avatar.outfit === opt.value}
                  onClick={() => update("outfit", opt.value)}
                />
              ))}
            </div>
          </OptionSection>

          {/* Accessory */}
          <OptionSection label="Accessory">
            <div className="flex flex-wrap gap-2">
              {ACCESSORIES.map((opt) => (
                <TextOption
                  key={opt.value}
                  label={opt.label}
                  selected={avatar.accessory === opt.value}
                  onClick={() => update("accessory", opt.value)}
                />
              ))}
            </div>
          </OptionSection>

          {/* Save button */}
          <Button
            type="button"
            size="lg"
            className="mt-2 w-full"
            onClick={handleSave}
          >
            <Sparkles className="h-5 w-5" />
            Save &amp; Start Playing!
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}

/* ── Sub-components ──────────────────────────────────────────────────── */

function OptionSection({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-bold text-foreground">{label}</span>
      {children}
    </div>
  );
}

function ColorCircle({
  color,
  label,
  selected,
  onClick,
}: {
  color: string;
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={selected}
      onClick={onClick}
      className={cn(
        "h-11 w-11 rounded-full border-2 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
        selected
          ? "scale-110 border-primary ring-2 ring-primary/30"
          : "border-border hover:scale-105 hover:border-muted-foreground"
      )}
    >
      <span
        className="block h-full w-full rounded-full"
        /* Using a className-based approach for the background color.
           Since these are dynamic user-selected hex values that can't be
           expressed as Tailwind classes, we render an inner SVG circle. */
      >
        <svg viewBox="0 0 44 44" className="h-full w-full">
          <circle cx="22" cy="22" r="22" fill={color} />
          {selected && (
            <circle cx="22" cy="22" r="8" fill="none" stroke="white" strokeWidth="3" />
          )}
        </svg>
      </span>
    </button>
  );
}

function TextOption({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={cn(
        "flex min-h-[44px] items-center gap-2 rounded-lg border-2 px-4 py-2 text-sm font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
        selected
          ? "border-primary bg-primary/10 text-primary"
          : "border-border text-muted-foreground hover:border-muted-foreground hover:text-foreground"
      )}
    >
      {selected && <Check className="h-4 w-4" />}
      {label}
    </button>
  );
}
