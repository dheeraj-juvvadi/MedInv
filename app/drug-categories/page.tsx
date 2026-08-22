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
import { PlusCircle, Edit, Trash2, Search, AlertCircle } from 'lucide-react'; // Added AlertCircle
import { DrugCategoryForm } from '@/components/drug-category-form';
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
import { useDebounce } from '@/hooks/use-debounce';
// import { useToast } from "@/components/ui/use-toast";

interface DrugCategory {
  drug_category_id: number;
  drug_category_name: string;
  common_uses: string | null;
}

export default function DrugCategoriesPage() {
  const [categories, setCategories] = useState<DrugCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null); // Error during initial fetch
  const [actionError, setActionError] = useState<string | null>(null); // Error during delete/add/edit actions
  const [currentCategory, setCurrentCategory] = useState<DrugCategory | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  // const { toast } = useToast();

  const fetchCategories = useCallback(async () => {
    setActionError(null); // Clear action error on refetch
    setFetchError(null);
    try {
      const response = await fetch('/api/drug-categories');
      if (!response.ok) {
        throw new Error(`Failed to fetch drug categories: ${response.statusText}`);
      }
      const data = await response.json();
      setCategories(data);
    } catch (err) {
      console.error("Error fetching drug categories:", err);
      setFetchError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    setIsLoading(true);
    fetchCategories();
  }, [fetchCategories]);

  const handleDelete = async (categoryId: number) => {
    setActionError(null); // Clear previous action errors
    try {
      const response = await fetch(`/api/drug-categories?id=${categoryId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorData = await response.json();
        // Set specific action error based on status
        if (response.status === 409) { // Assuming 409 for FK constraint from API
          setActionError(errorData.error || 'Cannot delete: Category is assigned to medicines.');
        } else {
          setActionError(errorData.error || 'Failed to delete category.');
        }
        // toast({ variant: "destructive", title: "Error", description: errorData.error || 'Failed to delete category' });
        return;
      }
      fetchCategories(); // Refresh list only on success
      // toast({ title: "Success", description: "Category deleted." });
    } catch (err) {
      console.error("Error deleting category:", err);
      setActionError(err instanceof Error ? err.message : 'An unexpected error occurred during deletion.');
      // toast({ variant: "destructive", title: "Error", description: "An unexpected error occurred." });
    }
  };

  const handleOpenForm = (category: DrugCategory | null = null) => {
    setActionError(null); // Clear action error when opening form
    setCurrentCategory(category);
    setIsFormOpen(true);
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    setCurrentCategory(null);
    fetchCategories();
     // toast({ title: "Success", description: `Category ${currentCategory ? 'updated' : 'added'}.` });
  };

  const filteredCategories = useMemo(() => {
    if (!debouncedSearchTerm) return categories;
    const lower = debouncedSearchTerm.toLowerCase();
    return categories.filter(cat =>
      cat.drug_category_name?.toLowerCase().includes(lower) ||
      cat.common_uses?.toLowerCase().includes(lower)
    );
  }, [categories, debouncedSearchTerm]);

  return (
    <AppLayout>
      <DashboardShell>
        <DashboardHeader heading="Drug Categories" text="Manage medicine categories." />

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
            <CardTitle className="text-lg font-semibold">Category List</CardTitle>
            <div className="flex items-center space-x-2">
               <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search name or uses..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 w-[200px] md:w-[300px]"
                  />
               </div>
               <Button size="sm" onClick={() => handleOpenForm(null)}>
                 <PlusCircle className="h-4 w-4 mr-2" />
                 Add Category
               </Button>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <p className="text-muted-foreground">Loading categories...</p>
              </div>
            ) : fetchError ? ( // Display fetch error here
              <div className="flex justify-center items-center h-64 text-red-600">
                <p>Error loading categories: {fetchError}</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]">ID</TableHead>
                    <TableHead>Category Name</TableHead>
                    <TableHead>Common Uses</TableHead>
                    <TableHead className="w-[120px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCategories.length > 0 ? (
                    filteredCategories.map((cat) => (
                      <TableRow key={cat.drug_category_id}>
                        <TableCell className="font-medium">{cat.drug_category_id}</TableCell>
                        <TableCell>{cat.drug_category_name}</TableCell>
                        <TableCell>{cat.common_uses || 'N/A'}</TableCell>
                        <TableCell className="space-x-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleOpenForm(cat)}
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
                                  This action cannot be undone. This will permanently delete the category &quot;{cat.drug_category_name}&quot;. Deleting a category might fail if it&apos;s currently assigned to medicines.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel onClick={() => setActionError(null)}>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(cat.drug_category_id)}
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
                        {debouncedSearchTerm ? 'No categories match your search.' : 'No drug categories found.'}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
         <DrugCategoryForm
           category={currentCategory}
           isOpen={isFormOpen}
           onOpenChange={setIsFormOpen}
           onSuccess={handleFormSuccess}
         />
      </DashboardShell>
    </AppLayout>
  );
}
