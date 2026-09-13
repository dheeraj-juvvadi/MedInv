"use client";

import { useEffect, useState } from "react";

export const LOW_STOCK_THRESHOLD = 10;

export interface InventoryItem {
  inventory_number: number;
  medicine_id: number;
  medicine_name: string | null;
  supplier_name: string | null;
  quantity: number;
}

export interface Medicine {
  medicine_id: number;
  name: string;
  manufacturer: string;
}

export interface Order {
  order_id: number;
}

export interface Supplier {
  supplier_id: number;
}

export interface ExpiryAlert {
  medicine_id: number;
  medicine_name: string;
  expiry_date: string;
  quantity: number;
  days_remaining: number;
}

export interface Activity {
  id: number;
  action: string;
  details: string;
  type: string;
  timestamp: string;
}

export interface DashboardResource<T> {
  items: T[] | null;
  loading: boolean;
  error: string | null;
}

export function useDashboardResource<T>(
  path: string,
  revision: number,
): DashboardResource<T> {
  const [resource, setResource] = useState<DashboardResource<T>>({
    items: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const controller = new AbortController();
    setResource((previous) => ({ ...previous, loading: true, error: null }));

    async function load() {
      try {
        const response = await fetch(path, {
          signal: controller.signal,
          cache: "no-store",
        });
        if (!response.ok)
          throw new Error(
            "This information couldn't be loaded. Please try again.",
          );
        const items = await response.json();
        if (!Array.isArray(items))
          throw new Error(
            "The server returned an unexpected response. Please try again.",
          );
        if (!controller.signal.aborted)
          setResource({ items, loading: false, error: null });
      } catch (error) {
        if (!controller.signal.aborted) {
          setResource({
            items: null,
            loading: false,
            error:
              error instanceof Error
                ? error.message
                : "Unable to connect. Please try again.",
          });
        }
      }
    }

    void load();
    return () => controller.abort();
  }, [path, revision]);

  return resource;
}

export function isLowStock(item: InventoryItem) {
  return Number(item.quantity) < LOW_STOCK_THRESHOLD;
}
