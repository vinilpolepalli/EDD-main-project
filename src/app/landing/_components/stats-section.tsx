{/* TODO: confirm real numbers before launch */}
import { Section } from "./_primitives/section";
import { FadeUp } from "./_primitives/fade-up";
import { Eyebrow } from "./_primitives/eyebrow";

interface Stat {
  number: string;
  label: string;
}

const STATS: Stat[] = [
  { number: "120K+", label: "Quests completed by kids" },
  { number: "4.8/5", label: "Average parent rating" },
  { number: "300+", label: "Schools and clubs piloting CashQuest" },
];

export function StatsSection() {
  return (
    <Section variant="ink">
      <FadeUp>
        <Eyebrow tone="ink">By the Numbers</Eyebrow>
      </FadeUp>

      <div className="mt-12 flex flex-col gap-12 md:flex-row md:items-end md:justify-between md:gap-16">
        {STATS.map((stat, idx) => (
          <FadeUp key={stat.label} delay={idx * 0.06} className="md:flex-1">
            <div
              className="font-serif font-normal text-white"
              style={{
                fontSize: "clamp(3rem, 6vw, 5rem)",
                letterSpacing: "-0.02em",
                lineHeight: 1,
              }}
            >
              {stat.number}
            </div>
            <div className="mt-4 max-w-[18rem] font-sans text-[0.9375rem] text-muted-dark">
              {stat.label}
            </div>
          </FadeUp>
        ))}
      </div>
    </Section>
  );
}
