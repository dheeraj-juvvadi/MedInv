"use client";

import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge";
import { Plus, Search } from "lucide-react";
import { useEffect, useMemo, useState } from 'react';
import { AppLayout } from "@/components/app-layout";
import { exportRowsToCsv } from '@/lib/export';

// Define interface based on API response
interface DiscountInfo {
  discount_id: number;
  name: string;
  description: string | null;
  discount_percent: number;
  start_date: string;
  end_date: string;
  active: number;
  status?: 'Active' | 'Scheduled' | 'Expired' | 'Unknown';
}

const DiscountsPage = () => { // Changed to arrow function
  const [discounts, setDiscounts] = useState<DiscountInfo[] | null>(null); // State for fetched data
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredDiscounts = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return (discounts ?? []).filter((discount) => [discount.name, discount.description, discount.status].some((value) => value?.toLowerCase().includes(query)));
  }, [discounts, searchTerm]);

  const loadDiscounts = async () => {
    setError(null);
    setDiscounts(null);
    try {
      const response = await fetch('/api/discounts', { cache: 'no-store' });
      if (!response.ok) throw new Error(`Failed to fetch discount data: ${response.statusText}`);
      const data: DiscountInfo[] = await response.json();
      setDiscounts(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setDiscounts([]);
    }
  };

  useEffect(() => {
    loadDiscounts();
  }, []);

  useEffect(() => {
    async function fetchDiscountData() {
      setError(null);
      try {
        const response = await fetch('/api/discounts');
        if (!response.ok) {
          throw new Error(`Failed to fetch discount data: ${response.statusText}`);
        }
        const data: DiscountInfo[] = await response.json();
        if (Array.isArray(data)) {
          // Add placeholder data and determine status
          const processedData = data.map(item => {
            const now = new Date();
            const startDate = new Date(item.start_date);
            const endDate = new Date(item.end_date);
            let status: DiscountInfo['status'] = 'Unknown';
            
            if (!item.active) {
                status = 'Expired'; // Or Inactive
            } else if (now >= startDate && now <= endDate) {
              status = 'Active';
            } else if (now < startDate) {
              status = 'Scheduled';
            } else if (now > endDate) {
              status = 'Expired';
            }
            return {
              ...item,
              status: status,
            };
          });
          setDiscounts(processedData);
        } else {
          console.error("Received non-array data for discounts:", data);
          setDiscounts([]);
        }
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        setDiscounts([]);
      }
    }

    fetchDiscountData();
  }, []);

  const getStatusColor = (status: string) => {
    const colors = {
      Active: "bg-emerald-100 text-emerald-700 border border-emerald-200",
      Scheduled: "bg-blue-100 text-blue-700 border border-blue-200",
      Expired: "bg-gray-100 text-gray-700 border border-gray-200",
      Unknown: "bg-yellow-100 text-yellow-700 border border-yellow-200", // Style for Unknown
    };
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-700 border border-gray-200";
  };

  // Helper function to format date
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (e) {
      return 'Invalid Date';
    }
  };

  return (
    <AppLayout>
      <DashboardShell>
      <DashboardHeader heading="Discounts" text="View and manage discount programs.">
        <Button disabled title="Discount creation requires an API endpoint">
          <Plus className="mr-2 h-4 w-4" />
          Add Discount
        </Button>
      </DashboardHeader>
      <Card className="backdrop-blur-sm bg-card/50">
        <CardContent className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search discounts..." className="pl-8 bg-background" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} />
            </div>
            <Button variant="outline" onClick={() => exportRowsToCsv('medinv-discounts.csv', filteredDiscounts)} disabled={!filteredDiscounts.length}>Export</Button>
          </div>
          {error && <p className="text-red-500 mb-4">Error: {error}</p>}
          {discounts === null && <p>Loading discounts...</p>}
          {discounts !== null && discounts.length === 0 && !error && <p>No discounts found.</p>}
          {discounts !== null && discounts.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Discount ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Percentage</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>End Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDiscounts.map((discount) => (
                  <TableRow key={discount.discount_id}>
                    <TableCell className="font-medium">{discount.discount_id}</TableCell>
                    <TableCell>{discount.name}</TableCell>
                    <TableCell>{discount.description}</TableCell>
                    <TableCell>{discount.discount_percent}%</TableCell>
                    <TableCell>{formatDate(discount.start_date)}</TableCell>
                    <TableCell>{formatDate(discount.end_date)}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`text-xs px-1.5 py-0.5 ${getStatusColor(discount.status || 'Unknown')}`}>
                        {discount.status || 'Unknown'}
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

export default DiscountsPage;
