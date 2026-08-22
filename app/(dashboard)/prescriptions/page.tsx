"use client"; // Add this directive at the top

import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"; // Added missing imports
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Search } from "lucide-react";
import { useEffect, useState } from 'react';
import { exportRowsToCsv } from '@/lib/export';

// Define interface based on API response
interface PrescriptionInfo {
  prescription_id: number;
  patient_id: number;
  patient_name: string;
  document_id: string | null;
  medicine_count: number;
  // Placeholder fields
  doctor?: string;
  date?: string;
  status?: 'Filled' | 'Pending' | 'Unknown';
}

const PrescriptionsPage = () => { 
  const [allPrescriptions, setAllPrescriptions] = useState<PrescriptionInfo[] | null>(null); // Rename state for all data
  const [filteredPrescriptions, setFilteredPrescriptions] = useState<PrescriptionInfo[] | null>(null); // State for displayed data
  const [filterTerm, setFilterTerm] = useState<string>(''); // State for search input
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPrescriptionData() {
      setError(null);
      try {
        const response = await fetch('/api/prescriptions');
        if (!response.ok) {
          throw new Error(`Failed to fetch prescription data: ${response.statusText}`);
        }
        const data: PrescriptionInfo[] = await response.json();
        if (Array.isArray(data)) {
          const processedData = data.map(item => ({
            ...item,
            doctor: 'N/A', 
            date: 'N/A', 
            status: 'Unknown' as const 
          }));
          setAllPrescriptions(processedData); // Set all data
          setFilteredPrescriptions(processedData); // Initially display all
        } else {
          console.error("Received non-array data for prescriptions:", data);
          setAllPrescriptions([]);
          setFilteredPrescriptions([]);
        }
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        setAllPrescriptions([]);
        setFilteredPrescriptions([]);
      }
    }

    fetchPrescriptionData();
  }, []);

  // Effect to filter prescriptions based on filterTerm
  useEffect(() => {
    if (allPrescriptions === null) return;
    const lowerCaseFilterTerm = filterTerm.toLowerCase();
    const filtered = allPrescriptions.filter(p => 
      p.patient_name.toLowerCase().includes(lowerCaseFilterTerm) ||
      p.prescription_id.toString().includes(lowerCaseFilterTerm) ||
      (p.document_id && p.document_id.toLowerCase().includes(lowerCaseFilterTerm)) ||
      (p.doctor && p.doctor.toLowerCase().includes(lowerCaseFilterTerm)) 
      // Add more fields to search if needed
    );
    setFilteredPrescriptions(filtered);
  }, [filterTerm, allPrescriptions]);

  // Function to determine badge color based on status
  const getStatusColor = (status: string) => {
    const colors = {
      Filled: "bg-emerald-100 text-emerald-700 border border-emerald-200",
      Pending: "bg-amber-100 text-amber-700 border border-amber-200",
      Unknown: "bg-gray-100 text-gray-700 border border-gray-200",
    };
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-700 border border-gray-200";
  };

  return (
    <DashboardShell>
      <DashboardHeader heading="Prescriptions" text="View and manage patient prescriptions.">
        {/* Add Button needs functionality */}
        {/* <Button> 
          <Plus className="mr-2 h-4 w-4" />
          New Prescription
        </Button> */}
      </DashboardHeader>
      <Card> {/* Removed backdrop/bg styles for simplicity during debug */}
        <CardHeader> {/* Added CardHeader */}
           <CardTitle>Prescription List</CardTitle>
           <CardDescription>List of all recorded prescriptions.</CardDescription>
        </CardHeader>
        <CardContent> {/* Removed p-6, CardContent adds padding */}
          <div className="flex items-center gap-4 mb-4"> {/* Reduced margin */}
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                type="search" 
                placeholder="Search by Patient, ID, Doc ID..." 
                className="pl-8 bg-background" 
                value={filterTerm} 
                onChange={(e) => setFilterTerm(e.target.value)} // Update filterTerm state
              />
            </div>
            <Button variant="outline" onClick={() => exportRowsToCsv('medinv-prescriptions.csv', filteredPrescriptions ?? [])} disabled={!filteredPrescriptions?.length}>Export</Button>
          </div>
          {error && <p className="text-red-500 mb-4">Error: {error}</p>}
          {/* Update loading/empty states to use filteredPrescriptions */}
          {filteredPrescriptions === null && <p>Loading prescriptions...</p>} 
          {filteredPrescriptions !== null && filteredPrescriptions.length === 0 && !error && (
            filterTerm ? <p>No prescriptions found matching &quot;{filterTerm}&quot;.</p> : <p>No prescriptions found.</p>
          )}
          {filteredPrescriptions !== null && filteredPrescriptions.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Presc. ID</TableHead><TableHead>Patient Name</TableHead><TableHead>Doctor</TableHead><TableHead>Date</TableHead><TableHead># Medicines</TableHead><TableHead>Status</TableHead><TableHead>Document ID</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* Map over filteredPrescriptions */}
                {filteredPrescriptions.map((prescription) => ( 
                  <TableRow key={prescription.prescription_id}><TableCell className="font-medium">{prescription.prescription_id}</TableCell><TableCell>{prescription.patient_name}</TableCell><TableCell>{prescription.doctor}</TableCell><TableCell>{prescription.date}</TableCell><TableCell>{prescription.medicine_count}</TableCell><TableCell><Badge variant="outline" className={`text-xs px-1.5 py-0.5 ${getStatusColor(prescription.status || 'Unknown')}`}>{prescription.status || 'Unknown'}</Badge></TableCell><TableCell>{prescription.document_id || 'N/A'}</TableCell></TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </DashboardShell>
  );
};

export default PrescriptionsPage;
