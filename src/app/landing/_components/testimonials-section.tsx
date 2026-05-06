{/* TODO: replace with real testimonials */}
import { Plus } from "lucide-react";
import { Section } from "./_primitives/section";
import { FadeUp } from "./_primitives/fade-up";

interface Testimonial {
  partner: string;
  quote: string;
  name: string;
  role: string;
}

const FEATURED: Testimonial = {
  partner: "RIVERDALE ACADEMY",
  quote:
    "CashQuest gave my fifth-grader a vocabulary for money she didn't have before. She now talks about saving for goals on her own, and the quest format keeps her coming back without me nagging.",
  name: "Jamie Chen",
  role: "Parent",
};

const SECONDARY: Testimonial[] = [
  {
    partner: "KIPP SCHOOLS",
    quote:
      "Our students engaged more with one CashQuest module than a full semester of textbook lessons.",
    name: "Marcus Webb",
    role: "Middle School Teacher",
  },
  {
    partner: "BOYS & GIRLS CLUB",
    quote: "Finally a finance app that doesn't talk down to kids.",
    name: "Priya Shah",
    role: "Education Director",
  },
];

function TestimonialCard({
  data,
  showPlus,
  className,
  quoteSize = "1.375rem",
}: {
  data: Testimonial;
  showPlus?: boolean;
  className?: string;
  quoteSize?: string;
}) {
  return (
    <div
      className={`relative flex h-full flex-col rounded-2xl bg-rogo-paper-2 p-8 md:p-10 ${className ?? ""}`}
    >
      <div className="font-rogo-serif text-[0.875rem] uppercase tracking-[0.12em] text-rogo-muted/70">
        {data.partner}
      </div>

      <blockquote
        className="mt-6 font-rogo-serif text-rogo-ink"
        style={{ fontSize: quoteSize, lineHeight: 1.4 }}
      >
        “{data.quote}”
      </blockquote>

      <div className="mt-auto pt-8">
        <div className="font-rogo-sans text-[0.875rem] font-medium text-rogo-ink">
          {data.name}
        </div>
        <div className="font-rogo-sans text-[0.875rem] text-rogo-muted">
          {data.role}
        </div>
      </div>

      {showPlus && (
        <div
          aria-hidden
          className="absolute bottom-6 right-6 flex h-10 w-10 items-center justify-center rounded-md border border-rogo-line bg-rogo-paper text-rogo-ink"
        >
          <Plus className="h-4 w-4" />
        </div>
      )}
    </div>
  );
}

export function TestimonialsSection() {
  return (
    <Section variant="paper">
      <FadeUp>
        <h2
          className="mx-auto max-w-[36rem] text-center font-rogo-serif font-normal text-rogo-ink"
          style={{
            fontSize: "clamp(2.25rem, 5vw, 4rem)",
            letterSpacing: "-0.02em",
            lineHeight: 1.05,
          }}
        >
          Helping families build smarter money habits
        </h2>
      </FadeUp>

      <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3 md:grid-rows-2">
        <FadeUp className="md:col-span-2 md:row-span-2 md:h-full">
          <TestimonialCard
            data={FEATURED}
            quoteSize="1.5rem"
            className="h-full"
          />
        </FadeUp>
        <FadeUp delay={0.05}>
          <TestimonialCard data={SECONDARY[0]} showPlus />
        </FadeUp>
        <FadeUp delay={0.1}>
          <TestimonialCard data={SECONDARY[1]} showPlus />
        </FadeUp>
      </div>
    </Section>
  );
}
