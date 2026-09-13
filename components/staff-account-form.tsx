"use client";

import React, { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
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
interface Employee {
  employee_id: number;
  name: string;
  position: string;
}

interface StaffAccountInfo {
  username: string;
  employee_id: number | null;
  employee_name: string | null;
  role: string | null;
}

interface StaffAccountFormInputs {
  username: string;
  password?: string;
  confirmPassword?: string;
  employee_id: string;
  role: string;
}

interface StaffAccountFormProps {
  account?: StaffAccountInfo | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function StaffAccountForm({
  account,
  isOpen,
  onOpenChange,
  onSuccess,
}: StaffAccountFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<StaffAccountFormInputs>();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const { toast } = useToast();

  const isEditMode = Boolean(account?.username);
  const passwordValue = watch("password");

  // Fetch employees for dropdown when dialog opens
  useEffect(() => {
    async function fetchEmployees() {
      if (!isOpen) return;

      setIsLoadingData(true);
      setApiError(null);
      try {
        const response = await fetch("/api/employees", {
          headers: { "Cache-Control": "no-cache" },
        });
        if (!response.ok) throw new Error("Failed to fetch employees");
        const data = await response.json();
        setEmployees(data);
      } catch (err) {
        console.error("Error fetching employees:", err);
        setApiError("Could not load employee list.");
        setEmployees([]);
      } finally {
        setIsLoadingData(false);
      }
    }

    if (isOpen) {
      fetchEmployees();
    }
  }, [isOpen]);

  // Pre-fill form in Edit mode or reset in Add mode
  useEffect(() => {
    if (isOpen) {
      if (isEditMode && account) {
        setValue("username", account.username || "");
        setValue(
          "employee_id",
          account.employee_id ? String(account.employee_id) : "",
        );
        setValue("role", account.role || "staff");
        setValue("password", "");
        setValue("confirmPassword", "");
      } else {
        reset({
          username: "",
          password: "",
          confirmPassword: "",
          employee_id: "",
          role: "staff",
        });
      }
      setApiError(null);
    }
  }, [account, isEditMode, isOpen, setValue, reset]);

  const onSubmit: SubmitHandler<StaffAccountFormInputs> = async (data) => {
    setApiError(null);

    // Client-side validation
    if (!isEditMode && (!data.password || data.password.length < 6)) {
      setApiError(
        "Password is required and must be at least 6 characters long.",
      );
      return;
    }

    if (!isEditMode && data.password !== data.confirmPassword) {
      setApiError("Passwords do not match.");
      return;
    }

    if (!data.employee_id) {
      setApiError("An employee must be selected.");
      return;
    }

    const payload: any = {
      employee_id: parseInt(data.employee_id),
    };

    let url = "";
    let method = "";

    if (isEditMode && account) {
      url = `/api/staff-accounts?username=${account.username}`;
      method = "PUT";
    } else {
      url = "/api/staff-accounts";
      method = "POST";
      payload.username = data.username;
      payload.password = data.password;
    }

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error ||
            `Failed to ${isEditMode ? "update" : "create"} account`,
        );
      }

      toast({
        title: "Success",
        description: `Staff account ${isEditMode ? "updated" : "created"} successfully.`,
      });
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : `Failed to ${isEditMode ? "update" : "create"} account`;
      setApiError(message);
      console.error(
        `Error ${isEditMode ? "updating" : "creating"} staff account:`,
        error,
      );
      toast({ title: "Error", description: message, variant: "destructive" });
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      reset();
      setApiError(null);
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
              {isEditMode
                ? `Edit Staff Account: ${account?.username}`
                : "Add New Staff Account"}
            </DialogTitle>
            <DialogDescription>
              {isEditMode
                ? "Update the linked employee."
                : "Create a new user account and link it to an employee."}
            </DialogDescription>
          </DialogHeader>

          {isLoadingData ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Username (Readonly in Edit mode) */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="acc-username" className="text-right">
                  Username
                </Label>
                <div className="col-span-3">
                  <Input
                    id="acc-username"
                    {...register("username", {
                      required: "Username is required",
                    })}
                    placeholder="e.g., jdoe"
                    readOnly={isEditMode}
                  />
                  {errors.username && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.username.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Password fields (Only for Add mode) */}
              {!isEditMode && (
                <>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="acc-password" className="text-right">
                      Password
                    </Label>
                    <div className="col-span-3">
                      <Input
                        id="acc-password"
                        type="password"
                        {...register("password", {
                          required: "Password is required",
                          minLength: {
                            value: 6,
                            message: "Password must be at least 6 characters",
                          },
                        })}
                      />
                      {errors.password && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.password.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="acc-confirmPassword" className="text-right">
                      Confirm Pwd
                    </Label>
                    <div className="col-span-3">
                      <Input
                        id="acc-confirmPassword"
                        type="password"
                        {...register("confirmPassword", {
                          required: "Please confirm password",
                          validate: (value) =>
                            value === passwordValue || "Passwords do not match",
                        })}
                      />
                      {errors.confirmPassword && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.confirmPassword.message}
                        </p>
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* Employee Select */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="acc-employee" className="text-right">
                  Employee
                </Label>
                <div className="col-span-3">
                  <Select
                    value={watch("employee_id")}
                    onValueChange={(value) => setValue("employee_id", value)}
                  >
                    <SelectTrigger id="acc-employee">
                      <SelectValue placeholder="Select Employee" />
                    </SelectTrigger>
                    <SelectContent className="z-[1001]">
                      {employees && employees.length > 0 ? (
                        employees.map((emp) => (
                          <SelectItem
                            key={emp.employee_id}
                            value={String(emp.employee_id)}
                          >
                            {emp.name} ({emp.position})
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="unavailable" disabled>
                          No employees found
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* API Error */}
              {apiError && (
                <div className="p-3 rounded bg-destructive/10 text-destructive flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm">{apiError}</span>
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
                  {isSubmitting ? (
                    <>
                      <span className="mr-2">Saving...</span>
                      <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
                    </>
                  ) : isEditMode ? (
                    "Save Changes"
                  ) : (
                    "Create Account"
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
