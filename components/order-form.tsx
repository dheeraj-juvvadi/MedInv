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
import { Alert, AlertDescription } from "@/components/ui/alert";

// Interfaces
interface Patient {
  patient_id: number;
  name: string;
}

interface Medicine {
  medicine_id: number;
  name: string; // Using name instead of medicine_name to be consistent
  quantity?: number; // Available quantity
  price?: number; // Price per unit
}

interface Order {
  order_id: number;
  patient_id: number;
  patient_name?: string;
  medicine_id: number;
  medicine_name?: string;
  quantity?: number;
  order_date: string;
}

interface OrderFormProps {
  order: Order | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function OrderForm({
  order,
  isOpen,
  onOpenChange,
  onSuccess,
}: OrderFormProps) {
  // Form state
  const [patients, setPatients] = useState<Patient[]>([]);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<string>("");
  const [selectedMedicine, setSelectedMedicine] = useState<string>("");
  const [quantity, setQuantity] = useState<string>("1");

  // UI state
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const isEditMode = Boolean(order);

  // Fetch data when form opens
  useEffect(() => {
    if (isOpen) {
      fetchFormData();

      // Reset form when opening
      if (isEditMode && order) {
        setSelectedPatient(order.patient_id?.toString() || "");
        setSelectedMedicine(order.medicine_id?.toString() || "");
        setQuantity(order.quantity?.toString() || "1");
      } else {
        setSelectedPatient("");
        setSelectedMedicine("");
        setQuantity("1");
      }

      setError(null);
    }
  }, [isOpen, isEditMode, order]);

  // Fetch patients and medicines
  const fetchFormData = async () => {
    setIsLoadingData(true);
    setError(null);

    try {
      // Fetch patients
      const patientsResponse = await fetch("/api/patients");
      if (!patientsResponse.ok) throw new Error("Failed to load patients");
      const patientsData = await patientsResponse.json();
      setPatients(patientsData);

      // Fetch medicines
      const medicinesResponse = await fetch("/api/medicines");
      if (!medicinesResponse.ok) throw new Error("Failed to load medicines");
      const medicinesData = await medicinesResponse.json();
      setMedicines(medicinesData);
    } catch (err) {
      console.error("Error loading form data:", err);
      setError(
        err instanceof Error ? err.message : "Failed to load required data",
      );
    } finally {
      setIsLoadingData(false);
    }
  };

  // Handle form submission
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    // Validation
    if (!selectedPatient || !selectedMedicine || !quantity) {
      setError("Please fill in all required fields.");
      return;
    }

    const quantityNum = parseInt(quantity);
    if (isNaN(quantityNum) || quantityNum < 1) {
      setError("Quantity must be a valid number greater than 0.");
      return;
    }

    setIsSubmitting(true);

    // Find the selected medicine to get its price
    const selectedMed = medicines.find(
      (med) => med.medicine_id === parseInt(selectedMedicine),
    );
    // Use a default price if not found
    const pricePerUnit = selectedMed?.price || 100;

    // Prepare payload in the correct format for the API
    const payload = {
      patient_id: parseInt(selectedPatient),
      status: "Pending",
      updateInventory: true,
      items: [
        {
          medicine_id: parseInt(selectedMedicine),
          quantity: quantityNum,
          price_per_unit: pricePerUnit,
        },
      ],
    };

    const url = isEditMode
      ? `/api/orders?id=${order?.order_id}`
      : "/api/orders";
    const method = isEditMode ? "PUT" : "POST";

    try {
      // Submit form data
      const response = await fetch(url, {
        method: method,
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
            errorData.details ||
            `Failed to ${isEditMode ? "update" : "add"} order`,
        );
      }

      // Success
      toast({
        title: "Success",
        description: `Order ${isEditMode ? "updated" : "added"} successfully.`,
      });

      onOpenChange(false);
      if (onSuccess) onSuccess();
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : `Failed to ${isEditMode ? "update" : "add"} order`;
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

  // Handle dialog open/close
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      // Reset form when closing
      setError(null);
    }
    onOpenChange(open);
  };

  // Only render if open
  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px] p-0 overflow-hidden">
        <div style={{ zIndex: 1000 }} className="p-6 bg-background">
          <DialogHeader className="mb-4">
            <DialogTitle>
              {isEditMode ? `Edit Order #${order?.order_id}` : "Add New Order"}
            </DialogTitle>
            <DialogDescription>
              {isEditMode
                ? "Update the order details."
                : "Enter the details for the new order."}
            </DialogDescription>
          </DialogHeader>

          {isLoadingData ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Patient */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="order-patient" className="text-right">
                  Patient
                </Label>
                <div className="col-span-3">
                  <Select
                    value={selectedPatient}
                    onValueChange={setSelectedPatient}
                  >
                    <SelectTrigger id="order-patient">
                      <SelectValue placeholder="Select Patient" />
                    </SelectTrigger>
                    <SelectContent>
                      {patients.length > 0 ? (
                        patients.map((patient) => (
                          <SelectItem
                            key={patient.patient_id}
                            value={String(patient.patient_id)}
                          >
                            {patient.name}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="unavailable" disabled>
                          No patients available
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Medicine */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="order-medicine" className="text-right">
                  Medicine
                </Label>
                <div className="col-span-3">
                  <Select
                    value={selectedMedicine}
                    onValueChange={setSelectedMedicine}
                  >
                    <SelectTrigger id="order-medicine">
                      <SelectValue placeholder="Select Medicine" />
                    </SelectTrigger>
                    <SelectContent>
                      {medicines.length > 0 ? (
                        medicines.map((medicine) => (
                          <SelectItem
                            key={medicine.medicine_id}
                            value={String(medicine.medicine_id)}
                          >
                            {medicine.name}{" "}
                            {medicine.quantity !== undefined &&
                              `(${medicine.quantity} in stock)`}
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

              {/* Quantity */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="order-quantity" className="text-right">
                  Quantity
                </Label>
                <div className="col-span-3">
                  <Input
                    id="order-quantity"
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                  />
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
                  onClick={() => handleOpenChange(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting || isLoadingData}>
                  {isSubmitting
                    ? "Saving..."
                    : isEditMode
                      ? "Save Changes"
                      : "Add Order"}
                </Button>
              </DialogFooter>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
