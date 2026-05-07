import {
  Compass,
  Coins,
  LineChart,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { FadeUp } from "./_primitives/fade-up";

interface Block {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  body: string;
}

const BLOCKS: Block[] = [
  {
    icon: Compass,
    title: "Built for how kids learn.",
    body: "Lessons land as quests, not lectures. Short, visual, immediately playable, with feedback that feels like a game and teaches like a tutor.",
  },
  {
    icon: Coins,
    title: "Real concepts, not toy money.",
    body: "Budgeting, opportunity cost, compounding, needs vs. wants — the same fundamentals adults wish they'd learned earlier, scaled to a 10-year-old's world.",
  },
  {
    icon: LineChart,
    title: "Progress parents can see.",
    body: "A clean dashboard shows exactly which concepts your kid has mastered and where they're stuck — without turning into surveillance.",
  },
  {
    icon: ShieldCheck,
    title: "Safe, no-ads-by-default.",
    body: "Kids should learn about money without becoming a product themselves. The free tier has minimal, age-appropriate ads; the paid tier removes them entirely.",
  },
  {
    icon: Sparkles,
    title: "An AI tutor that meets kids where they are.",
    body: "Coming soon. A patient, kid-safe tutor that explains the same concept five different ways until it clicks.",
  },
];

export function WhySection() {
  return (
    <section id="why" className="bg-paper text-ink">
      <div className="mx-auto w-full max-w-[1200px] px-6 py-28 md:px-10 md:py-40">
        <div className="grid grid-cols-1 gap-16 md:grid-cols-12 md:gap-12">
          {/* Sticky left column */}
          <div className="md:col-span-5">
            <div className="md:sticky md:top-32">
              <FadeUp>
                <h2
                  className="font-serif font-normal text-ink"
                  style={{
                    fontSize: "clamp(2.25rem, 5vw, 4rem)",
                    letterSpacing: "-0.02em",
                    lineHeight: 1.05,
                  }}
                >
                  Why families choose CashQuest
                </h2>
              </FadeUp>
              <FadeUp delay={0.05}>
                <p className="mt-6 max-w-[28rem] font-sans text-[1.0625rem] text-muted">
                  Five reasons CashQuest sits closer to a tutor than a toy.
                </p>
              </FadeUp>
            </div>
          </div>

          {/* Scrolling right column */}
          <div className="md:col-span-7 md:pl-8">
            <div className="flex flex-col">
              {BLOCKS.map((block, idx) => {
                const Icon = block.icon;
                return (
                  <FadeUp key={block.title} delay={idx * 0.04}>
                    <div className="border-t border-line py-12 first:border-t-0 first:pt-0 md:py-16">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-soft text-accent">
                        <Icon className="h-4 w-4" />
                      </div>
                      <h3
                        className="mt-6 font-serif font-normal text-ink"
                        style={{ fontSize: "1.75rem", lineHeight: 1.2 }}
                      >
                        {block.title}
                      </h3>
                      <p className="mt-3 max-w-[34rem] font-sans text-[1rem] leading-[1.6] text-muted">
                        {block.body}
                      </p>
                    </div>
                  </FadeUp>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
