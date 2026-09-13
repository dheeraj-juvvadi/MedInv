"use client";

import { useTheme } from "next-themes";
import { Monitor, Moon, Sun, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { DashboardHeader } from "@/components/dashboard-header";
import { DashboardShell } from "@/components/dashboard-shell";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Settings"
        text="Appearance and workspace preferences."
      />
      <section className="panel p-6">
        <h2 className="section-heading">Appearance</h2>
        <p className="text-sm text-muted-foreground mt-2 mb-6">
          Choose an appearance. Your preference is saved on this device.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { value: "light", label: "Daylight", icon: Sun },
            { value: "dark", label: "After hours", icon: Moon },
            { value: "system", label: "Match your device", icon: Monitor },
          ].map((option) => (
            <Button
              key={option.value}
              variant={theme === option.value ? "default" : "outline"}
              className="h-16 justify-start"
              aria-pressed={theme === option.value}
              onClick={() => setTheme(option.value)}
            >
              <option.icon size={18} />
              {option.label}
            </Button>
          ))}
        </div>
      </section>
      <section className="panel p-6">
        <h2 className="section-heading">Your workspace</h2>
        <p className="text-sm text-muted-foreground mt-2 mb-5">
          {process.env.NEXT_PUBLIC_DEPLOYMENT_MODE === "demo"
            ? "This is a demo with sample records. Changes stay in memory until the server restarts."
            : "Your workspace is connected to the configured inventory database."}
        </p>
        <div className="flex flex-wrap gap-3">
          <Button asChild variant="outline">
            <Link href="/staff-accounts">
              Manage staff
              <ArrowUpRight size={15} />
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/feedback">
              Team feedback
              <ArrowUpRight size={15} />
            </Link>
          </Button>
        </div>
      </section>
    </DashboardShell>
  );
}
