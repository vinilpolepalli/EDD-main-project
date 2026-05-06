import { Check } from "lucide-react";
import { Section } from "./_primitives/section";
import { FadeUp } from "./_primitives/fade-up";
import { Button } from "./_primitives/button";
import { Eyebrow } from "./_primitives/eyebrow";

interface Plan {
  name: string;
  price: string;
  period: string;
  yearly?: string;
  tagline: string;
  features: string[];
  cta: string;
  emphasized?: boolean;
}

const PLANS: Plan[] = [
  {
    name: "Free",
    price: "$0",
    period: "/ forever",
    tagline: "Everything kids need to start.",
    features: [
      "Full quest library",
      "Progress dashboard for parents",
      "Up to 2 child profiles",
      "Minimal, age-appropriate ads",
    ],
    cta: "Get Started Free",
  },
  {
    name: "Family Plus",
    price: "$6.99",
    period: "/ month",
    yearly: "$59 / year — save 30%",
    tagline: "More kids, no ads, and the AI tutor.",
    features: [
      "Everything in Free",
      "No ads",
      "Up to 5 child profiles",
      "Early access to the AI Tutor (coming soon)",
      "Priority support",
    ],
    cta: "Start Family Plus",
    emphasized: true,
  },
];

export function PricingSection() {
  return (
    <Section variant="paper" id="pricing">
      <FadeUp>
        <h2
          className="mx-auto max-w-[36rem] text-center font-rogo-serif font-normal text-rogo-ink"
          style={{
            fontSize: "clamp(2.25rem, 5vw, 4rem)",
            letterSpacing: "-0.02em",
            lineHeight: 1.05,
          }}
        >
          Simple pricing. Built for families.
        </h2>
      </FadeUp>
      <FadeUp delay={0.05}>
        <p className="mt-4 text-center font-rogo-sans text-[1rem] text-rogo-muted">
          Start free. Upgrade when you&apos;re ready.
        </p>
      </FadeUp>

      <div className="mx-auto mt-16 grid max-w-[56rem] grid-cols-1 gap-6 md:grid-cols-2">
        {PLANS.map((plan, idx) => (
          <FadeUp key={plan.name} delay={idx * 0.05}>
            <div
              className={`relative flex h-full flex-col rounded-2xl bg-rogo-paper-2 p-8 md:p-10 ${
                plan.emphasized ? "border border-rogo-ink" : ""
              }`}
            >
              {plan.emphasized && (
                <Eyebrow className="mb-3">Most Popular</Eyebrow>
              )}
              <h3 className="font-rogo-serif text-[1.5rem] font-normal text-rogo-ink">
                {plan.name}
              </h3>

              <div className="mt-4 flex items-baseline gap-2">
                <span
                  className="font-rogo-serif font-normal text-rogo-ink"
                  style={{ fontSize: "3.5rem", lineHeight: 1 }}
                >
                  {plan.price}
                </span>
                <span className="font-rogo-sans text-[0.9375rem] text-rogo-muted">
                  {plan.period}
                </span>
              </div>
              {plan.yearly && (
                <div className="mt-1 font-rogo-sans text-[0.8125rem] text-rogo-muted">
                  {plan.yearly}
                </div>
              )}

              <p className="mt-3 font-rogo-sans text-[0.9375rem] text-rogo-muted">
                {plan.tagline}
              </p>

              <ul className="mt-8 flex flex-col gap-3">
                {plan.features.map((feat) => (
                  <li
                    key={feat}
                    className="flex items-start gap-3 font-rogo-sans text-[0.9375rem] text-rogo-ink"
                  >
                    <Check className="mt-1 h-4 w-4 shrink-0 text-rogo-ink" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-10 pt-2">
                <Button
                  href="#"
                  variant="primary-on-paper"
                  className="w-full"
                >
                  {plan.cta}
                </Button>
              </div>
            </div>
          </FadeUp>
        ))}
      </div>

      <p className="mt-10 text-center font-rogo-sans text-[0.8125rem] text-rogo-muted">
        AI Tutor launches Spring 2026. Family Plus subscribers get first access
        at no extra cost.
      </p>
    </Section>
  );
}
