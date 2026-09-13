"use client";

import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Clock3,
  Package,
  Pill,
  ShoppingBag,
  Truck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  type DashboardResource,
  type ExpiryAlert,
  type InventoryItem,
  type Medicine,
  type Order,
  type Supplier,
  isLowStock,
  LOW_STOCK_THRESHOLD,
} from "./use-dashboard-data";

interface StatsProps {
  inventory: DashboardResource<InventoryItem>;
  medicines: DashboardResource<Medicine>;
  orders: DashboardResource<Order>;
  suppliers: DashboardResource<Supplier>;
  onRetry: () => void;
}

export function DashboardStats({
  inventory,
  medicines,
  orders,
  suppliers,
  onRetry,
}: StatsProps) {
  const stats = [
    {
      label: "Inventory units",
      value: inventory.items?.reduce(
        (sum, item) => sum + Number(item.quantity),
        0,
      ),
      detail: "View inventory",
      icon: Package,
      href: "/inventory",
      resource: inventory,
    },
    {
      label: "Medicines",
      value: medicines.items?.length,
      detail: "View medicines",
      icon: Pill,
      href: "/medicines",
      resource: medicines,
    },
    {
      label: "Orders",
      value: orders.items
        ? new Set(orders.items.map((order) => order.order_id)).size
        : undefined,
      detail: "View orders",
      icon: ShoppingBag,
      href: "/orders",
      resource: orders,
    },
    {
      label: "Suppliers",
      value: suppliers.items?.length,
      detail: "View suppliers",
      icon: Truck,
      href: "/suppliers",
      resource: suppliers,
    },
  ];

  return (
    <section className="dash-stats" aria-label="Inventory overview">
      {stats.map(({ label, value, detail, icon: Icon, href, resource }) => (
        <div className="dash-stat" key={label} aria-busy={resource.loading}>
          <div className="dash-stat-label">
            <span>{label}</span>
            <Icon size={18} strokeWidth={1.5} aria-hidden="true" />
          </div>
          {resource.error ? (
            <div className="dash-stat-error">
              <span>Unavailable</span>
              <Button variant="link" onClick={onRetry}>
                Retry
              </Button>
            </div>
          ) : resource.loading && value === undefined ? (
            <div
              className="dash-stat-skeleton"
              role="status"
              aria-label={`Loading ${label.toLowerCase()}`}
            />
          ) : (
            <strong className="dash-stat-number">
              {value?.toLocaleString() ?? "—"}
            </strong>
          )}
          <Link href={href} className="dash-stat-link">
            {detail}
            <ArrowUpRight size={14} aria-hidden="true" />
          </Link>
        </div>
      ))}
    </section>
  );
}

interface AttentionProps {
  inventory: DashboardResource<InventoryItem>;
  expiry: DashboardResource<ExpiryAlert>;
  onRetry: () => void;
}

export function DashboardAttention({
  inventory,
  expiry,
  onRetry,
}: AttentionProps) {
  const lowStock = inventory.items?.filter(isLowStock) ?? [];
  const expiryItems =
    expiry.items?.filter((item) => Number(item.quantity) > 0) ?? [];

  return (
    <section
      className="dash-panel dash-attention"
      aria-labelledby="attention-title"
    >
      <div className="dash-section-top">
        <div>
          <h2 id="attention-title">Attention</h2>
        </div>
      </div>
      <div className="dash-attention-body">
        {inventory.error ? (
          <div className="dash-inline-error" role="alert">
            <p>Stock checks are unavailable.</p>
            <Button variant="link" onClick={onRetry}>
              Try again
            </Button>
          </div>
        ) : inventory.loading && !inventory.items ? (
          <p className="dash-loading-copy" role="status">
            Checking stock levels…
          </p>
        ) : (
          <Link
            href="/inventory?filter=low-stock"
            className={`dash-attention-summary ${lowStock.length ? "dash-attention-warning" : ""}`}
          >
            <span className="dash-attention-symbol">
              {lowStock.length ? (
                <Package size={19} aria-hidden="true" />
              ) : (
                <Check size={19} aria-hidden="true" />
              )}
            </span>
            <span>
              <strong>
                {lowStock.length
                  ? `${lowStock.length} ${lowStock.length === 1 ? "entry needs" : "entries need"} a restock`
                  : inventory.items?.length
                    ? "Stock levels look good"
                    : "No inventory records"}
              </strong>
              <small>
                {inventory.items?.length
                  ? `Low stock: fewer than ${LOW_STOCK_THRESHOLD} units`
                  : "Add inventory to start tracking stock"}
              </small>
            </span>
            <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
        )}
        <div className="dash-expiry-heading">
          <span>
            <Clock3 size={15} aria-hidden="true" /> Expiry watch
          </span>
          {expiry.items && <span>{expiryItems.length}</span>}
        </div>
        {expiry.error ? (
          <div className="dash-inline-error" role="alert">
            <p>Expiry alerts couldn't be loaded.</p>
            <Button variant="link" onClick={onRetry}>
              Try again
            </Button>
          </div>
        ) : expiry.loading && !expiry.items ? (
          <p className="dash-loading-copy" role="status">
            Checking expiry dates…
          </p>
        ) : !expiryItems.length ? (
          <p className="dash-attention-clear">
            No stocked medicines expire in the next 90 days.
          </p>
        ) : (
          <ul className="dash-expiry-list">
            {expiryItems.slice(0, 3).map((item, index) => (
              <li key={`${item.medicine_id}-${index}`}>
                <Link href="/expiry-alerts">
                  <span>
                    <strong>{item.medicine_name}</strong>
                    <small>
                      {Number(item.quantity).toLocaleString()} units on hand
                    </small>
                  </span>
                  <span
                    className={
                      item.days_remaining <= 0
                        ? "dash-expiry-urgent"
                        : "dash-expiry-soon"
                    }
                  >
                    {item.days_remaining < 0
                      ? "Expired"
                      : item.days_remaining === 0
                        ? "Today"
                        : `${item.days_remaining} days`}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
        <Link href="/expiry-alerts" className="dash-text-link dash-expiry-link">
          Review expiry alerts <ArrowRight size={15} aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
