'use client'; // Add the "use client" directive

import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Search } from "lucide-react";
import { useEffect, useMemo, useState } from 'react';
import { AppLayout } from "@/components/app-layout"; // Import AppLayout component
import { exportRowsToCsv } from '@/lib/export';

// Define interface matching the API response structure
interface BillingInfo {
  billing_id: number;
  patient_id: number;
  patient_name: string;
  date: string;
  amount: number;
  discount_amount: number;
  total: number;
  status: string;
}

const BillingPage = () => {
  const [billings, setBillings] = useState<BillingInfo[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredBillings = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return (billings ?? []).filter((billing) => [billing.patient_name, billing.status].some((value) => value?.toLowerCase().includes(query)));
  }, [billings, searchTerm]);

  const loadBillings = async () => {
    setError(null);
    setBillings(null);
    try {
      const response = await fetch('/api/billing', { cache: 'no-store' });
      if (!response.ok) throw new Error(`Failed to fetch billing data: ${response.statusText}`);
      const data: BillingInfo[] = await response.json();
      setBillings(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setBillings([]);
    }
  };

  useEffect(() => {
    loadBillings();
  }, []);

  useEffect(() => {
    async function fetchBillingData() {
      setError(null);
      try {
        const response = await fetch('/api/billing');
        if (!response.ok) {
          throw new Error(`Failed to fetch billing data: ${response.statusText}`);
        }
        const data: BillingInfo[] = await response.json();
        if (Array.isArray(data)) {
          setBillings(data);
        } else {
          console.error("Received non-array data for billing:", data);
          setBillings([]);
        }
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        setBillings([]);
      }
    }

    fetchBillingData();
  }, []);


  const getStatusColor = (status: string) => {
    const colors = {
      Paid: "bg-emerald-100 text-emerald-700 border border-emerald-200",
      Pending: "bg-amber-100 text-amber-700 border border-amber-200",
      Overdue: "bg-red-100 text-red-700 border border-red-200",
      Unknown: "bg-gray-100 text-gray-700 border border-gray-200",
    };
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-700 border border-gray-200";
  };

  // Format currency for display
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <AppLayout>
      <DashboardShell>
        <DashboardHeader heading="Billing" text="View and manage patient billing records.">
          <Button disabled title="Invoice creation requires an API endpoint">
            <Plus className="mr-2 h-4 w-4" />
            New Invoice
          </Button>
        </DashboardHeader>
        <Card className="backdrop-blur-sm bg-card/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input type="search" placeholder="Search billing records..." className="pl-8 bg-background" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} />
              </div>
              <Button variant="outline" onClick={() => exportRowsToCsv('medinv-billing.csv', filteredBillings)} disabled={!filteredBillings.length}>Export</Button>
            </div>
            {error && <p className="text-red-500 mb-4">Error: {error}</p>}
            {billings === null && <p>Loading billing records...</p>}
            {billings !== null && billings.length === 0 && !error && <p>No billing records found.</p>}
            {billings !== null && billings.length > 0 && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Billing ID</TableHead>
                    <TableHead>Patient Name</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Discount</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBillings.map((billing) => (
                    <TableRow key={billing.billing_id}>
                      <TableCell className="font-medium">{billing.billing_id}</TableCell>
                      <TableCell>{billing.patient_name}</TableCell>
                      <TableCell>{billing.date}</TableCell>
                      <TableCell>{formatCurrency(billing.amount)}</TableCell>
                      <TableCell>{formatCurrency(billing.discount_amount)}</TableCell>
                      <TableCell>{formatCurrency(billing.total)}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`text-xs px-1.5 py-0.5 ${getStatusColor(billing.status || 'Unknown')}`}>
                          {billing.status || 'Unknown'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </DashboardShell>
    </AppLayout>
  )
}

export default BillingPage; // Add default export
