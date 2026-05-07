import { Section } from "./_primitives/section";
import { FadeUp } from "./_primitives/fade-up";

const BADGES = [
  "COPPA-aligned",
  "No data sold",
  "Age-gated content",
  "Parent controls",
  "End-to-end encrypted",
];

export function SecuritySection() {
  return (
    <Section variant="paper" className="!py-20 md:!py-24">
      <FadeUp>
        <h3
          className="mx-auto max-w-[42rem] text-center font-serif font-normal text-ink"
          style={{
            fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)",
            letterSpacing: "-0.02em",
            lineHeight: 1.1,
          }}
        >
          Built for families, safe by design.
        </h3>
      </FadeUp>

      <FadeUp delay={0.05}>
        <ul className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
          {BADGES.map((badge, idx) => (
            <li
              key={badge}
              className="flex items-center gap-6 font-sans text-[0.75rem] font-medium uppercase tracking-[0.1em] text-muted"
            >
              <span>{badge}</span>
              {idx < BADGES.length - 1 && (
                <span aria-hidden className="text-line">
                  •
                </span>
              )}
            </li>
          ))}
        </ul>
      </FadeUp>
    </Section>
  );
}
