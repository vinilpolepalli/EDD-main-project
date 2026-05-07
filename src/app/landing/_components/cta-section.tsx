import { Section } from "./_primitives/section";
import { FadeUp } from "./_primitives/fade-up";
import { Button } from "./_primitives/button";

export function CTASection() {
  return (
    <Section variant="ink">
      <div className="mx-auto flex max-w-[48rem] flex-col items-center text-center">
        <FadeUp>
          <h2
            className="font-serif font-normal text-white"
            style={{
              fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
              letterSpacing: "-0.02em",
              lineHeight: 1.05,
            }}
          >
            Give your kid a head start with money.
          </h2>
        </FadeUp>
        <FadeUp delay={0.05}>
          <div className="mt-12">
            <Button href="/signup" variant="primary-on-ink">
              Get Started Free
            </Button>
          </div>
        </FadeUp>
      </div>
    </Section>
  );
}
