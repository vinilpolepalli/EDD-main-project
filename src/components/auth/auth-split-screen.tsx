import Link from "next/link";
import type { ReactNode } from "react";

interface AuthSplitScreenProps {
  /** Headline shown on the dark right panel */
  headline: string;
  /** One-line subhead under the headline */
  sub: string;
  /** Clerk form goes here */
  children: ReactNode;
}

/**
 * Two-column auth layout: white form on the left, dark editorial panel on
 * the right with stylized CashQuest preview cards. Mobile collapses to
 * form-only.
 */
export function AuthSplitScreen({
  headline,
  sub,
  children,
}: AuthSplitScreenProps) {
  return (
    <div className="grid min-h-screen w-full grid-cols-1 md:grid-cols-2">
      {/* Left — form */}
      <div className="flex min-h-screen flex-col bg-paper px-6 py-10 md:px-12">
        <Link
          href="/landing"
          className="font-serif text-[1.25rem] lowercase tracking-tight text-ink"
        >
          cashquest
        </Link>
        <div className="flex flex-1 items-center justify-center py-12">
          <div className="w-full max-w-[24rem]">{children}</div>
        </div>
        <p className="font-sans text-[0.75rem] text-muted">
          For educational purposes only. Not financial advice.
        </p>
      </div>

      {/* Right — dark editorial panel with mock preview cards (desktop only) */}
      <div className="relative hidden overflow-hidden bg-ink text-white md:block">
        <div className="flex h-full flex-col justify-between p-12">
          <div>
            <span className="inline-flex items-center gap-2 font-sans text-[0.75rem] font-medium uppercase tracking-[0.12em] text-muted-dark">
              <span
                aria-hidden
                className="inline-block h-1.5 w-1.5 rounded-full bg-accent"
              />
              Your money quest
            </span>
            <h2
              className="mt-6 max-w-[26rem] font-serif font-normal text-white"
              style={{
                fontSize: "clamp(2rem, 3.5vw, 3rem)",
                letterSpacing: "-0.02em",
                lineHeight: 1.1,
              }}
            >
              {headline}
            </h2>
            <p className="mt-4 max-w-[24rem] font-sans text-[1rem] leading-[1.55] text-white/70">
              {sub}
            </p>
          </div>

          {/* Mock CashQuest preview cards — pure JSX, no images */}
          <div className="relative h-[320px]">
            {/* Card 1 — XP gain */}
            <div className="absolute right-0 top-0 w-[280px] rotate-[3deg] rounded-2xl bg-paper p-5 text-ink shadow-2xl shadow-black/40">
              <div className="font-sans text-[0.7rem] font-medium uppercase tracking-[0.12em] text-muted">
                Quest complete
              </div>
              <div className="mt-2 font-serif text-[1.5rem] leading-tight">
                Budgeting Basics
              </div>
              <div className="mt-4 flex items-end justify-between">
                <div>
                  <div className="font-sans text-[0.75rem] text-muted">
                    XP earned
                  </div>
                  <div className="font-serif text-[2rem] leading-none text-accent">
                    +120
                  </div>
                </div>
                <div className="rounded-full bg-accent-soft px-3 py-1 font-sans text-[0.75rem] font-medium text-accent">
                  Streak ×7
                </div>
              </div>
            </div>

            {/* Card 2 — Bank balance */}
            <div className="absolute bottom-12 left-0 w-[260px] -rotate-[2deg] rounded-2xl bg-paper p-5 text-ink shadow-2xl shadow-black/40">
              <div className="font-sans text-[0.7rem] font-medium uppercase tracking-[0.12em] text-muted">
                Bank balance
              </div>
              <div
                className="mt-3 font-serif font-normal text-ink"
                style={{ fontSize: "2.25rem", lineHeight: 1 }}
              >
                $1,284
              </div>
              <div className="mt-3 flex items-center gap-2 font-sans text-[0.75rem] text-accent">
                <span aria-hidden className="text-base leading-none">↑</span>
                <span>+$48 this month</span>
              </div>
            </div>

            {/* Card 3 — Tokens */}
            <div className="absolute bottom-0 right-12 w-[180px] rotate-[1deg] rounded-2xl bg-paper p-4 text-ink shadow-2xl shadow-black/40">
              <div className="font-sans text-[0.7rem] font-medium uppercase tracking-[0.12em] text-muted">
                Arcade tokens
              </div>
              <div className="mt-2 flex items-baseline gap-1">
                <span
                  className="font-serif font-normal text-ink"
                  style={{ fontSize: "1.75rem", lineHeight: 1 }}
                >
                  42
                </span>
                <span className="font-sans text-[0.75rem] text-muted">
                  / 50
                </span>
              </div>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-paper-2">
                <div
                  className="h-full bg-accent"
                  style={{ width: "84%" }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
