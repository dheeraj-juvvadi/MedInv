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
import { PatientForm } from '@/components/patient-form';
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

interface Patient {
  patient_id: number;
  name: string;
  email: string | null;
  phone_number: string | null;
}

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null); // Error during initial fetch
  const [actionError, setActionError] = useState<string | null>(null); // Error during delete/add/edit actions
  const [currentPatient, setCurrentPatient] = useState<Patient | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  // const { toast } = useToast();

  const fetchPatients = useCallback(async () => {
    setActionError(null); // Clear action error on refetch
    setFetchError(null);
    try {
      const response = await fetch('/api/patients');
      if (!response.ok) {
        throw new Error(`Failed to fetch patients: ${response.statusText}`);
      }
      const data = await response.json();
      setPatients(data);
    } catch (err) {
      console.error("Error fetching patients:", err);
      setFetchError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    setIsLoading(true);
    fetchPatients();
  }, [fetchPatients]);

  const handleDelete = async (patientId: number) => {
    setActionError(null); // Clear previous action errors
    try {
      const response = await fetch(`/api/patients?id=${patientId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorData = await response.json();
        // Set specific action error based on status
        if (response.status === 409) { // Assuming 409 for FK constraint from API
          setActionError(errorData.error || 'Cannot delete: Patient is referenced elsewhere (e.g., Orders).');
        } else {
          setActionError(errorData.error || 'Failed to delete patient.');
        }
        // toast({ variant: "destructive", title: "Error", description: errorData.error || 'Failed to delete patient' });
        return;
      }
      fetchPatients(); // Refresh list only on success
      // toast({ title: "Success", description: "Patient deleted." });
    } catch (err) {
      console.error("Error deleting patient:", err);
      setActionError(err instanceof Error ? err.message : 'An unexpected error occurred during deletion.');
      // toast({ variant: "destructive", title: "Error", description: "An unexpected error occurred." });
    }
  };

  const handleOpenForm = (patient: Patient | null = null) => {
    setActionError(null); // Clear action error when opening form
    setCurrentPatient(patient);
    setIsFormOpen(true);
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    setCurrentPatient(null);
    fetchPatients();
     // toast({ title: "Success", description: `Patient ${currentPatient ? 'updated' : 'added'}.` });
  };

  const filteredPatients = useMemo(() => {
    if (!debouncedSearchTerm) return patients;
    const lower = debouncedSearchTerm.toLowerCase();
    return patients.filter(patient =>
      patient.name?.toLowerCase().includes(lower) ||
      patient.email?.toLowerCase().includes(lower) ||
      patient.phone_number?.toLowerCase().includes(lower)
    );
  }, [patients, debouncedSearchTerm]);

  return (
    <AppLayout>
      <DashboardShell>
        <DashboardHeader heading="Patients" text="Manage patient records." />

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
            <CardTitle className="text-lg font-semibold">Patient List</CardTitle>
            <div className="flex items-center space-x-2">
               <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search name, email, or phone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 w-[200px] md:w-[300px]"
                  />
               </div>
               <Button size="sm" onClick={() => handleOpenForm(null)}>
                 <PlusCircle className="h-4 w-4 mr-2" />
                 Add Patient
               </Button>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <p className="text-muted-foreground">Loading patients...</p>
              </div>
            ) : fetchError ? ( // Display fetch error here
              <div className="flex justify-center items-center h-64 text-red-600">
                <p>Error loading patients: {fetchError}</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]">ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead className="w-[120px]">Actions</TableHead>
                   </TableRow>
                 </TableHeader>
                 <TableBody className="table-row-hover">
                   {filteredPatients.length > 0 ? (
                     filteredPatients.map((patient) => (
                      <TableRow key={patient.patient_id}>
                        <TableCell className="font-medium">{patient.patient_id}</TableCell>
                        <TableCell>{patient.name}</TableCell>
                        <TableCell>{patient.email || 'N/A'}</TableCell>
                        <TableCell>{patient.phone_number || 'N/A'}</TableCell>
                        <TableCell className="space-x-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleOpenForm(patient)}
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
                                  This action cannot be undone. This will permanently delete the patient &quot;{patient.name}&quot;.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel onClick={() => setActionError(null)}>Cancel</AlertDialogCancel> {/* Clear error on cancel */}
                                <AlertDialogAction
                                  onClick={() => handleDelete(patient.patient_id)}
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
                      <TableCell colSpan={5} className="h-24 text-center">
                        {debouncedSearchTerm ? 'No patients match your search.' : 'No patients found.'}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
         <PatientForm
           patient={currentPatient}
           isOpen={isFormOpen}
           onOpenChange={setIsFormOpen}
           onSuccess={handleFormSuccess}
         />
      </DashboardShell>
    </AppLayout>
  );
}
