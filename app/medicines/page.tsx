"use client";

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { AppLayout } from "@/components/app-layout";
import { DashboardShell } from "@/components/dashboard-shell";
import { DashboardHeader } from "@/components/dashboard-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MedicineForm } from '@/components/medicine-form';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; // Import Alert components
import { Edit, Trash2, Search, PlusCircle, AlertCircle } from 'lucide-react';
import { useDebounce } from '@/hooks/use-debounce';
// import { useToast } from "@/components/ui/use-toast";

interface Medicine {
  medicine_id: number;
  name: string;
  price: number;
  manufacturer: string;
  expiry_date: string;
  drug_category_id: number;
}

export default function MedicinesPage() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null); // Error during initial fetch
  const [actionError, setActionError] = useState<string | null>(null); // Error during delete/add/edit actions
  const [currentMedicine, setCurrentMedicine] = useState<Medicine | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  // const { toast } = useToast();

  const fetchMedicines = useCallback(async () => {
    // Clear action error when refetching
    setActionError(null);
    // Don't reset loading if already loading
    // setIsLoading(true);
    setFetchError(null);
    try {
      const response = await fetch('/api/medicines');
      if (!response.ok) {
        throw new Error(`Failed to fetch medicines: ${response.statusText}`);
      }
      const data = await response.json();
      setMedicines(data);
    } catch (err) {
      console.error("Error fetching medicines:", err);
      setFetchError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    setIsLoading(true);
    fetchMedicines();
  }, [fetchMedicines]);

  const handleDelete = async (medicineId: number) => {
    setActionError(null); // Clear previous action errors
    try {
      const response = await fetch(`/api/medicines?medicine_id=${medicineId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorData = await response.json();
        // Set specific action error based on status
        if (response.status === 409) {
          setActionError(errorData.error || 'Cannot delete: Medicine is referenced elsewhere.');
        } else {
          setActionError(errorData.error || 'Failed to delete medicine.');
        }
        // toast({ variant: "destructive", title: "Error", description: errorData.error || 'Failed to delete medicine' });
        return;
      }
      fetchMedicines(); // Refresh list only on success
      // toast({ title: "Success", description: "Medicine deleted." });
    } catch (err) {
      console.error("Error deleting medicine:", err);
      setActionError(err instanceof Error ? err.message : 'An unexpected error occurred during deletion.');
      // toast({ variant: "destructive", title: "Error", description: "An unexpected error occurred." });
    }
  };

  const handleOpenForm = (medicine: Medicine | null = null) => {
    setActionError(null); // Clear action error when opening form
    setCurrentMedicine(medicine);
    setIsFormOpen(true);
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    setCurrentMedicine(null);
    fetchMedicines();
    // toast({ title: "Success", description: `Medicine ${currentMedicine ? 'updated' : 'added'}.` });
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid Date';
      return date.toLocaleDateString();
    } catch (e) {
      return 'Invalid Date';
    }
  };

  const filteredMedicines = useMemo(() => {
    if (!debouncedSearchTerm) return medicines;
    const lower = debouncedSearchTerm.toLowerCase();
    return medicines.filter(med =>
      med.name?.toLowerCase().includes(lower) ||
      med.manufacturer?.toLowerCase().includes(lower)
    );
  }, [medicines, debouncedSearchTerm]);

  return (
    <AppLayout>
      <DashboardShell>
        <DashboardHeader heading="Medicines" text="Manage medicine details and categories." />

        {/* Display Action Error Alert */}
        {actionError && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Action Failed</AlertTitle>
            <AlertDescription>{actionError}</AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-lg font-semibold">Medicine List</CardTitle>
             <div className="flex items-center space-x-2">
               <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search name or manufacturer..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 w-[200px] md:w-[300px]"
                  />
               </div>
               <Button size="sm" onClick={() => handleOpenForm(null)}>
                 <PlusCircle className="h-4 w-4 mr-2" />
                 Add Medicine
               </Button>
             </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <p className="text-muted-foreground">Loading medicines...</p>
              </div>
            ) : fetchError ? ( // Display fetch error here
              <div className="flex justify-center items-center h-64 text-red-600">
                <p>Error loading medicines: {fetchError}</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]">ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Manufacturer</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Expiry Date</TableHead>
                    <TableHead className="w-[120px]">Actions</TableHead>
                   </TableRow>
                 </TableHeader>
                 <TableBody className="table-row-hover">
                   {filteredMedicines.length > 0 ? (
                     filteredMedicines.map((med) => (
                      <TableRow key={med.medicine_id}>
                        <TableCell className="font-medium">{med.medicine_id}</TableCell>
                        <TableCell>{med.name}</TableCell>
                        <TableCell>{med.manufacturer}</TableCell>
                        <TableCell>
                          {med.price !== null && med.price !== undefined 
                            ? `₹${Number(med.price).toFixed(2)}` 
                            : 'N/A'}
                        </TableCell>
                        <TableCell>{formatDate(med.expiry_date)}</TableCell>
                        <TableCell className="space-x-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleOpenForm(med)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600 hover:text-red-700">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete the medicine &quot;{med.name}&quot;.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel onClick={() => setActionError(null)}>Cancel</AlertDialogCancel> {/* Clear error on cancel */}
                                <AlertDialogAction
                                  onClick={() => handleDelete(med.medicine_id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                         {debouncedSearchTerm ? 'No medicines match your search.' : 'No medicines found.'}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
        <MedicineForm
          medicine={currentMedicine}
          isOpen={isFormOpen}
          onOpenChange={setIsFormOpen}
          onSuccess={handleFormSuccess}
        />
      </DashboardShell>
    </AppLayout>
  );
}
