import { DashboardShell } from "@/components/dashboard-shell";
import { DashboardHeader } from "@/components/dashboard-header";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function ExpiryAlertsLoading() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Expiry Alerts"
        text="Monitor and manage medicines approaching expiration dates"
      />
      <div className="grid gap-4">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-[250px]" />
          <Skeleton className="h-10 w-[150px]" />
        </div>
        <Card>
          <div className="p-6">
            <Skeleton className="h-8 w-full mb-4" />
            <div className="space-y-2">
              {Array(5)
                .fill(null)
                .map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
            </div>
          </div>
        </Card>
      </div>
    </DashboardShell>
  );
}
