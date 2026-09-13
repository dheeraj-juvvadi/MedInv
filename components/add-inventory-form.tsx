"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, Package } from "lucide-react";
import { useRouter } from "next/navigation";

// Interfaces
interface Medicine {
  medicine_id: number;
  name: string;
}

export function AddInventoryForm() {
  const router = useRouter();
  // Form state
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [selectedMedicine, setSelectedMedicine] = useState<string>("");
  const [quantity, setQuantity] = useState<string>("");

  // UI state
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch data when component mounts
  useEffect(() => {
    fetchFormData();
  }, []);

  // Load the medicine catalogue.
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
    if (!Number.isSafeInteger(quantityNum) || quantityNum < 1) {
      setError("Quantity must be a whole number of 1 or more.");
      return;
    }

    setIsSubmitting(true);

    // Prepare payload
    const payload = {
      medicine_id: parseInt(selectedMedicine),
      quantity: quantityNum,
    };

    try {
      // Submit form data
      const response = await fetch("/api/inventory", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
        },
        body: JSON.stringify(payload),
      });

      // Check for API errors
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to add inventory item");
      }

      // Handle success
      toast({
        title: "Success",
        description: "Inventory item added successfully.",
      });

      // Navigate back to inventory list
      router.push("/inventory");
    } catch (err) {
      // Handle errors
      const message = err instanceof Error ? err.message : "Failed to add item";
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

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          <CardTitle>Add New Inventory Item</CardTitle>
        </div>
        <CardDescription>Enter the inventory details below</CardDescription>
      </CardHeader>

      <CardContent>
        {isLoadingData ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <form
            id="add-inventory-form"
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            {/* Medicine Select */}
            <div className="space-y-2">
              <Label htmlFor="inv-medicine">
                Medicine <span className="text-destructive">*</span>
              </Label>
              <Select
                value={selectedMedicine}
                onValueChange={setSelectedMedicine}
              >
                <SelectTrigger id="inv-medicine">
                  <SelectValue placeholder="Select Medicine" />
                </SelectTrigger>
                <SelectContent>
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

            {/* Quantity Input */}
            <div className="space-y-2">
              <Label htmlFor="inv-quantity">
                Quantity <span className="text-destructive">*</span>
              </Label>
              <Input
                id="inv-quantity"
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="Enter quantity"
              />
            </div>

            {/* Error message */}
            {error && (
              <div className="p-3 rounded bg-destructive/10 text-destructive flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm">{error}</span>
              </div>
            )}
          </form>
        )}
      </CardContent>

      <CardFooter className="flex justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/inventory")}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          form="add-inventory-form"
          disabled={isSubmitting || isLoadingData}
        >
          {isSubmitting ? (
            <>
              <span className="mr-2">Saving...</span>
              <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
            </>
          ) : (
            "Add Item"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
