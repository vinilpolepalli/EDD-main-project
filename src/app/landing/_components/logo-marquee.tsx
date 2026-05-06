const CHIPS = [
  "Personal Finance",
  "Budgeting",
  "Saving Goals",
  "Smart Spending",
  "Investing Basics",
  "Needs vs. Wants",
];

export function LogoMarquee() {
  return (
    <div className="relative w-full border-t border-white/10 bg-rogo-ink py-10 overflow-hidden">
      {/* Edge masks */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-rogo-ink to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-rogo-ink to-transparent" />

      <div className="rogo-marquee-track flex w-max items-center gap-10 hover:[animation-play-state:paused]">
        {[...CHIPS, ...CHIPS].map((chip, i) => (
          <div
            key={`${chip}-${i}`}
            className="flex shrink-0 items-center gap-10"
          >
            <span className="font-rogo-sans text-[0.875rem] font-medium uppercase tracking-[0.08em] text-white/60">
              {chip}
            </span>
            <span aria-hidden className="text-white/30">
              •
            </span>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes rogo-scroll-x {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .rogo-marquee-track {
          animation: rogo-scroll-x 30s linear infinite;
          will-change: transform;
        }
        @media (prefers-reduced-motion: reduce) {
          .rogo-marquee-track { animation: none; }
        }
      `}</style>
    </div>
  );
}
