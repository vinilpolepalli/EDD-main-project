import { cn } from "@/lib/utils";

interface EyebrowProps {
  className?: string;
  tone?: "ink" | "paper";
  children: React.ReactNode;
}

export function Eyebrow({ className, tone = "paper", children }: EyebrowProps) {
  return (
    <span
      className={cn(
        "block font-sans text-[0.75rem] font-medium uppercase tracking-[0.12em]",
        tone === "ink" ? "text-muted-dark" : "text-muted",
        className,
      )}
    >
      {children}
    </span>
  );
}
