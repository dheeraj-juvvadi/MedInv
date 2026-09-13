"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle } from "lucide-react";

// Interfaces
interface Medicine {
  medicine_id: number;
  name: string;
}

interface InventoryItem {
  inventory_number: number;
  medicine_id: number;
  supplier_id?: number | null;
  medicine_name?: string;
  supplier_name?: string | null;
  quantity: number;
}

interface InventoryFormProps {
  item?: InventoryItem | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function InventoryForm({
  item,
  isOpen,
  onOpenChange,
  onSuccess,
}: InventoryFormProps) {
  // Form state
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [selectedMedicine, setSelectedMedicine] = useState<string>("");
  const [quantity, setQuantity] = useState<string>("");

  // UI state
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const isEditMode = Boolean(item);

  // Fetch data and initialize form when dialog opens
  useEffect(() => {
    if (isOpen) {
      fetchFormData();

      if (isEditMode && item) {
        setSelectedMedicine(String(item.medicine_id || ""));
        setQuantity(String(item.quantity || 0));
      } else {
        setSelectedMedicine("");
        setQuantity("");
      }
      setError(null);
    }
  }, [isOpen, item, isEditMode]);

  // Fetch available medicines.
  const fetchFormData = async () => {
    setIsLoadingData(true);
    try {
      // Fetch medicines
      const medResponse = await fetch("/api/medicines");
      if (!medResponse.ok) {
        throw new Error("Failed to fetch medicines");
      }
      const medData = await medResponse.json();
      setMedicines(medData);
    } catch (err) {
      console.error("Error fetching form data:", err);
      setError(
        err instanceof Error ? err.message : "Failed to load required data",
      );
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    // Validate form
    if (!selectedMedicine || !quantity) {
      setError("Please fill in all required fields.");
      return;
    }

    const quantityNum = Number(quantity);
    if (
      !Number.isSafeInteger(quantityNum) ||
      quantityNum < (isEditMode ? 0 : 1)
    ) {
      setError(
        `Quantity must be a whole number ${isEditMode ? "0 or more" : "1 or more"}.`,
      );
      return;
    }

    setIsSubmitting(true);

    // Prepare payload
    const payload = {
      medicine_id: parseInt(selectedMedicine),
      quantity: quantityNum,
    };

    // Determine API endpoint and method
    const url = isEditMode
      ? `/api/inventory?inventory_number=${item?.inventory_number}`
      : "/api/inventory";
    const method = isEditMode ? "PUT" : "POST";

    try {
      // Submit form data
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
        },
        body: JSON.stringify(payload),
      });

      // Check for API errors
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error ||
            `Failed to ${isEditMode ? "update" : "add"} inventory item`,
        );
      }

      // Handle success
      toast({
        title: "Success",
        description: `Inventory item ${isEditMode ? "updated" : "added"} successfully.`,
      });

      // Close dialog and refresh parent
      onOpenChange(false);
      if (onSuccess) onSuccess();
    } catch (err) {
      // Handle errors
      const message =
        err instanceof Error
          ? err.message
          : `Failed to ${isEditMode ? "update" : "add"} item`;
      setError(message);
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Only render if open
  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] p-0 overflow-hidden">
        <div style={{ zIndex: 1000 }} className="p-6 bg-background">
          <DialogHeader className="mb-4">
            <DialogTitle>
              {isEditMode
                ? `Edit Inventory Item #${item?.inventory_number}`
                : "Add New Inventory Item"}
            </DialogTitle>
            <DialogDescription>
              {isEditMode
                ? "Update the details for this inventory item."
                : "Choose a medicine and the number of units to add."}
            </DialogDescription>
          </DialogHeader>

          {isLoadingData ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Medicine Select */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="inv-medicine" className="text-right">
                  Medicine
                </Label>
                <div className="col-span-3">
                  <Select
                    value={selectedMedicine}
                    onValueChange={setSelectedMedicine}
                  >
                    <SelectTrigger id="inv-medicine">
                      <SelectValue placeholder="Select Medicine" />
                    </SelectTrigger>
                    <SelectContent className="z-[1001]">
                      {medicines.length > 0 ? (
                        medicines.map((med) => (
                          <SelectItem
                            key={med.medicine_id}
                            value={String(med.medicine_id)}
                          >
                            {med.name}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="unavailable" disabled>
                          No medicines available
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Quantity Input */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="inv-quantity" className="text-right">
                  Quantity
                </Label>
                <Input
                  id="inv-quantity"
                  type="number"
                  min={isEditMode ? "0" : "1"}
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="col-span-3"
                />
              </div>

              {/* Error message */}
              {error && (
                <div className="p-3 rounded bg-destructive/10 text-destructive flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              <DialogFooter className="flex justify-end space-x-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting || isLoadingData}>
                  {isSubmitting ? (
                    <>
                      <span className="mr-2">Saving...</span>
                      <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
                    </>
                  ) : isEditMode ? (
                    "Save Changes"
                  ) : (
                    "Add Item"
                  )}
                </Button>
              </DialogFooter>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
