import { ArrowRight } from "lucide-react";
import { Button } from "./_primitives/button";
import { Eyebrow } from "./_primitives/eyebrow";
import { FadeUp } from "./_primitives/fade-up";

function ArchitectureComposition() {
  return (
    <div
      className="relative h-full w-full overflow-hidden bg-rogo-ink"
      aria-hidden
    >
      {/* Layer 1 — sky gradient, warm umber descending into ink */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, #2a1d12 0%, #1a1410 35%, #14110d 60%, #0A0A0A 100%)",
        }}
      />

      {/* Layer 2 — sun glow, warm radial spotlight */}
      <div
        className="absolute h-[420px] w-[420px]"
        style={{
          top: "30%",
          right: "20%",
          background:
            "radial-gradient(circle, rgba(220,170,110,0.42) 0%, rgba(220,170,110,0.18) 35%, transparent 65%)",
          filter: "blur(8px)",
        }}
      />

      {/* Layer 3 — neoclassical architecture (SVG) */}
      <svg
        className="absolute inset-x-0 bottom-0 mx-auto"
        style={{ width: "78%", maxWidth: 720 }}
        viewBox="0 0 720 540"
        preserveAspectRatio="xMidYEnd meet"
        role="presentation"
      >
        {/* base/ground line */}
        <rect x="0" y="500" width="720" height="40" fill="#0A0A0A" />

        {/* stylobate (platform) */}
        <rect x="40" y="470" width="640" height="30" fill="#7d6644" />
        <rect x="40" y="470" width="640" height="6" fill="#a08766" />
        <rect x="40" y="494" width="640" height="6" fill="#3a2e22" />

        {/* columns — 5 vertical pairs (lit + shadow side) */}
        {[80, 220, 360, 500, 640].map((x) => (
          <g key={x}>
            {/* shadow side */}
            <rect
              x={x - 22}
              y={210}
              width={22}
              height={260}
              fill="#3a2e22"
            />
            {/* lit side */}
            <rect x={x} y={210} width={22} height={260} fill="#b89968" />
            {/* capital */}
            <rect
              x={x - 28}
              y={200}
              width={56}
              height={10}
              fill="#a08766"
            />
            <rect
              x={x - 30}
              y={194}
              width={60}
              height={6}
              fill="#cdb087"
            />
            {/* base */}
            <rect
              x={x - 28}
              y={462}
              width={56}
              height={10}
              fill="#a08766"
            />
          </g>
        ))}

        {/* architrave */}
        <rect x="36" y="170" width="648" height="24" fill="#a08766" />
        <rect x="36" y="166" width="648" height="6" fill="#cdb087" />
        <rect x="36" y="190" width="648" height="6" fill="#3a2e22" />

        {/* frieze */}
        <rect x="36" y="140" width="648" height="26" fill="#7d6644" />

        {/* pediment (triangular roof) */}
        <polygon
          points="36,140 360,60 684,140"
          fill="#a08766"
        />
        {/* pediment shadow */}
        <polygon
          points="36,140 360,60 360,140"
          fill="#7d6644"
        />
      </svg>

      {/* Layer 4 — left-edge vignette bleeding into the ink hero */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to left, transparent 0%, transparent 55%, rgba(10,10,10,0.55) 100%)",
        }}
      />

      {/* Layer 5 — top vignette to soften the sky edge under the navbar */}
      <div
        className="absolute inset-x-0 top-0 h-32"
        style={{
          background:
            "linear-gradient(to bottom, rgba(10,10,10,0.6) 0%, transparent 100%)",
        }}
      />
    </div>
  );
}

export function Hero() {
  return (
    <section className="relative w-full bg-rogo-ink text-white">
      <div className="mx-auto flex min-h-[88vh] w-full max-w-[1200px] flex-col gap-12 px-6 pb-16 pt-32 md:flex-row md:items-center md:gap-10 md:px-10 md:pb-24 md:pt-40">
        {/* Left column */}
        <div className="md:w-[45%]">
          <FadeUp>
            <Eyebrow tone="ink" className="mb-8 text-rogo-muted-dark">
              Financial Literacy • Ages 10–14
            </Eyebrow>
          </FadeUp>

          <FadeUp delay={0.05}>
            <h1
              className="font-rogo-serif font-normal text-white"
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
              className="mt-8 max-w-[28rem] font-rogo-sans text-white/65"
              style={{ fontSize: "1.0625rem", lineHeight: 1.55 }}
            >
              CashQuest is the gamified way kids learn personal finance —
              earning, saving, budgeting, and investing through quests built
              for how they actually think.
            </p>
          </FadeUp>

          <FadeUp delay={0.15}>
            <div className="mt-10 flex flex-wrap items-center gap-6">
              <Button href="#pricing" variant="primary-on-ink">
                Get Started Free
              </Button>
              <Button href="#why" variant="ghost-on-ink">
                See how it works <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </FadeUp>
        </div>

        {/* Right column — CSS/SVG architecture */}
        <div className="relative h-[420px] w-full overflow-hidden rounded-2xl md:h-[560px] md:w-[55%] md:rounded-none">
          <ArchitectureComposition />
        </div>
      </div>
    </section>
  );
}
