import { Section } from "./_primitives/section";
import { FadeUp } from "./_primitives/fade-up";

interface Block {
  number: string;
  title: string;
  body: string;
}

const BLOCKS: Block[] = [
  {
    number: "01",
    title: "Built for how kids learn.",
    body: "Lessons land as quests, not lectures. Short, visual, immediately playable, with feedback that feels like a game and teaches like a tutor.",
  },
  {
    number: "02",
    title: "Real concepts, not toy money.",
    body: "Budgeting, opportunity cost, compounding, needs vs. wants — the same fundamentals adults wish they'd learned earlier, scaled to a 10-year-old's world.",
  },
  {
    number: "03",
    title: "Progress parents can see.",
    body: "A clean dashboard shows exactly which concepts your kid has mastered and where they're stuck — without turning into surveillance.",
  },
  {
    number: "04",
    title: "Safe, no-ads-by-default.",
    body: "Kids should learn about money without becoming a product themselves. The free tier has minimal, age-appropriate ads; the paid tier removes them entirely.",
  },
  {
    number: "05",
    title: "An AI tutor that meets kids where they are.",
    body: "Coming soon. A patient, kid-safe tutor that explains the same concept five different ways until it clicks.",
  },
];

export function WhySection() {
  return (
    <Section variant="ink" id="why">
      <FadeUp>
        <h2
          className="font-rogo-serif font-normal text-white"
          style={{
            fontSize: "clamp(2.25rem, 5vw, 4rem)",
            letterSpacing: "-0.02em",
            lineHeight: 1.05,
          }}
        >
          Why families choose CashQuest
        </h2>
      </FadeUp>

      <div className="mt-20 grid grid-cols-1 gap-x-16 gap-y-12 md:grid-cols-2">
        {BLOCKS.map((block, idx) => (
          <FadeUp key={block.number} delay={idx * 0.04}>
            <div className="border-t border-white/15 pt-6">
              <div className="font-rogo-sans text-[0.875rem] font-medium text-rogo-muted-dark">
                {block.number}
              </div>
              <h3
                className="mt-3 font-rogo-serif font-normal text-white"
                style={{ fontSize: "1.5rem", lineHeight: 1.25 }}
              >
                {block.title}
              </h3>
              <p
                className="mt-3 max-w-[28rem] font-rogo-sans text-white/65"
                style={{ fontSize: "1rem", lineHeight: 1.55 }}
              >
                {block.body}
              </p>
            </div>
          </FadeUp>
        ))}
      </div>
    </Section>
  );
}
