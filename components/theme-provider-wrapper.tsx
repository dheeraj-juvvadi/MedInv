"use client";

import React from "react";
import { ThemeProvider } from "./theme-provider";
import { Toaster } from "./ui/toaster";

export function ThemeProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      {children}
      <Toaster />
    </ThemeProvider>
  );
}
