import { cn } from "@/lib/utils";

type Variant = "ink" | "paper";

interface SectionProps {
  variant: Variant;
  id?: string;
  className?: string;
  containerClassName?: string;
  children: React.ReactNode;
}

const bgByVariant: Record<Variant, string> = {
  ink: "bg-rogo-ink text-white",
  paper: "bg-rogo-paper text-rogo-ink",
};

export function Section({
  variant,
  id,
  className,
  containerClassName,
  children,
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        "w-full",
        bgByVariant[variant],
        "py-28 md:py-40",
        className,
      )}
    >
      <div
        className={cn(
          "mx-auto w-full max-w-[1200px] px-6 md:px-10",
          containerClassName,
        )}
      >
        {children}
      </div>
    </section>
  );
}
