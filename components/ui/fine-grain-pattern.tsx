import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

// Adapted from Opensource UI's FineGrainPattern. MIT © 2026 Bidyut Kundu.
// License: public/third-party-notices.txt
export const FineGrainPattern = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ children, className, ...props }, ref) => (
  <div ref={ref} className={cn("fine-grain-pattern", className)} {...props}>
    <div aria-hidden="true" className="fine-grain-layer" />
    {children}
  </div>
));
FineGrainPattern.displayName = "FineGrainPattern";
