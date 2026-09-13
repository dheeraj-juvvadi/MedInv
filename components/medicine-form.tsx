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
interface DrugCategory {
  drug_category_id: number;
  drug_category_name: string; // Changed from 'name' to match API response
  common_uses?: string;
}

interface Medicine {
  medicine_id: number;
  name: string;
  price: number;
  manufacturer: string;
  expiry_date: string;
  drug_category_id: number;
}

interface MedicineFormProps {
  medicine?: Medicine | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function MedicineForm({
  medicine,
  isOpen,
  onOpenChange,
  onSuccess,
}: MedicineFormProps) {
  // Form state
  const [drugCategories, setDrugCategories] = useState<DrugCategory[]>([]);
  const [name, setName] = useState("");
  const [manufacturer, setManufacturer] = useState("");
  const [price, setPrice] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  // UI state
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const isEditMode = Boolean(medicine);

  // Format date from API to YYYY-MM-DD for input
  const formatToInputDate = (dateString: string | undefined): string => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "";
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    } catch (e) {
      return "";
    }
  };

  // Fetch categories and initialize form data when opened
  useEffect(() => {
    if (isOpen) {
      fetchCategories();

      if (isEditMode && medicine) {
        setName(medicine.name || "");
        setManufacturer(medicine.manufacturer || "");
        setPrice(String(medicine.price || 0));
        setExpiryDate(formatToInputDate(medicine.expiry_date));
        setSelectedCategory(String(medicine.drug_category_id || ""));
      } else {
        // Reset form in add mode
        setName("");
        setManufacturer("");
        setPrice("");
        setExpiryDate("");
        setSelectedCategory("");
      }
      setError(null);
    }
  }, [isOpen, medicine, isEditMode]);

  // Fetch drug categories
  const fetchCategories = async () => {
    setIsLoadingData(true);
    try {
      const response = await fetch("/api/drug-categories");
      if (!response.ok) throw new Error("Failed to fetch drug categories");
      const data = await response.json();
      console.log("Fetched drug categories:", data); // Debug log
      setDrugCategories(data);
    } catch (err) {
      console.error("Error fetching drug categories:", err);
      setError(
        err instanceof Error ? err.message : "Failed to load categories",
      );
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    // Validation
    if (!name || !manufacturer || !price || !expiryDate || !selectedCategory) {
      setError("Please fill in all required fields.");
      return;
    }

    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum < 0) {
      setError("Price must be a valid number greater than or equal to 0.");
      return;
    }

    setIsSubmitting(true);

    // Prepare payload
    const payload = {
      name,
      manufacturer,
      price: priceNum,
      expiry_date: expiryDate,
      drug_category_id: parseInt(selectedCategory),
    };

    // Determine API endpoint and method
    const url = isEditMode
      ? `/api/medicines?medicine_id=${medicine?.medicine_id}`
      : "/api/medicines";
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

      // Handle API response
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error ||
            `Failed to ${isEditMode ? "update" : "add"} medicine`,
        );
      }

      // Success
      toast({
        title: "Success",
        description: `Medicine ${isEditMode ? "updated" : "added"} successfully.`,
      });

      onOpenChange(false);
      if (onSuccess) onSuccess();
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : `Failed to ${isEditMode ? "update" : "add"} medicine`;
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
                ? `Edit Medicine #${medicine?.medicine_id}`
                : "Add New Medicine"}
            </DialogTitle>
            <DialogDescription>
              {isEditMode
                ? "Update the medicine details."
                : "Enter the details for the new medicine."}
            </DialogDescription>
          </DialogHeader>

          {isLoadingData ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="med-name" className="text-right">
                  Name
                </Label>
                <Input
                  id="med-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="col-span-3"
                />
              </div>

              {/* Manufacturer */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="med-manufacturer" className="text-right">
                  Manufacturer
                </Label>
                <Input
                  id="med-manufacturer"
                  value={manufacturer}
                  onChange={(e) => setManufacturer(e.target.value)}
                  className="col-span-3"
                />
              </div>

              {/* Price */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="med-price" className="text-right">
                  Price
                </Label>
                <Input
                  id="med-price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="col-span-3"
                />
              </div>

              {/* Expiry Date */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="med-expiryDate" className="text-right">
                  Expiry Date
                </Label>
                <Input
                  id="med-expiryDate"
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="col-span-3"
                />
              </div>

              {/* Drug Category */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="med-category" className="text-right">
                  Category
                </Label>
                <div className="col-span-3">
                  <Select
                    value={selectedCategory}
                    onValueChange={setSelectedCategory}
                  >
                    <SelectTrigger id="med-category">
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent className="z-[1001]">
                      {drugCategories && drugCategories.length > 0 ? (
                        drugCategories.map((cat) => (
                          <SelectItem
                            key={cat.drug_category_id}
                            value={String(cat.drug_category_id)}
                          >
                            {cat.drug_category_name}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="unavailable" disabled>
                          No categories available
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
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
                  {isSubmitting
                    ? "Saving..."
                    : isEditMode
                      ? "Save Changes"
                      : "Add Medicine"}
                </Button>
              </DialogFooter>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
