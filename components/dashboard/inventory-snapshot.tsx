"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Package, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  type DashboardResource,
  type InventoryItem,
  type Medicine,
  isLowStock,
  LOW_STOCK_THRESHOLD,
} from "./use-dashboard-data";

interface InventorySnapshotProps {
  inventory: DashboardResource<InventoryItem>;
  medicines: Medicine[] | null;
  onRetry: () => void;
  onAdd: () => void;
}

export function InventorySnapshot({
  inventory,
  medicines,
  onRetry,
  onAdd,
}: InventorySnapshotProps) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const medicineMap = useMemo(
    () =>
      new Map(medicines?.map((medicine) => [medicine.medicine_id, medicine])),
    [medicines],
  );
  const rows = useMemo(() => {
    const term = search.trim().toLowerCase();
    return (inventory.items ?? []).filter((item) => {
      const medicine = medicineMap.get(item.medicine_id);
      const matchesSearch =
        !term ||
        [
          item.medicine_name,
          medicine?.name,
          medicine?.manufacturer,
          item.inventory_number,
        ].some((value) =>
          String(value ?? "")
            .toLowerCase()
            .includes(term),
        );
      const matchesStatus =
        status === "all" ||
        (status === "low" ? isLowStock(item) : !isLowStock(item));
      return matchesSearch && matchesStatus;
    });
  }, [inventory.items, medicineMap, search, status]);

  return (
    <section
      className="dash-panel dash-inventory"
      aria-labelledby="inventory-title"
    >
      <div className="dash-section-top">
        <div>
          <h2 id="inventory-title">Inventory</h2>
        </div>
        <Link href="/inventory" className="dash-text-link">
          View all <ArrowRight size={15} aria-hidden="true" />
        </Link>
      </div>
      <div className="dash-inventory-controls">
        <div className="dash-search">
          <Search size={16} aria-hidden="true" />
          <Input
            type="search"
            aria-label="Search inventory"
            placeholder="Search medicines…"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger
            className="dash-stock-select"
            aria-label="Filter inventory by stock status"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All stock</SelectItem>
            <SelectItem value="healthy">In stock</SelectItem>
            <SelectItem value="low">Low stock</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {inventory.loading && !inventory.items ? (
        <div
          className="dash-loading-list"
          role="status"
          aria-label="Loading inventory"
        >
          <span />
          <span />
          <span />
          <span />
        </div>
      ) : inventory.error ? (
        <div className="dash-empty" role="alert">
          <Package size={24} aria-hidden="true" />
          <h3>Inventory is unavailable</h3>
          <p>{inventory.error}</p>
          <Button variant="outline" onClick={onRetry}>
            Try again
          </Button>
        </div>
      ) : !inventory.items?.length ? (
        <div className="dash-empty">
          <Package size={24} aria-hidden="true" />
          <h3>No inventory records</h3>
          <p>Add your first inventory entry to keep track of stock here.</p>
          <Button onClick={onAdd}>Add inventory</Button>
        </div>
      ) : !rows.length ? (
        <div className="dash-empty" role="status">
          <Search size={24} aria-hidden="true" />
          <h3>No matching inventory</h3>
          <p>Try another medicine or clear your stock filter.</p>
          <Button
            variant="outline"
            onClick={() => {
              setSearch("");
              setStatus("all");
            }}
          >
            Clear filters
          </Button>
        </div>
      ) : (
        <div className="dash-table-wrap" aria-busy={inventory.loading}>
          <table className="dash-stock-table">
            <thead>
              <tr>
                <th scope="col">Medicine</th>
                <th scope="col" className="dash-quantity">
                  Quantity
                </th>
                <th scope="col">Stock status</th>
              </tr>
            </thead>
            <tbody>
              {rows.slice(0, 6).map((item) => {
                const medicine = medicineMap.get(item.medicine_id);
                const quantity = Number(item.quantity);
                return (
                  <tr key={item.inventory_number}>
                    <td>
                      <Link href="/inventory" className="dash-medicine-name">
                        {item.medicine_name ||
                          medicine?.name ||
                          `Medicine #${item.medicine_id}`}
                      </Link>
                      <span className="dash-medicine-meta">
                        {medicine?.manufacturer ||
                          `Inventory #${item.inventory_number}`}
                      </span>
                    </td>
                    <td className="dash-quantity">
                      <strong>{quantity.toLocaleString()}</strong>
                      <span> units</span>
                    </td>
                    <td>
                      <span
                        className={`dash-stock-badge ${quantity === 0 ? "dash-stock-empty" : isLowStock(item) ? "dash-stock-low" : "dash-stock-healthy"}`}
                      >
                        <i aria-hidden="true" />
                        {quantity === 0
                          ? "Out of stock"
                          : isLowStock(item)
                            ? "Low stock"
                            : "In stock"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      <div className="dash-table-footer">
        <span role="status">
          {inventory.items
            ? `Showing ${Math.min(rows.length, 6)} of ${rows.length} ${rows.length === 1 ? "entry" : "entries"}`
            : "Inventory overview"}
        </span>
        <span>Low stock: fewer than {LOW_STOCK_THRESHOLD} units</span>
      </div>
    </section>
  );
}
