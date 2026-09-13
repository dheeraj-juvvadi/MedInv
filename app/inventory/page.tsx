"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { AppLayout } from "@/components/app-layout";
import { DashboardShell } from "@/components/dashboard-shell";
import { DashboardHeader } from "@/components/dashboard-header";
import { Button } from "@/components/ui/button";
import { InventoryForm } from "@/components/inventory-form";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertCircle,
  ArrowUpRight,
  Edit2,
  Package2,
  Plus,
  Trash2,
} from "lucide-react";
import { DataTable } from "@/components/data-table";
import "./inventory.css";

interface InventoryItem {
  inventory_number: number;
  medicine_id: number;
  supplier_id: number | null;
  medicine_name: string;
  supplier_name: string | null;
  quantity: number;
}

type StockFilter = "all" | "low-stock" | "out-of-stock";

function stockStatus(quantity: number) {
  if (quantity === 0) return { label: "Out of stock", className: "is-empty" };
  if (quantity < 10) return { label: "Low stock", className: "is-low" };
  return { label: "In stock", className: "is-available" };
}

export default function InventoryPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [currentItem, setCurrentItem] = useState<InventoryItem | null>(null);
  const [itemToDelete, setItemToDelete] = useState<InventoryItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [stockFilter, setStockFilter] = useState<StockFilter>("all");

  const fetchInventory = useCallback(async () => {
    setIsLoading(true);
    setFetchError(null);
    try {
      const response = await fetch("/api/inventory");
      if (!response.ok)
        throw new Error("Inventory could not be loaded. Please try again.");
      setInventory(await response.json());
    } catch (error) {
      setFetchError(
        error instanceof Error
          ? error.message
          : "An unexpected error occurred.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchInventory();
    const filter = new URLSearchParams(window.location.search).get("filter");
    if (filter === "low-stock" || filter === "out-of-stock")
      setStockFilter(filter);
  }, [fetchInventory]);

  const handleOpenForm = useCallback((item: InventoryItem | null = null) => {
    setActionError(null);
    setCurrentItem(item);
    setIsFormOpen(true);
  }, []);

  const handleDelete = async () => {
    if (!itemToDelete || isDeleting) return;
    setActionError(null);
    setIsDeleting(true);
    try {
      const response = await fetch(
        `/api/inventory?inventory_number=${itemToDelete.inventory_number}`,
        {
          method: "DELETE",
        },
      );
      if (!response.ok) {
        const error = await response.json();
        throw new Error(
          error.error || "This inventory item could not be deleted.",
        );
      }
      setItemToDelete(null);
      await fetchInventory();
    } catch (error) {
      setActionError(
        error instanceof Error
          ? error.message
          : "An unexpected error occurred during deletion.",
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    setCurrentItem(null);
    void fetchInventory();
  };

  const summary = useMemo(
    () =>
      inventory.reduce(
        (totals, item) => ({
          units: totals.units + Number(item.quantity),
          low: totals.low + (item.quantity < 10 ? 1 : 0),
          empty: totals.empty + (item.quantity === 0 ? 1 : 0),
        }),
        { units: 0, low: 0, empty: 0 },
      ),
    [inventory],
  );

  const filteredInventory = useMemo(
    () =>
      inventory.filter((item) =>
        stockFilter === "low-stock"
          ? item.quantity < 10
          : stockFilter === "out-of-stock"
            ? item.quantity === 0
            : true,
      ),
    [inventory, stockFilter],
  );

  const columns = useMemo<ColumnDef<InventoryItem>[]>(
    () => [
      {
        accessorKey: "inventory_number",
        header: "Stock no.",
        cell: ({ row }) => (
          <span className="inventory-record-number">
            #{String(row.original.inventory_number).padStart(4, "0")}
          </span>
        ),
      },
      {
        accessorKey: "medicine_name",
        header: "Medicine",
        cell: ({ row }) => (
          <div className="inventory-medicine">
            <span className="inventory-medicine-icon" aria-hidden="true">
              <Package2 size={18} strokeWidth={1.5} />
            </span>
            <div>
              <span className="inventory-medicine-name">
                {row.original.medicine_name || "Unnamed medicine"}
              </span>
              <span className="inventory-medicine-detail">
                Medicine #{row.original.medicine_id}
              </span>
            </div>
          </div>
        ),
      },
      {
        accessorKey: "supplier_name",
        header: "Supplier",
        cell: ({ row }) => (
          <span className="inventory-supplier">
            {row.original.supplier_name || "Not recorded"}
          </span>
        ),
      },
      {
        accessorKey: "quantity",
        header: "Available stock",
        cell: ({ row }) => (
          <span className="inventory-quantity">
            {row.original.quantity.toLocaleString()} <span>units</span>
          </span>
        ),
      },
      {
        id: "status",
        accessorFn: (item) => stockStatus(item.quantity).label,
        header: "Status",
        cell: ({ row }) => {
          const status = stockStatus(row.original.quantity);
          return (
            <span className={`inventory-stock-status ${status.className}`}>
              <span aria-hidden="true" />
              {status.label}
            </span>
          );
        },
      },
      {
        id: "actions",
        header: () => <span className="sr-only">Actions</span>,
        cell: ({ row }) => (
          <div className="inventory-row-actions">
            <Button
              variant="ghost"
              size="icon"
              aria-label={`Edit ${row.original.medicine_name}`}
              onClick={() => handleOpenForm(row.original)}
            >
              <Edit2 size={15} aria-hidden="true" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              aria-label={`Delete ${row.original.medicine_name}`}
              className="inventory-delete-button"
              onClick={() => {
                setActionError(null);
                setItemToDelete(row.original);
              }}
            >
              <Trash2 size={15} aria-hidden="true" />
            </Button>
          </div>
        ),
      },
    ],
    [handleOpenForm],
  );

  const summaryValue = (value: number) =>
    isLoading ? "—" : value.toLocaleString();

  return (
    <AppLayout>
      <DashboardShell>
        <div className="inventory-page">
          <DashboardHeader
            heading="Inventory"
            text="Track stock levels and update medicine quantities."
          >
            <Button
              onClick={() => handleOpenForm()}
              className="inventory-add-button"
            >
              <Plus size={16} aria-hidden="true" /> Add inventory
            </Button>
          </DashboardHeader>

          <section
            className="inventory-summary"
            aria-label="Inventory overview"
            aria-busy={isLoading}
          >
            <div className="inventory-summary-item">
              <span className="inventory-summary-label">Inventory records</span>
              <strong>{summaryValue(inventory.length)}</strong>
              <span className="inventory-summary-note">
                Across your medicine cabinet
              </span>
            </div>
            <div className="inventory-summary-item">
              <span className="inventory-summary-label">Units on hand</span>
              <strong>{summaryValue(summary.units)}</strong>
              <span className="inventory-summary-note">
                Total available stock
              </span>
            </div>
            <button
              className="inventory-summary-item inventory-summary-link"
              onClick={() => setStockFilter("low-stock")}
              aria-label={`Show ${summary.low} low-stock records`}
            >
              <span className="inventory-summary-label">
                Running low <ArrowUpRight size={14} aria-hidden="true" />
              </span>
              <strong>{summaryValue(summary.low)}</strong>
              <span className="inventory-summary-note">
                Fewer than 10 units remaining
              </span>
            </button>
            <button
              className="inventory-summary-item inventory-summary-link"
              onClick={() => setStockFilter("out-of-stock")}
              aria-label={`Show ${summary.empty} out-of-stock records`}
            >
              <span className="inventory-summary-label">
                Out of stock <ArrowUpRight size={14} aria-hidden="true" />
              </span>
              <strong>{summaryValue(summary.empty)}</strong>
              <span className="inventory-summary-note">
                Ready for replenishment
              </span>
            </button>
          </section>

          <section
            className="inventory-workspace panel"
            aria-labelledby="inventory-table-heading"
          >
            <div className="inventory-workspace-heading">
              <div>
                <h2 id="inventory-table-heading">
                  Your inventory{" "}
                  <span>{isLoading ? "—" : inventory.length}</span>
                </h2>
                <p>Manage stock, make adjustments, and keep things moving.</p>
              </div>
              <span className="inventory-table-note">
                Low stock: under 10 units
              </span>
            </div>
            {fetchError ? (
              <div className="inventory-error" role="alert">
                <AlertCircle size={24} aria-hidden="true" />
                <h3>We couldn’t load your inventory</h3>
                <p>{fetchError}</p>
                <Button variant="outline" onClick={() => void fetchInventory()}>
                  Try again
                </Button>
              </div>
            ) : (
              <DataTable
                columns={columns}
                data={filteredInventory}
                searchKey="medicine or supplier"
                tableLabel="Medicine inventory"
                exportFilename="medinv-inventory.csv"
                isLoading={isLoading}
                toolbar={
                  <div
                    className="inventory-stock-filters"
                    role="group"
                    aria-label="Filter inventory by stock level"
                  >
                    <button
                      aria-pressed={stockFilter === "all"}
                      onClick={() => setStockFilter("all")}
                    >
                      All stock
                    </button>
                    <button
                      aria-pressed={stockFilter === "low-stock"}
                      onClick={() => setStockFilter("low-stock")}
                    >
                      Low stock <span>{summary.low}</span>
                    </button>
                    <button
                      aria-pressed={stockFilter === "out-of-stock"}
                      onClick={() => setStockFilter("out-of-stock")}
                    >
                      Out of stock <span>{summary.empty}</span>
                    </button>
                  </div>
                }
              />
            )}
          </section>
        </div>
        <InventoryForm
          item={currentItem}
          isOpen={isFormOpen}
          onOpenChange={setIsFormOpen}
          onSuccess={handleFormSuccess}
        />
        <AlertDialog
          open={Boolean(itemToDelete)}
          onOpenChange={(open) => {
            if (!open && !isDeleting) {
              setItemToDelete(null);
              setActionError(null);
            }
          }}
        >
          <AlertDialogContent className="inventory-delete-dialog">
            <AlertDialogHeader>
              <AlertDialogTitle>Remove this inventory record?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently remove {itemToDelete?.medicine_name}{" "}
                (stock #{itemToDelete?.inventory_number}) and its{" "}
                {itemToDelete?.quantity.toLocaleString()} recorded units. The
                medicine itself will not be deleted. This cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            {actionError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" aria-hidden="true" />
                <AlertTitle>Couldn’t delete inventory</AlertTitle>
                <AlertDescription>{actionError}</AlertDescription>
              </Alert>
            )}
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isDeleting}>
                Keep record
              </AlertDialogCancel>
              <AlertDialogAction
                disabled={isDeleting}
                onClick={(event) => {
                  event.preventDefault();
                  void handleDelete();
                }}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {isDeleting ? "Removing…" : "Remove record"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </DashboardShell>
    </AppLayout>
  );
}
