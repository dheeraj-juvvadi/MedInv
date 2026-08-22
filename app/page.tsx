"use client";

import { useCallback, useEffect, useState } from "react";
import { AppLayout } from "@/components/app-layout";
import { DashboardHeader } from "@/components/dashboard-header";
import { DashboardShell } from "@/components/dashboard-shell";
import { RecentActivity } from "@/components/recent-activity";
import { OrdersOverview } from "@/components/orders-overview";
import DataVisualization from "@/components/data-visualization";
import { InventorySummary } from "@/components/inventory-summary";
import { InventoryDistribution } from "@/components/inventory-distribution-v3";
import { AppHub } from "@/components/app-hub";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowUpRight,
  CalendarDays,
  Download,
  FileBarChart,
  RefreshCcw,
  Clock,
  Search,
  TrendingUp,
  AlertTriangle,
  ShoppingCart,
  UserPlus,
  Truck,
  Package,
  PlusCircle,
  Users,
  MonitorSmartphone,
  ArrowRight,
  FilePlus2,
  FileEdit,
  FileBarChart2,
  Activity,
  Database,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { MedicineForm } from "@/components/medicine-form";
import { SupplierForm } from "@/components/supplier-form";
import { InventoryForm } from "@/components/inventory-form";
import { exportRowsToCsv } from "@/lib/export";

// Interface for the fetched key stats
interface KeyStat {
  value: number;
  change: number;
  changeType: "positive" | "negative" | "neutral";
  changeDisplay: string;
}

interface DashboardKeyStats {
  totalInventory: KeyStat;
  expiringSoon: KeyStat;
  pendingOrders: KeyStat;
  activeSuppliers: KeyStat;
}

// Map API stat keys to display properties
const statConfig = {
  totalInventory: {
    title: "Total Inventory",
    icon: Package,
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
    iconBg: "bg-blue-500/10",
    path: "/inventory",
  },
  expiringSoon: {
    title: "Expiring Soon",
    icon: Clock,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
    iconBg: "bg-amber-500/10",
    path: "/expiry-alerts",
  },
  pendingOrders: {
    title: "Pending Orders",
    icon: ShoppingCart,
    color: "text-rose-500",
    bgColor: "bg-rose-500/10",
    iconBg: "bg-rose-500/10",
    path: "/orders?status=pending",
  },
  activeSuppliers: {
    title: "Active Suppliers",
    icon: Truck,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
    iconBg: "bg-green-500/10",
    path: "/suppliers?status=active",
  },
};

export default function DashboardPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [expiryProgress, setExpiryProgress] = useState(0);
  const [dashboardView, setDashboardView] = useState<"standard" | "appHub">(
    "standard"
  );

  // State for individual forms
  const [showMedicineForm, setShowMedicineForm] = useState(false);
  const [showSupplierForm, setShowSupplierForm] = useState(false);
  const [showInventoryForm, setShowInventoryForm] = useState(false);

  // State for fetched key stats
  const [dashboardStats, setDashboardStats] = useState<DashboardKeyStats | null>(
    null
  );
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState<string | null>(null);

  // Order stats for the bottom section
  const orderStats = [
    {
      title: "Total Orders",
      value: "4",
      change: "+4.75%",
      changeType: "positive",
    },
    {
      title: "Average Value",
      value: "₹301",
      change: "+1.51%",
      changeType: "positive",
    },
    {
      title: "Pending",
      value: "4",
      change: "-2.23%",
      changeType: "negative",
    },
  ];

  // Inventory summary data for visualization
  const inventorySummaryData = [
    { category: "Antibiotics", count: 1200, percentage: 24, color: "#3498db" },
    { category: "Painkillers", count: 950, percentage: 19, color: "#2ecc71" },
    { category: "Supplements", count: 850, percentage: 17, color: "#f1c40f" },
    { category: "Antihistamines", count: 600, percentage: 12, color: "#e74c3c" },
    { category: "Cardiovascular", count: 500, percentage: 10, color: "#9b59b6" },
    { category: "Other", count: 900, percentage: 18, color: "#95a5a6" },
  ];

  // Financial data for visualization
  const financialData = {
    revenue: [12500, 14000, 10800, 15200],
    expenses: [8200, 9100, 7600, 9800],
    profit: [4300, 4900, 3200, 5400],
    labels: ["Q1", "Q2", "Q3", "Q4"],
  };

  // Activity data matching the screenshot
  const activityData = [
    {
      type: "supplier",
      title: "Added new supplier",
      details: "MediCare Distributors",
      time: "5 days ago",
    },
    {
      type: "medicine",
      title: "Added new medicine",
      details: "Paracetamol",
      time: "5 days ago",
    },
    {
      type: "inventory",
      title: "Updated inventory",
      details: "Batch ID: 101, Quantity: 50",
      time: "5 days ago",
    },
    {
      type: "order",
      title: "Fulfilled order",
      details: "Order ID: ORD-2025-042",
      time: "1 day ago",
    },
  ];

  // Quick actions
  const quickActions = [
    {
      title: "Add Medicine",
      icon: FilePlus2,
      description: "Register a new medicine",
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      onClick: () => {
        setShowMedicineForm(true);
      },
    },
    {
      title: "Update Inventory",
      icon: FileEdit,
      description: "Update stock levels",
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      onClick: () => {
        setShowInventoryForm(true);
      },
    },
    {
      title: "Add Supplier",
      icon: Truck,
      description: "Register new supplier",
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
      onClick: () => {
        setShowSupplierForm(true);
      },
    },
    {
      title: "App Hub",
      icon: PlusCircle,
      description: "Explore more actions",
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
      onClick: () => setDashboardView("appHub"),
    },
  ];

  // Refresh data
  const refreshData = async () => {
    setRefreshing(true);
    try {
      await fetchKeyStats();
      toast({
        title: "Dashboard updated",
        description: "The latest inventory indicators are now loaded.",
        variant: "success",
      });
    } catch {
      toast({
        title: "Refresh failed",
        description: "Please check the connection and try again.",
        variant: "destructive",
      });
    } finally {
      setRefreshing(false);
    }
  };

  // Handle form success
  const handleFormSuccess = () => {
    refreshData();
  };

  const fetchKeyStats = useCallback(async () => {
    setStatsLoading(true);
    setStatsError(null);
    try {
      const response = await fetch("/api/dashboard/key-stats", { cache: "no-store" });
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || `Failed to fetch key stats: ${response.statusText}`);
      }
      const data: DashboardKeyStats = await response.json();
      setDashboardStats(data);
    } catch (err) {
      setStatsError(err instanceof Error ? err.message : "An unknown error occurred");
      setDashboardStats(null);
      throw err;
    } finally {
      setStatsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchKeyStats().catch(() => {});
  }, [fetchKeyStats]);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    // Animate progress bars
    const progressTimer = setTimeout(() => {
      let progress = 0;
      const interval = setInterval(() => {
        if (progress < 32) {
          progress += 1;
          setExpiryProgress(progress);
        } else {
          clearInterval(interval);
        }
      }, 20);
    }, 1000);

    return () => {
      clearTimeout(timer);
      clearTimeout(progressTimer);
    };
  }, []);

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut",
      },
    }),
  };

  return (
    <AppLayout>
      <DashboardShell className="p-0 dark:bg-[#070b14]">
        <div className="flex justify-between items-center px-4 py-4 border-b border-border/30">
          <div>
            <h1 className="text-2xl font-bold mb-1">Dashboard</h1>
            <p className="text-muted-foreground text-sm">
              Welcome back! Here&apos;s your pharmacy inventory overview for April 30,
              2025
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className={cn("gap-1", dashboardView === "appHub" ? "bg-muted" : "")}
              aria-pressed={dashboardView === "appHub"}
              onClick={() => setDashboardView("appHub")}
            >
              <Database size={14} />
              {dashboardView === "appHub" ? "Dashboard" : "App Hub"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-1"
              onClick={refreshData}
              disabled={refreshing}
            >
              {refreshing ? (
                <RefreshCcw size={14} className="animate-spin" />
              ) : (
                <RefreshCcw size={14} />
              )}
              {refreshing ? "Refreshing..." : "Refresh"}
            </Button>
            <Button
              variant="default"
              size="sm"
              className="gap-1"
              onClick={() =>
                exportRowsToCsv("medinv-key-indicators.csv", Object.entries(dashboardStats ?? {}).map(
                  ([indicator, value]) => ({
                    indicator,
                    value: value.value,
                    change: value.changeDisplay,
                  }),
                ))
              }
              disabled={!dashboardStats}
            >
              <Download size={14} />
              Export
            </Button>
          </div>
        </div>

        {dashboardView === "appHub" ? (
          <div className="p-4">
            <AppHub />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6 px-4 pt-4">
              {statsLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <motion.div
                    key={`skeleton-${i}`}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    custom={i}
                  >
                    <Card className="border-border/40 bg-card">
                      <CardHeader className="flex flex-row items-start justify-between p-4">
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-7 w-16" />
                          <Skeleton className="h-3 w-28" />
                        </div>
                        <Skeleton className="h-9 w-9 rounded-md" />
                      </CardHeader>
                      <Skeleton className="h-1 w-full" />
                    </Card>
                  </motion.div>
                ))
              ) : statsError ? (
                <div className="col-span-full text-center text-red-500 py-4">
                  Failed to load key statistics: {statsError}
                </div>
              ) : dashboardStats ? (
                (Object.keys(dashboardStats) as Array<keyof DashboardKeyStats>).map(
                  (key, i) => {
                    const stat = dashboardStats[key];
                    const config = statConfig[key];
                    const Icon = config.icon;
                    return (
                      <motion.div
                        key={config.title}
                        variants={cardVariants}
                        initial="hidden"
                        animate="visible"
                        custom={i}
                      >
                        <Card
                          className="border-border/40 bg-card hover:shadow-md transition-shadow duration-200 overflow-hidden cursor-pointer"
                          onClick={() => router.push(config.path)}
                        >
                          <CardHeader className="flex flex-row items-start justify-between p-4">
                            <div className="space-y-1">
                              <CardTitle className="text-muted-foreground text-sm font-normal">
                                {config.title}
                              </CardTitle>
                              <div className="text-2xl font-bold">
                                {stat.value.toLocaleString()}
                              </div>
                              <div
                                className={cn(
                                  "text-xs font-medium",
                                  stat.changeType === "positive"
                                    ? "text-emerald-500"
                                    : stat.changeType === "negative"
                                    ? "text-rose-500"
                                    : "text-muted-foreground"
                                )}
                              >
                                {stat.changeType === "positive"
                                  ? "↑"
                                  : stat.changeType === "negative"
                                  ? "↓"
                                  : ""}{" "}
                                {stat.changeDisplay} from last month
                              </div>
                            </div>
                            <div className={`p-2 rounded-md ${config.iconBg}`}>
                              <Icon className={`h-5 w-5 ${config.color}`} />
                            </div>
                          </CardHeader>
                          <div className="h-1 w-full bg-muted">
                            <div
                              className={cn(
                                "h-full",
                                stat.changeType === "positive"
                                  ? "bg-emerald-500"
                                  : stat.changeType === "negative"
                                  ? "bg-rose-500"
                                  : "bg-muted-foreground"
                              )}
                              style={{
                                width: `${Math.min(
                                  100,
                                  Math.abs(stat.change)
                                )}%`,
                              }}
                            ></div>
                          </div>
                        </Card>
                      </motion.div>
                    );
                  }
                )
              ) : (
                <div className="col-span-full text-center text-muted-foreground py-4">
                  No statistics available.
                </div>
              )}
            </div>

            <div className="mb-6 px-4">
              <h2 className="text-lg font-semibold mb-3">Quick Actions</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {quickActions.map((action, i) => (
                  <motion.div
                    key={action.title}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    custom={i + 4}
                  >
                    <Card
                      className="border-border/40 hover:border-primary/40 hover:shadow-md transition-all duration-200 cursor-pointer"
                      onClick={action.onClick}
                    >
                      <CardContent className="p-4 flex items-start gap-3">
                        <div className={`p-2 rounded-md ${action.bgColor}`}>
                          <action.icon className={`h-5 w-5 ${action.color}`} />
                        </div>
                        <div>
                          <h3 className="font-medium">{action.title}</h3>
                          <p className="text-xs text-muted-foreground">
                            {action.description}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="mt-4 px-4">
              <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-3 mb-6">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="reports">Reports</TabsTrigger>
                  <TabsTrigger value="alerts">
                    Alerts
                    <Badge variant="destructive" className="ml-2">
                      3
                    </Badge>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-7 gap-6">
                    <div className="md:col-span-4 space-y-6">
                      <Card className="border-border/40 shadow-sm">
                        <CardHeader className="pb-2 pt-6 flex flex-row items-center justify-between">
                          <div>
                            <CardTitle className="text-lg">
                              Orders Overview
                            </CardTitle>
                            <CardDescription>
                              Summary of recent orders and trends
                            </CardDescription>
                          </div>
                        </CardHeader>

                        <CardContent>
                          <OrdersOverview />

                          <div className="mt-4 text-right">
                            <Button
                              variant="link"
                              className="text-sm text-primary flex items-center ml-auto"
                              onClick={() => router.push("/orders")}
                            >
                              View all orders{" "}
                              <ArrowRight className="ml-1 h-3 w-3" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>

                      <InventoryDistribution className="mt-6" />
                    </div>

                    <div className="md:col-span-3 space-y-6">
                      <RecentActivity />

                      <Card className="border-border/40">
                        <CardHeader className="pb-2 pt-6">
                          <CardTitle className="text-lg">Low Stock Alerts</CardTitle>
                          <CardDescription>
                            Items below threshold levels
                          </CardDescription>
                        </CardHeader>

                        <CardContent className="p-0">
                          <div className="divide-y divide-border/40">
                            {[
                              { name: "Paracetamol (500mg)", quantity: 25, threshold: 100 },
                              { name: "Aspirin (300mg)", quantity: 18, threshold: 50 },
                              { name: "Ibuprofen (400mg)", quantity: 32, threshold: 75 },
                            ].map((item, index) => (
                              <div
                                key={index}
                                className="p-3 flex justify-between items-center text-sm"
                              >
                                <span>{item.name}</span>
                                <span className="font-medium text-orange-500">
                                  Qty: {item.quantity} (Threshold: {item.threshold})
                                </span>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                        <CardFooter className="py-3 px-4 border-t border-border/40">
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full"
                            onClick={() => router.push("/inventory")}
                          >
                            Order More Stock
                          </Button>
                        </CardFooter>
                      </Card>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="reports">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="border-border/40">
                      <CardHeader>
                        <CardTitle>Financial Summary</CardTitle>
                        <CardDescription>
                          Revenue, expenses and profit
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="h-[300px]">
                        <DataVisualization
                          data={{
                            labels: financialData.labels,
                            values: financialData.revenue,
                          }}
                        />
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <div>
                          <p className="text-xs text-muted-foreground">
                            Total Revenue
                          </p>
                          <p className="font-medium">₹52,500</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">
                            Total Expenses
                          </p>
                          <p className="font-medium">₹34,700</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">
                            Net Profit
                          </p>
                          <p className="font-medium">₹17,800</p>
                        </div>
                      </CardFooter>
                    </Card>

                    <Card className="border-border/40">
                      <CardHeader>
                        <CardTitle>Top Selling Medicines</CardTitle>
                        <CardDescription>
                          Most popular products this month
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {[
                            {
                              name: "Paracetamol 500mg",
                              sales: 2345,
                              growth: "+12%",
                              color: "#3498db",
                            },
                            {
                              name: "Amoxicillin 250mg",
                              sales: 1870,
                              growth: "+8%",
                              color: "#2ecc71",
                            },
                            {
                              name: "Ibuprofen 400mg",
                              sales: 1560,
                              growth: "+5%",
                              color: "#f1c40f",
                            },
                            {
                              name: "Cetirizine 10mg",
                              sales: 1280,
                              growth: "-2%",
                              color: "#e74c3c",
                            },
                            {
                              name: "Omeprazole 20mg",
                              sales: 980,
                              growth: "+9%",
                              color: "#9b59b6",
                            },
                          ].map((item, idx) => (
                            <div key={idx} className="flex items-center">
                              <div
                                className="w-1 h-12 mr-3"
                                style={{ backgroundColor: item.color }}
                              ></div>
                              <div className="flex-grow">
                                <div className="flex justify-between items-center">
                                  <p className="font-medium">{item.name}</p>
                                  <p
                                    className={cn(
                                      "text-xs",
                                      item.growth.startsWith("+")
                                        ? "text-emerald-500"
                                        : "text-rose-500"
                                    )}
                                  >
                                    {item.growth}
                                  </p>
                                </div>
                                <div className="w-full bg-muted h-1.5 rounded-full mt-1">
                                  <div
                                    style={{
                                      width: `${
                                        (item.sales / 2345) * 100
                                      }%`,
                                      backgroundColor: item.color,
                                    }}
                                    className="h-full rounded-full"
                                  ></div>
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {item.sales} units sold
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={() =>
                            router.push("/analytics?view=products")
                          }
                        >
                          View Full Product Analytics
                        </Button>
                      </CardFooter>
                    </Card>
                  </div>

                  <div className="mt-6 flex justify-center">
                    <Button
                      className="gap-2"
                      onClick={() => router.push("/analytics")}
                    >
                      <FileBarChart2 size={16} />
                      View Detailed Analytics
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="alerts">
                  <div className="grid grid-cols-1 gap-6">
                    <Card className="border-border/40">
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle>Low Stock Alerts</CardTitle>
                          <Badge variant="warning" className="rounded-sm">
                            3 Items
                          </Badge>
                        </div>
                        <CardDescription>
                          Items below minimum threshold
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {[
                            { name: "Paracetamol (500mg)", quantity: 25, threshold: 100 },
                            { name: "Aspirin (300mg)", quantity: 18, threshold: 50 },
                            { name: "Ibuprofen (400mg)", quantity: 32, threshold: 75 },
                          ].map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between">
                              <div>
                                <p className="font-medium">{item.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  Threshold: {item.threshold}
                                </p>
                              </div>
                              <Badge variant="destructive">
                                Qty: {item.quantity}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={() =>
                            router.push("/inventory")
                          }
                        >
                          Manage Inventory
                        </Button>
                      </CardFooter>
                    </Card>

                    <Card className="border-border/40 mt-6">
                      <CardHeader className="pb-2">
                        <CardTitle>System Notifications</CardTitle>
                        <CardDescription>
                          Recent system alerts and notifications
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {[
                            {
                              title: "System Maintenance",
                              message:
                                "Scheduled system maintenance on May 5, 2025 at 2:00 AM",
                              time: "2 days ago",
                              type: "info",
                            },
                            {
                              title: "Database Backup Completed",
                              message:
                                "Automatic database backup completed successfully",
                              time: "12 hours ago",
                              type: "success",
                            },
                            {
                              title: "License Renewal Reminder",
                              message:
                                "Your software license will expire in 15 days",
                              time: "1 day ago",
                              type: "warning",
                            },
                          ].map((notification, idx) => (
                            <div
                              key={idx}
                              className="flex items-start gap-3 p-3 rounded-md bg-muted/50"
                            >
                              <div
                                className={cn(
                                  "w-8 h-8 rounded-full flex items-center justify-center",
                                  notification.type === "info"
                                    ? "bg-blue-500/10"
                                    : notification.type === "success"
                                    ? "bg-green-500/10"
                                    : notification.type === "warning"
                                    ? "bg-amber-500/10"
                                    : "bg-rose-500/10"
                                )}
                              >
                                {notification.type === "info" && (
                                  <Search size={16} className="text-blue-500" />
                                )}
                                {notification.type === "success" && (
                                  <Activity size={16} className="text-green-500" />
                                )}
                                {notification.type === "warning" && (
                                  <AlertTriangle
                                    size={16}
                                    className="text-amber-500"
                                  />
                                )}
                              </div>
                              <div className="flex-grow">
                                <p className="font-medium">{notification.title}</p>
                                <p className="text-sm text-muted-foreground">
                                  {notification.message}
                                </p>
                                <div className="text-xs text-muted-foreground">
                                  {notification.time}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </>
        )}
      </DashboardShell>

      {/* Use the proper form components */}
      <MedicineForm
        medicine={null}
        isOpen={showMedicineForm}
        onOpenChange={setShowMedicineForm}
        onSuccess={handleFormSuccess}
      />
      
      <SupplierForm
        supplier={null}
        isOpen={showSupplierForm}
        onOpenChange={setShowSupplierForm}
        onSuccess={handleFormSuccess}
      />
      
      <InventoryForm
        item={null}
        isOpen={showInventoryForm}
        onOpenChange={setShowInventoryForm}
        onSuccess={handleFormSuccess}
      />
    </AppLayout>
  );
}
