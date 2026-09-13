"use client";

import { useSearchParams } from "next/navigation";
import { DatabaseExplorer } from "./database-explorer";
import { AppLayout } from "./app-layout";

export function DatabaseExplorerClient() {
  const searchParams = useSearchParams();
  const table = searchParams.get("table");

  return (
    <AppLayout>
      <DatabaseExplorer initialSelectedTable={table || undefined} />
    </AppLayout>
  );
}
