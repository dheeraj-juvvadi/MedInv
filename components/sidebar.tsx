"use client";

import Link from "next/link";
import {
  LayoutGrid,
  Package,
  Pill,
  ShoppingBag,
  Users,
  FileText,
  Truck,
  BarChart3,
  Receipt,
  Percent,
  Bell,
  MessageSquare,
  Activity,
  Database,
  Layers,
  UserCog,
  BriefcaseMedical,
  Settings,
} from "lucide-react";

export const navigation = [
  { label: "Overview", path: "/", icon: LayoutGrid, group: "Workspace" },
  { label: "Inventory", path: "/inventory", icon: Package, group: "Workspace" },
  { label: "Medicines", path: "/medicines", icon: Pill, group: "Workspace" },
  { label: "Orders", path: "/orders", icon: ShoppingBag, group: "Workspace" },
  { label: "Patients", path: "/patients", icon: Users, group: "Workspace" },
  {
    label: "Prescriptions",
    path: "/prescriptions",
    icon: FileText,
    group: "Workspace",
  },
  {
    label: "Expiry alerts",
    path: "/expiry-alerts",
    icon: Bell,
    group: "Workspace",
  },
  { label: "Suppliers", path: "/suppliers", icon: Truck, group: "Management" },
  {
    label: "Analytics",
    path: "/analytics",
    icon: BarChart3,
    group: "Management",
  },
  { label: "Billing", path: "/billing", icon: Receipt, group: "Management" },
  {
    label: "Drug categories",
    path: "/drug-categories",
    icon: Layers,
    group: "Management",
  },
  {
    label: "Medical logs",
    path: "/medical-logs",
    icon: BriefcaseMedical,
    group: "Management",
  },
  {
    label: "Activity logs",
    path: "/activity-logs",
    icon: Activity,
    group: "Management",
  },
  {
    label: "Staff accounts",
    path: "/staff-accounts",
    icon: UserCog,
    group: "Administration",
  },
  {
    label: "Employees",
    path: "/employees",
    icon: Users,
    group: "Administration",
  },
  {
    label: "Discounts",
    path: "/discounts",
    icon: Percent,
    group: "Administration",
  },
  {
    label: "Feedback",
    path: "/feedback",
    icon: MessageSquare,
    group: "Administration",
  },
  {
    label: "Database explorer",
    path: "/database-explorer",
    icon: Database,
    group: "Administration",
  },
  {
    label: "App hub",
    path: "/app-hub",
    icon: LayoutGrid,
    group: "Administration",
  },
  {
    label: "Settings",
    path: "/settings",
    icon: Settings,
    group: "Administration",
  },
];

export function Brand() {
  return (
    <Link href="/" className="brand" aria-label="MedInv home">
      <span className="brand-mark">
        <span />
      </span>
      <span>MedInv</span>
    </Link>
  );
}
