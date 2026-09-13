"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Search } from "lucide-react";
import { AppLayout } from "./app-layout";
import { DashboardHeader } from "./dashboard-header";
import { navigation } from "./sidebar";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { MedicineForm } from "./medicine-form";
import { InventoryForm } from "./inventory-form";
import { SupplierForm } from "./supplier-form";

export function AppHub() {
  const [search, setSearch] = useState("");
  const [activeForm, setActiveForm] = useState<
    "medicine" | "inventory" | "supplier" | null
  >(null);
  const pages = navigation.filter(
    (n) =>
      n.path !== "/app-hub" &&
      n.label.toLowerCase().includes(search.toLowerCase()),
  );
  return (
    <AppLayout>
      <div className="space-y-7">
        <DashboardHeader
          heading="All tools"
          text="Manage your records and workspace."
        />
        <section className="hub-actions" aria-label="Create a record">
          <Button onClick={() => setActiveForm("inventory")}>
            Add inventory
          </Button>
          <Button variant="outline" onClick={() => setActiveForm("medicine")}>
            Add medicine
          </Button>
          <Button variant="outline" onClick={() => setActiveForm("supplier")}>
            Add supplier
          </Button>
        </section>
        <div className="relative max-w-md">
          <Search
            className="absolute left-3 top-3.5 text-muted-foreground"
            size={16}
          />
          <Input
            aria-label="Search workspace tools"
            placeholder="Find a tool…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        {["Workspace", "Management", "Administration"].map((group) => {
          const items = pages.filter((n) => n.group === group);
          return (
            items.length > 0 && (
              <section key={group}>
                <h2 className="eyebrow mb-4">{group}</h2>
                <div className="hub-tool-grid">
                  {items.map((n) => (
                    <Link href={n.path} key={n.path} className="hub-tool">
                      <n.icon size={21} strokeWidth={1.5} />
                      <span>{n.label}</span>
                      <ArrowUpRight size={15} />
                    </Link>
                  ))}
                </div>
              </section>
            )
          );
        })}
        {!pages.length && (
          <p className="panel p-8 text-muted-foreground">
            No tools match “{search}”. Try a different name.
          </p>
        )}
        <MedicineForm
          isOpen={activeForm === "medicine"}
          onOpenChange={(open) => !open && setActiveForm(null)}
        />
        <InventoryForm
          isOpen={activeForm === "inventory"}
          onOpenChange={(open) => !open && setActiveForm(null)}
        />
        <SupplierForm
          isOpen={activeForm === "supplier"}
          onOpenChange={(open) => !open && setActiveForm(null)}
        />
      </div>
    </AppLayout>
  );
}
