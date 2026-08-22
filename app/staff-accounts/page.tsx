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
import { StaffAccountForm } from '@/components/staff-account-form';
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

interface StaffAccountInfo {
  username: string;
  employee_id: number | null;
  employee_name: string | null;
  role: string | null;
}

export default function StaffAccountsPage() {
  const [accounts, setAccounts] = useState<StaffAccountInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null); // Error during initial fetch
  const [actionError, setActionError] = useState<string | null>(null); // Error during delete/add/edit actions
  const [currentAccount, setCurrentAccount] = useState<StaffAccountInfo | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  // const { toast } = useToast();

  const fetchAccounts = useCallback(async () => {
    setActionError(null); // Clear action error on refetch
    setFetchError(null);
    try {
      const response = await fetch('/api/staff-accounts');
      if (!response.ok) {
        throw new Error(`Failed to fetch staff accounts: ${response.statusText}`);
      }
      const data = await response.json();
      setAccounts(data);
    } catch (err) {
      console.error("Error fetching staff accounts:", err);
      setFetchError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    setIsLoading(true);
    fetchAccounts();
  }, [fetchAccounts]);

  const handleDelete = async (username: string) => {
    setActionError(null); // Clear previous action errors
    try {
      const response = await fetch(`/api/staff-accounts?username=${username}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorData = await response.json();
        // Set specific action error based on status (assuming 403 for protected accounts, 409 for FK)
        if (response.status === 409 || response.status === 403) {
          setActionError(errorData.error || 'Cannot delete this account.');
        } else {
          setActionError(errorData.error || 'Failed to delete account.');
        }
        // toast({ variant: "destructive", title: "Error", description: errorData.error || 'Failed to delete account' });
        return;
      }
      fetchAccounts(); // Refresh list only on success
      // toast({ title: "Success", description: "Account deleted." });
    } catch (err) {
      console.error("Error deleting account:", err);
      setActionError(err instanceof Error ? err.message : 'An unexpected error occurred during deletion.');
      // toast({ variant: "destructive", title: "Error", description: "An unexpected error occurred." });
    }
  };

  const handleOpenForm = (account: StaffAccountInfo | null = null) => {
    setActionError(null); // Clear action error when opening form
    setCurrentAccount(account);
    setIsFormOpen(true);
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    setCurrentAccount(null);
    fetchAccounts();
     // toast({ title: "Success", description: `Account ${currentAccount ? 'updated' : 'created'}.` });
  };

  const filteredAccounts = useMemo(() => {
    if (!debouncedSearchTerm) return accounts;
    const lower = debouncedSearchTerm.toLowerCase();
    return accounts.filter(acc =>
      acc.username?.toLowerCase().includes(lower) ||
      acc.employee_name?.toLowerCase().includes(lower) ||
      acc.role?.toLowerCase().includes(lower)
    );
  }, [accounts, debouncedSearchTerm]);

  return (
    <AppLayout>
      <DashboardShell>
        <DashboardHeader heading="Staff Accounts" text="Manage user accounts and permissions." />

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
            <CardTitle className="text-lg font-semibold">Account List</CardTitle>
            <div className="flex items-center space-x-2">
               <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search username, name, or role..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 w-[200px] md:w-[300px]"
                  />
               </div>
               <Button size="sm" onClick={() => handleOpenForm(null)}>
                 <PlusCircle className="h-4 w-4 mr-2" />
                 Add Account
               </Button>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <p className="text-muted-foreground">Loading accounts...</p>
              </div>
            ) : fetchError ? ( // Display fetch error here
              <div className="flex justify-center items-center h-64 text-red-600">
                <p>Error loading accounts: {fetchError}</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Username</TableHead>
                    <TableHead>Employee Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead className="w-[120px]">Actions</TableHead>
                   </TableRow>
                 </TableHeader>
                 <TableBody className="table-row-hover">
                   {filteredAccounts.length > 0 ? (
                     filteredAccounts.map((acc) => (
                      <TableRow key={acc.username || `row-${Math.random()}`}>
                        <TableCell className="font-medium">{acc.username || 'N/A'}</TableCell>
                        <TableCell>{acc.employee_name || 'N/A'}</TableCell>
                        <TableCell>{acc.role || 'N/A'}</TableCell>
                        <TableCell className="space-x-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleOpenForm(acc)}
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
                                  This action cannot be undone. This will permanently delete the account &quot;{acc.username || 'Unknown User'}&quot;.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel onClick={() => setActionError(null)}>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(acc.username)}
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
                        {debouncedSearchTerm ? 'No accounts match your search.' : 'No staff accounts found.'}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
         <StaffAccountForm
           account={currentAccount}
           isOpen={isFormOpen}
           onOpenChange={setIsFormOpen}
           onSuccess={handleFormSuccess}
         />
      </DashboardShell>
    </AppLayout>
  );
}
