import * as React from "react";
import { cn } from "@/lib/utils";

interface LegalDisclaimerProps extends React.HTMLAttributes<HTMLParagraphElement> {}

const LegalDisclaimer: React.FC<LegalDisclaimerProps> = ({
  className,
  ...props
}) => (
  <p
    className={cn(
      "text-center text-xs leading-relaxed text-muted-foreground",
      className
    )}
    {...props}
  >
    All game content and financial advice is for educational purposes only and
    does not constitute professional financial advice.
  </p>
);

export { LegalDisclaimer };
