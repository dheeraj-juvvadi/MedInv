"use client";

import type React from "react";
import { cn } from "@/lib/utils";

interface DashboardShellProps extends React.HTMLAttributes<HTMLDivElement> {}

export function DashboardShell({
  children,
  className,
  ...props
}: DashboardShellProps) {
  return (
    <div
      className={cn("flex flex-col w-full h-full gap-4 md:gap-6", className)}
      {...props}
    >
      {children}
    </div>
  );
}
