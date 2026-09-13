"use client";

import { usePathname } from "next/navigation";

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
  const showHeading = !hideTitleOnCollapsed || pathname !== "/";
  return (
    <header className="page-header">
      {showHeading && (
        <div>
          <h1 className="page-heading">{heading}</h1>
          {text && <p className="page-description">{text}</p>}
        </div>
      )}
      {children && <div className="page-header-actions">{children}</div>}
    </header>
  );
}
