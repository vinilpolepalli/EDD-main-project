import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "./_primitives/button";
import { Eyebrow } from "./_primitives/eyebrow";
import { FadeUp } from "./_primitives/fade-up";

export function Hero() {
  return (
    <section className="relative w-full bg-ink text-white">
      <div className="mx-auto flex min-h-[88vh] w-full max-w-[1200px] flex-col gap-12 px-6 pb-16 pt-32 md:flex-row md:items-center md:gap-10 md:px-10 md:pb-24 md:pt-40">
        {/* Left column */}
        <div className="md:w-[45%]">
          <FadeUp>
            <Eyebrow tone="ink" className="mb-8 text-muted-dark">
              <span className="inline-flex items-center gap-2">
                <span
                  aria-hidden
                  className="inline-block h-1.5 w-1.5 rounded-full bg-accent"
                />
                Financial Literacy • Ages 10–14
              </span>
            </Eyebrow>
          </FadeUp>

          <FadeUp delay={0.05}>
            <h1
              className="font-serif font-normal text-white"
              style={{
                fontSize: "clamp(3rem, 7vw, 6.5rem)",
                letterSpacing: "-0.02em",
                lineHeight: 1,
              }}
            >
              For the next generation of smart spenders
            </h1>
          </FadeUp>

          <FadeUp delay={0.1}>
            <p
              className="mt-8 max-w-[28rem] font-sans text-white/65"
              style={{ fontSize: "1.0625rem", lineHeight: 1.55 }}
            >
              CashQuest is the gamified way kids learn personal finance —
              earning, saving, budgeting, and investing through quests built
              for how they actually think.
            </p>
          </FadeUp>

          <FadeUp delay={0.15}>
            <div className="mt-10 flex flex-wrap items-center gap-6">
              <Button href="/signup" variant="primary-on-ink">
                Get Started Free
              </Button>
              <Button href="/guide" variant="ghost-on-ink">
                See how it works <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </FadeUp>
        </div>

        {/* Right column — real architectural photo */}
        <div className="relative h-[420px] w-full overflow-hidden rounded-2xl md:h-[560px] md:w-[55%] md:rounded-none">
          <Image
            src="/landing/hero.jpg"
            alt="Neoclassical architecture at golden hour"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 55vw"
            className="object-cover"
          />
          {/* Left-edge vignette: bleeds the image into the dark hero column */}
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to left, transparent 0%, transparent 60%, rgba(10,10,10,0.65) 100%)",
            }}
          />
          {/* Top vignette: softens the sky edge under the navbar */}
          <div
            aria-hidden
            className="absolute inset-x-0 top-0 h-32"
            style={{
              background:
                "linear-gradient(to bottom, rgba(10,10,10,0.55) 0%, transparent 100%)",
            }}
          />
        </div>
      </div>
    </section>
  );
}
