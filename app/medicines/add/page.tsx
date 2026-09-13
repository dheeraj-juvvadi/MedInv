import { DashboardHeader } from "@/components/dashboard-header";
import { DashboardShell } from "@/components/dashboard-shell";
import { AddMedicineForm } from "@/components/add-medicine-form";
import { AppLayout } from "@/components/app-layout";

export default function AddMedicinePage() {
  return (
    <AppLayout>
      <DashboardShell>
        <DashboardHeader
          heading="Add Medicine"
          text="Add a new medicine to the catalog."
        />
        <div className="grid gap-4">
          <AddMedicineForm />
        </div>
      </DashboardShell>
    </AppLayout>
  );
}
