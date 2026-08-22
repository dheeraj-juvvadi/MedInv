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
import { SupplierForm } from '@/components/supplier-form';
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
import { Edit, Trash2, Search, PlusCircle, AlertCircle } from 'lucide-react'; // Added AlertCircle
import { useDebounce } from '@/hooks/use-debounce';
// import { useToast } from "@/components/ui/use-toast";

interface Supplier {
  supplier_id: number;
  name: string;
  contact_info: string;
}

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null); // Error during initial fetch
  const [actionError, setActionError] = useState<string | null>(null); // Error during delete/add/edit actions
  const [currentSupplier, setCurrentSupplier] = useState<Supplier | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  // const { toast } = useToast();

  const fetchSuppliers = useCallback(async () => {
    setActionError(null); // Clear action error on refetch
    setFetchError(null);
    try {
      const response = await fetch('/api/suppliers');
      if (!response.ok) {
        throw new Error(`Failed to fetch suppliers: ${response.statusText}`);
      }
      const data = await response.json();
      setSuppliers(data);
    } catch (err) {
      console.error("Error fetching suppliers:", err);
      setFetchError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    setIsLoading(true);
    fetchSuppliers();
  }, [fetchSuppliers]);

  const handleDelete = async (supplierId: number) => {
    setActionError(null); // Clear previous action errors
    try {
      const response = await fetch(`/api/suppliers?id=${supplierId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorData = await response.json();
        // Set specific action error based on status
        if (response.status === 409) { // Assuming 409 for FK constraint from API
          setActionError(errorData.error || 'Cannot delete: Supplier is referenced elsewhere (e.g., Inventory).');
        } else {
          setActionError(errorData.error || 'Failed to delete supplier.');
        }
        // toast({ variant: "destructive", title: "Error", description: errorData.error || 'Failed to delete supplier' });
        return;
      }
      fetchSuppliers(); // Refresh list only on success
      // toast({ title: "Success", description: "Supplier deleted." });
    } catch (err) {
      console.error("Error deleting supplier:", err);
      setActionError(err instanceof Error ? err.message : 'An unexpected error occurred during deletion.');
      // toast({ variant: "destructive", title: "Error", description: "An unexpected error occurred." });
    }
  };

  const handleOpenForm = (supplier: Supplier | null = null) => {
    setActionError(null); // Clear action error when opening form
    setCurrentSupplier(supplier);
    setIsFormOpen(true);
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    setCurrentSupplier(null);
    fetchSuppliers();
    // toast({ title: "Success", description: `Supplier ${currentSupplier ? 'updated' : 'added'}.` });
  };

  const filteredSuppliers = useMemo(() => {
    if (!debouncedSearchTerm) return suppliers;
    const lower = debouncedSearchTerm.toLowerCase();
    return suppliers.filter(sup =>
      sup.name?.toLowerCase().includes(lower) ||
      sup.contact_info?.toLowerCase().includes(lower)
    );
  }, [suppliers, debouncedSearchTerm]);

  return (
    <AppLayout>
      <DashboardShell>
        <DashboardHeader heading="Suppliers" text="Manage supplier information." />

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
             <CardTitle className="text-lg font-semibold">Supplier List</CardTitle>
             <div className="flex items-center space-x-2">
                <div className="relative">
                   <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                   <Input
                     type="search"
                     placeholder="Search name or contact..."
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                     className="pl-8 w-[200px] md:w-[300px]"
                   />
                </div>
                <Button size="sm" onClick={() => handleOpenForm(null)}>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Supplier
                </Button>
             </div>
           </CardHeader>
           <CardContent>
             {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <p className="text-muted-foreground">Loading suppliers...</p>
              </div>
            ) : fetchError ? ( // Display fetch error here
              <div className="flex justify-center items-center h-64 text-red-600">
                <p>Error loading suppliers: {fetchError}</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]">ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Contact Info</TableHead>
                    <TableHead className="w-[120px]">Actions</TableHead>
                   </TableRow>
                 </TableHeader>
                 <TableBody className="table-row-hover">
                   {filteredSuppliers.length > 0 ? (
                     filteredSuppliers.map((sup) => (
                      <TableRow key={sup.supplier_id}>
                        <TableCell className="font-medium">{sup.supplier_id}</TableCell>
                        <TableCell>{sup.name}</TableCell>
                        <TableCell>{sup.contact_info}</TableCell>
                        <TableCell className="space-x-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleOpenForm(sup)}
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
                                  This action cannot be undone. This will permanently delete the supplier &quot;{sup.name}&quot;.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel onClick={() => setActionError(null)}>Cancel</AlertDialogCancel> {/* Clear error on cancel */}
                                <AlertDialogAction
                                  onClick={() => handleDelete(sup.supplier_id)}
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
                      <TableCell colSpan={4} className="h-24 text-center">
                        {debouncedSearchTerm ? 'No suppliers match your search.' : 'No suppliers found.'}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
         <SupplierForm
           supplier={currentSupplier}
           isOpen={isFormOpen}
           onOpenChange={setIsFormOpen}
           onSuccess={handleFormSuccess}
         />
       </DashboardShell>
     </AppLayout>
   );
 }
