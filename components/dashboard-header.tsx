'use client';

import { useContext } from "react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { DeploymentModeIndicator } from "./deployment-mode-indicator";

interface DashboardHeaderProps {
  heading: string;
  text?: string;
  children?: React.ReactNode;
  hideTitleOnCollapsed?: boolean;
}

export function DashboardHeader({
  heading,
  text,
  children,
  hideTitleOnCollapsed = false,
}: DashboardHeaderProps) {
  const pathname = usePathname();
  
  // Determine if we should show the heading based on the current page
  const showHeading = !hideTitleOnCollapsed || pathname !== '/';
  
  return (
    <div className="mb-7 flex flex-col gap-5 border-b border-border/40 pb-6 md:flex-row md:items-end md:justify-between">
      {showHeading && (
        <div className="grid gap-1">
          <p className="eyebrow-label mb-2">MedInv Control</p>
          <h1 className="font-display text-[clamp(2.1rem,5vw,3.4rem)] leading-[0.9] tracking-tight text-foreground">
            {heading}
          </h1>
          {text && (
            <p className="text-muted-foreground text-sm">
              {text}
            </p>
          )}
        </div>
      )}
      <div className={cn("flex flex-wrap items-center gap-3", !showHeading && "ml-auto")}>
        <DeploymentModeIndicator />
        {children}
      </div>
    </div>
  );
}
