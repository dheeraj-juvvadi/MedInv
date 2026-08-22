"use client"; // Add this directive

import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge";
import { Plus, Search } from "lucide-react";
import { useEffect, useMemo, useState } from 'react';
import { AppLayout } from "@/components/app-layout"; // Import AppLayout
import { exportRowsToCsv } from '@/lib/export';

// Define interface based on API response
interface EmployeeInfo {
  employee_id: number;
  name: string;
  role: string;
  email: string;
  phone_number: string | null;
  hire_date: string | null;
  // Placeholder for status
  status?: 'Active' | 'On Leave' | 'Terminated' | 'Unknown';
}

const EmployeesPage = () => { // Changed to arrow function
  const [employees, setEmployees] = useState<EmployeeInfo[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredEmployees = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return (employees ?? []).filter((employee) =>
      [employee.name, employee.role, employee.email, employee.phone_number]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query)),
    );
  }, [employees, searchTerm]);

  const loadEmployees = async () => {
    setError(null);
    setEmployees(null);
    try {
      const response = await fetch('/api/employees', { cache: 'no-store' });
      if (!response.ok) throw new Error(`Failed to fetch employee data: ${response.statusText}`);
      const data: EmployeeInfo[] = await response.json();
      setEmployees(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setEmployees([]);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  // Function to determine badge color based on status (can be expanded)
  const getStatusColor = (status: string) => {
    const colors = {
      Active: "bg-emerald-100 text-emerald-700 border border-emerald-200",
      'On Leave': "bg-yellow-100 text-yellow-700 border border-yellow-200",
      Terminated: "bg-red-100 text-red-700 border border-red-200",
      Unknown: "bg-gray-100 text-gray-700 border border-gray-200",
    };
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-700 border border-gray-200";
  };

  // Wrap the content with AppLayout
  return (
    <AppLayout>
      <DashboardShell>
        <DashboardHeader heading="Employees" text="View and manage employee records.">
          <Button disabled title="Employee creation requires an API endpoint">
            <Plus className="mr-2 h-4 w-4" />
            Add Employee
          </Button>
          <Button variant="outline" onClick={loadEmployees}>Refresh</Button>
        </DashboardHeader>
        <Card className="backdrop-blur-sm bg-card/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input type="search" placeholder="Search employees..." className="pl-8 bg-background" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} />
              </div>
              <Button variant="outline" onClick={() => exportRowsToCsv('medinv-employees.csv', filteredEmployees)} disabled={!filteredEmployees.length}>Export</Button>
            </div>
            {error && <p className="text-red-500 mb-4">Error: {error}</p>}
            {employees === null && <p>Loading employees...</p>}
            {employees !== null && !error && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Employee ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Hire Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(filteredEmployees.length ? filteredEmployees : []).map((employee) => (
                    <TableRow key={employee.employee_id}>
                      <TableCell className="font-medium">{employee.employee_id}</TableCell>
                      <TableCell>{employee.name}</TableCell>
                      <TableCell>{employee.role}</TableCell>
                      <TableCell>{employee.email}</TableCell>
                      <TableCell>{employee.phone_number || 'N/A'}</TableCell>
                      <TableCell>{employee.hire_date ? new Date(employee.hire_date).toLocaleDateString() : 'N/A'}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`text-xs px-1.5 py-0.5 ${getStatusColor(employee.status || 'Unknown')}`}
                        >
                          {employee.status || 'Unknown'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                {!filteredEmployees.length && (
                  <TableRow><TableCell colSpan={7} className="py-8 text-center text-muted-foreground">No matching employees.</TableCell></TableRow>
                )}
              </Table>
            )}
          </CardContent>
        </Card>
      </DashboardShell>
    </AppLayout>
  )
}

export default EmployeesPage; // Add default export
