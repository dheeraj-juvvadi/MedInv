"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface CategoryData {
  name: string;
  count: number;
  percentage: number;
  trend: number;
  value: number;
  color: string;
}

interface LocationData {
  name: string;
  count: number;
  percentage: number;
  trend: number;
  value: number;
  color: string;
}

interface InventoryStats {
  totalItems: number;
  totalValue: number;
  lowStockCount: number;
  categories: CategoryData[];
  locations: LocationData[];
}

interface InventoryDistributionProps {
  className?: string;
}

const COLOR_PALETTE = [
  "#10b981",
  "#3b82f6",
  "#f59e0b",
  "#8b5cf6",
  "#ef4444",
  "#ec4899",
  "#14b8a6",
  "#64748b",
  "#84cc16",
  "#6366f1",
];

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export function InventoryDistribution({
  className,
}: InventoryDistributionProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<"category" | "location">(
    "category",
  );
  const [hoverState, setHoverState] = useState<string | null>(null);
  const [sortMethod, setSortMethod] = useState<"value" | "percentage">("value");
  const [inventoryStats, setInventoryStats] = useState<InventoryStats | null>(
    null,
  );

  useEffect(() => {
    async function fetchInventoryData() {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch("/api/inventory/distribution");

        if (!response.ok) {
          throw new Error(
            `Error fetching inventory data: ${response.status} ${response.statusText}`,
          );
        }

        const data = await response.json();

        const processedData: InventoryStats = {
          totalItems: data.totalItems || 0,
          totalValue: data.totalValue || 0,
          lowStockCount: data.lowStockCount || 0,

          categories: (data.categories || []).map(
            (category: any, index: number) => ({
              name: category.name,
              count: category.count,
              percentage: category.percentage,
              trend: category.trend || 0,
              value: category.value || 0,
              color: COLOR_PALETTE[index % COLOR_PALETTE.length],
            }),
          ),

          locations: (data.locations || []).map(
            (location: any, index: number) => ({
              name: location.name,
              count: location.count,
              percentage: location.percentage,
              trend: location.trend || 0,
              value: location.value || 0,
              color: COLOR_PALETTE[index % COLOR_PALETTE.length],
            }),
          ),
        };

        setInventoryStats(processedData);
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching inventory distribution data:", err);
        setError(
          err instanceof Error ? err.message : "An unknown error occurred",
        );
        setIsLoading(false);
      }
    }

    fetchInventoryData();
  }, []);

  const getSortedData = () => {
    if (!inventoryStats) return [];

    const activeData =
      activeView === "category"
        ? inventoryStats.categories
        : inventoryStats.locations;
    return [...activeData].sort((a, b) =>
      sortMethod === "value" ? b.value - a.value : b.percentage - a.percentage,
    );
  };

  const generatePieChartSegments = (data: CategoryData[] | LocationData[]) => {
    if (!data || data.length === 0) return [];

    const sortedData = [...data].sort((a, b) => b.percentage - a.percentage);
    const radius = 15.91549430918954;
    const circumference = 2 * Math.PI * radius;

    let accumulatedPercentage = 0;

    return sortedData.map((item, index) => {
      const strokeDasharray = `${(item.percentage / 100) * circumference} ${circumference}`;
      const strokeDashoffset = `${-((accumulatedPercentage / 100) * circumference)}`;
      accumulatedPercentage += item.percentage;

      return (
        <circle
          key={index}
          cx="50"
          cy="50"
          r={radius}
          fill="transparent"
          stroke={item.color}
          strokeWidth="30"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-500"
        />
      );
    });
  };

  const handleSortChange = (method: "value" | "percentage") => {
    setSortMethod(method);
  };

  if (isLoading) {
    return (
      <Card className={cn("border-border/40 shadow-sm", className)}>
        <CardHeader className="pb-2 pt-6 flex flex-row items-center justify-between">
          <div>
            <Skeleton className="h-6 w-44 bg-muted" />
            <Skeleton className="h-4 w-60 mt-2 bg-muted" />
          </div>
          <Skeleton className="h-8 w-28 bg-muted" />
        </CardHeader>

        <CardContent>
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="w-full md:w-1/3 flex justify-center">
              <Skeleton className="h-52 w-52 rounded-full bg-muted" />
            </div>
            <div className="w-full md:w-2/3 space-y-4">
              <div className="flex justify-between">
                <Skeleton className="h-5 w-24 bg-muted" />
                <Skeleton className="h-5 w-32 bg-muted" />
              </div>
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-24 bg-muted" />
                    <Skeleton className="h-4 w-12 bg-muted" />
                  </div>
                  <Skeleton className="h-2 w-full bg-muted" />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t border-border/40 px-6 py-3">
          <Skeleton className="h-9 w-full bg-muted" />
        </CardFooter>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={cn("border-border/40 shadow-sm", className)}>
        <CardHeader className="pb-2 pt-6">
          <CardTitle>Inventory Distribution</CardTitle>
          <CardDescription>
            Breakdown by categories and locations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
            <h3 className="text-lg font-semibold">
              Failed to load inventory distribution
            </h3>
            <p className="text-muted-foreground text-sm mt-2 mb-6">{error}</p>
            <Button
              onClick={() => window.location.reload()}
              variant="outline"
              className="border-red-800 text-red-500 hover:bg-red-900/10"
            >
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!inventoryStats) return null;

  const activeData = getSortedData();
  const selectedData =
    activeView === "category"
      ? inventoryStats.categories
      : inventoryStats.locations;

  return (
    <Card
      className={cn(
        "border-border/40 shadow-sm h-full flex flex-col",
        className,
      )}
    >
      <CardHeader className="border-b border-border/40 pb-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle>Inventory Distribution</CardTitle>
            <CardDescription>
              Breakdown by categories and locations
            </CardDescription>
          </div>
          <Tabs
            value={activeView}
            onValueChange={(v) => setActiveView(v as "category" | "location")}
            className="h-8"
          >
            <TabsList className="h-8 bg-muted/50">
              <TabsTrigger value="category" className="h-7 px-3 text-xs">
                Categories
              </TabsTrigger>
              <TabsTrigger value="location" className="h-7 px-3 text-xs">
                Locations
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="w-full md:w-1/3 flex flex-col items-center justify-center pt-2">
            <div className="relative w-48 h-48">
              <svg
                className="w-full h-full transform -rotate-90"
                viewBox="0 0 100 100"
              >
                {generatePieChartSegments(selectedData)}
                <circle cx="50" cy="50" r="38" fill="hsl(var(--card))" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-3xl font-bold tracking-tighter">
                  {inventoryStats.totalItems.toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                  Items
                </div>
              </div>
            </div>
            <div className="text-center mt-6 p-4 bg-muted/30 rounded-lg w-full">
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">
                Total Value
              </p>
              <p className="text-2xl font-bold text-primary">
                {formatCurrency(inventoryStats.totalValue)}
              </p>
            </div>
          </div>

          <div className="w-full md:w-2/3 space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium text-muted-foreground">
                Top {activeView === "category" ? "Categories" : "Locations"}
              </h3>
              <div className="flex items-center gap-1 bg-muted/30 p-1 rounded-md">
                <button
                  onClick={() => handleSortChange("value")}
                  className={cn(
                    "text-[10px] px-2 py-1 rounded-sm transition-all font-medium",
                    sortMethod === "value"
                      ? "bg-background shadow-sm text-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  Value
                </button>
                <button
                  onClick={() => handleSortChange("percentage")}
                  className={cn(
                    "text-[10px] px-2 py-1 rounded-sm transition-all font-medium",
                    sortMethod === "percentage"
                      ? "bg-background shadow-sm text-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  %
                </button>
              </div>
            </div>

            <div className="space-y-5">
              {activeData.map((item, index) => (
                <div
                  key={item.name}
                  className="group"
                  onMouseEnter={() => setHoverState(item.name)}
                  onMouseLeave={() => setHoverState(null)}
                >
                  <div className="flex justify-between items-end mb-2">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2.5 h-2.5 rounded-full ring-2 ring-offset-2 ring-offset-card"
                        style={
                          {
                            backgroundColor: item.color,
                            "--tw-ring-color": item.color,
                          } as React.CSSProperties
                        }
                      />
                      <span className="font-medium text-sm text-foreground">
                        {item.name}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-semibold text-sm block">
                        {formatCurrency(item.value)}
                      </span>
                    </div>
                  </div>

                  <div className="relative h-2 w-full bg-secondary rounded-full overflow-hidden">
                    <div
                      className="absolute top-0 left-0 h-full rounded-full transition-all duration-500 ease-out"
                      style={{
                        width: `${item.percentage}%`,
                        backgroundColor: item.color,
                        opacity:
                          hoverState === item.name || hoverState === null
                            ? 1
                            : 0.5,
                      }}
                    />
                  </div>

                  <div className="flex justify-between items-center mt-1.5">
                    <span className="text-xs text-muted-foreground">
                      {item.count.toLocaleString()} items
                    </span>
                    <span className="text-xs font-medium text-muted-foreground">
                      {item.percentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {activeView === "category" && inventoryStats.lowStockCount > 0 && (
              <div className="mt-4 flex items-center justify-between p-3 bg-amber-500/5 rounded-md border border-amber-500/20">
                <div className="flex items-center gap-2">
                  <AlertCircle size={14} className="text-amber-600" />
                  <span className="text-xs font-medium text-amber-700">
                    {inventoryStats.lowStockCount}{" "}
                    {inventoryStats.lowStockCount === 1
                      ? "category has"
                      : "categories have"}{" "}
                    low stock
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 text-[10px] text-amber-700 hover:text-amber-800 hover:bg-amber-500/10 px-2"
                  onClick={() => router.push("/inventory?filter=low-stock")}
                >
                  Check
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="border-t border-border/40 p-4 bg-muted/5">
        <Button
          variant="ghost"
          className="w-full text-muted-foreground hover:text-primary text-sm h-9"
          onClick={() =>
            router.push(
              `/${activeView === "category" ? "drug-categories" : "inventory"}?view=distribution`,
            )
          }
        >
          {activeView === "category"
            ? "View Detailed Category Breakdown"
            : "View Storage Locations Report"}
        </Button>
      </CardFooter>
    </Card>
  );
}
