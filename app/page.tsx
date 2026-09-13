"use client";

import { useEffect, useState } from "react";
import { CalendarDays, Plus, RefreshCw } from "lucide-react";
import { AppLayout } from "@/components/app-layout";
import { DashboardShell } from "@/components/dashboard-shell";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";
import { InventorySnapshot } from "@/components/dashboard/inventory-snapshot";
import {
  DashboardStats,
  DashboardAttention,
} from "@/components/dashboard/dashboard-overview";
import {
  DashboardActivity,
  DashboardActions,
} from "@/components/dashboard/dashboard-activity";
import {
  useDashboardResource,
  type Activity,
  type ExpiryAlert,
  type InventoryItem,
  type Medicine,
  type Order,
  type Supplier,
} from "@/components/dashboard/use-dashboard-data";
import "./dashboard.css";

const MedicineForm = dynamic(() =>
  import("@/components/medicine-form").then((module) => module.MedicineForm),
);
const SupplierForm = dynamic(() =>
  import("@/components/supplier-form").then((module) => module.SupplierForm),
);
const InventoryForm = dynamic(() =>
  import("@/components/inventory-form").then((module) => module.InventoryForm),
);

export default function DashboardPage() {
  const [revision, setRevision] = useState(0);
  const [today, setToday] = useState<Date | null>(null);
  const [openForm, setOpenForm] = useState<
    "inventory" | "medicine" | "supplier" | null
  >(null);
  const inventory = useDashboardResource<InventoryItem>(
    "/api/inventory",
    revision,
  );
  const medicines = useDashboardResource<Medicine>("/api/medicines", revision);
  const orders = useDashboardResource<Order>("/api/orders", revision);
  const suppliers = useDashboardResource<Supplier>("/api/suppliers", revision);
  const expiry = useDashboardResource<ExpiryAlert>(
    "/api/expiry-alerts",
    revision,
  );
  const activity = useDashboardResource<Activity>(
    "/api/recent-activity",
    revision,
  );
  const refreshing =
    inventory.loading ||
    medicines.loading ||
    orders.loading ||
    suppliers.loading ||
    expiry.loading ||
    activity.loading;
  const hasErrors = Boolean(
    inventory.error ||
    medicines.error ||
    orders.error ||
    suppliers.error ||
    expiry.error ||
    activity.error,
  );

  useEffect(() => {
    setToday(new Date());
  }, [revision]);

  function refresh() {
    setRevision((previous) => previous + 1);
  }

  function formSaved() {
    setOpenForm(null);
    refresh();
  }

  return (
    <AppLayout>
      <DashboardShell className="medinv-dashboard">
        <header className="dash-heading">
          <div>
            <h1>Overview</h1>
            <p>Inventory, orders, and the items that need attention.</p>
          </div>
          <div className="dash-heading-tools">
            {today && (
              <time
                className="dash-date"
                dateTime={`${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`}
              >
                <CalendarDays size={15} aria-hidden="true" />
                {today.toLocaleDateString("en-GB", {
                  weekday: "short",
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </time>
            )}
            <Button
              variant="outline"
              size="icon"
              onClick={refresh}
              disabled={refreshing}
              aria-label={
                refreshing ? "Refreshing dashboard" : "Refresh dashboard"
              }
              title="Refresh dashboard"
            >
              <RefreshCw size={16} aria-hidden="true" />
            </Button>
            <Button
              onClick={() => setOpenForm("inventory")}
              className="dash-add"
            >
              <Plus size={16} />
              Add inventory
            </Button>
          </div>
        </header>

        <div className="dash-overview-label">
          <span className="dash-data-state" role="status">
            {refreshing
              ? "Updating records…"
              : hasErrors
                ? "Some information is unavailable"
                : "All records up to date"}
          </span>
        </div>
        <DashboardStats
          inventory={inventory}
          medicines={medicines}
          orders={orders}
          suppliers={suppliers}
          onRetry={refresh}
        />

        <div className="dash-workspace">
          <div className="dash-main-column">
            <InventorySnapshot
              inventory={inventory}
              medicines={medicines.items}
              onRetry={refresh}
              onAdd={() => setOpenForm("inventory")}
            />
            <DashboardActivity activity={activity} onRetry={refresh} />
          </div>
          <aside
            className="dash-side-column"
            aria-label="Attention and quick actions"
          >
            <DashboardAttention
              inventory={inventory}
              expiry={expiry}
              onRetry={refresh}
            />
            <DashboardActions
              onMedicine={() => setOpenForm("medicine")}
              onSupplier={() => setOpenForm("supplier")}
            />
          </aside>
        </div>
      </DashboardShell>
      {openForm === "inventory" && (
        <InventoryForm
          isOpen
          onOpenChange={(open) => setOpenForm(open ? "inventory" : null)}
          onSuccess={formSaved}
        />
      )}
      {openForm === "medicine" && (
        <MedicineForm
          isOpen
          onOpenChange={(open) => setOpenForm(open ? "medicine" : null)}
          onSuccess={formSaved}
        />
      )}
      {openForm === "supplier" && (
        <SupplierForm
          isOpen
          onOpenChange={(open) => setOpenForm(open ? "supplier" : null)}
          onSuccess={formSaved}
        />
      )}
    </AppLayout>
  );
}
