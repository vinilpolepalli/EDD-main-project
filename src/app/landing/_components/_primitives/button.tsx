import { cva, type VariantProps } from "class-variance-authority";
import Link from "next/link";
import { cn } from "@/lib/utils";

const buttonStyles = cva(
  "inline-flex items-center justify-center gap-2 font-rogo-sans text-[0.875rem] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        "primary-on-ink":
          "h-11 rounded-full bg-white px-6 text-rogo-ink hover:bg-white/90 focus-visible:ring-white focus-visible:ring-offset-rogo-ink",
        "primary-on-paper":
          "h-11 rounded-full bg-rogo-ink px-6 text-white hover:bg-rogo-ink/90 focus-visible:ring-rogo-ink focus-visible:ring-offset-rogo-paper",
        "ghost-on-ink":
          "text-white/80 hover:text-white hover:underline underline-offset-4 focus-visible:ring-white focus-visible:ring-offset-rogo-ink",
        "ghost-on-paper":
          "text-rogo-ink hover:underline underline-offset-4 focus-visible:ring-rogo-ink focus-visible:ring-offset-rogo-paper",
      },
    },
    defaultVariants: {
      variant: "primary-on-paper",
    },
  },
);

type ButtonVariants = VariantProps<typeof buttonStyles>;

interface ButtonProps extends ButtonVariants {
  href: string;
  className?: string;
  children: React.ReactNode;
}

export function Button({ variant, href, className, children }: ButtonProps) {
  return (
    <Link href={href} className={cn(buttonStyles({ variant }), className)}>
      {children}
    </Link>
  );
}
