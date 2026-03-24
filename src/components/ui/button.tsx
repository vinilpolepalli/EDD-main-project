"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 min-h-[44px] min-w-[44px] cursor-pointer select-none",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-md hover:bg-primary/90 rounded-lg",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80 rounded-lg",
        destructive:
          "bg-destructive text-destructive-foreground shadow-md hover:bg-destructive/90 rounded-lg",
        outline:
          "border-2 border-primary bg-transparent text-primary hover:bg-primary/10 rounded-lg",
        ghost:
          "text-foreground hover:bg-muted rounded-lg",
        link:
          "text-primary underline-offset-4 hover:underline p-0 h-auto min-h-0 min-w-0",
      },
      size: {
        default: "h-12 px-6 py-3 text-base rounded-lg",
        sm: "h-10 px-4 py-2 text-sm rounded-md",
        lg: "h-14 px-8 py-4 text-lg rounded-xl",
        icon: "h-12 w-12 rounded-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

type ButtonVariantProps = VariantProps<typeof buttonVariants>;

interface ButtonProps
  extends Omit<HTMLMotionProps<"button">, "color">,
    ButtonVariantProps {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <motion.button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
export type { ButtonProps };
