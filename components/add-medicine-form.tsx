"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Interfaces
interface DrugCategory {
  drug_category_id: number;
  name: string;
}

export function AddMedicineForm() {
  const router = useRouter();
  const { toast } = useToast();

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

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Fetch drug categories
  const fetchCategories = async () => {
    setIsLoadingData(true);
    try {
      const response = await fetch("/api/drug-categories");
      if (!response.ok) throw new Error("Failed to fetch drug categories");
      const data = await response.json();
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

    try {
      // Submit form data
      const response = await fetch("/api/medicines", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
        },
        body: JSON.stringify(payload),
      });

      // Handle API response
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to add medicine");
      }

      // Success
      toast({
        title: "Success",
        description: "Medicine added successfully.",
      });

      // Navigate to medicines list
      router.push("/medicines");
      router.refresh();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to add medicine";
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
    <Card className="w-full">
      <CardContent className="pt-6">
        {isLoadingData ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
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
                  <SelectContent>
                    {drugCategories.length > 0 ? (
                      drugCategories.map((cat) => (
                        <SelectItem
                          key={cat.drug_category_id}
                          value={String(cat.drug_category_id)}
                        >
                          {cat.name}
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
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="flex justify-end space-x-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/medicines")}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting || isLoadingData}>
                {isSubmitting ? "Adding..." : "Add Medicine"}
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
