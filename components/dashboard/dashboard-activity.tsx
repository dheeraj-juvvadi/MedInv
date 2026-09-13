"use client";

import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Boxes,
  ClipboardList,
  Grid2X2,
  Pill,
  Plus,
  Truck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { type Activity, type DashboardResource } from "./use-dashboard-data";

const activityIcons: Record<string, typeof Boxes> = {
  inventory: Boxes,
  medicine: Pill,
  supplier: Truck,
  order: ClipboardList,
};

export function DashboardActivity({
  activity,
  onRetry,
}: {
  activity: DashboardResource<Activity>;
  onRetry: () => void;
}) {
  return (
    <section
      className="dash-panel dash-activity"
      aria-labelledby="activity-title"
    >
      <div className="dash-section-top">
        <div>
          <h2 id="activity-title">Recent activity</h2>
        </div>
        <Link href="/activity-logs" className="dash-text-link">
          View log <ArrowRight size={15} aria-hidden="true" />
        </Link>
      </div>
      {activity.loading && !activity.items ? (
        <div
          className="dash-loading-list"
          role="status"
          aria-label="Loading activity"
        >
          <span />
          <span />
          <span />
        </div>
      ) : activity.error ? (
        <div className="dash-empty" role="alert">
          <h3>Activity is unavailable</h3>
          <p>{activity.error}</p>
          <Button variant="outline" onClick={onRetry}>
            Try again
          </Button>
        </div>
      ) : !activity.items?.length ? (
        <div className="dash-empty">
          <ClipboardList size={24} aria-hidden="true" />
          <h3>No recent activity</h3>
          <p>Recorded activity will appear here.</p>
        </div>
      ) : (
        <ul className="dash-activity-list" aria-busy={activity.loading}>
          {activity.items.slice(0, 4).map((item) => {
            const Icon =
              activityIcons[item.type.toLowerCase()] || ClipboardList;
            const timestamp = new Date(item.timestamp);
            const validTimestamp = !Number.isNaN(timestamp.getTime());
            return (
              <li key={item.id}>
                <span className="dash-activity-icon">
                  <Icon size={18} strokeWidth={1.5} aria-hidden="true" />
                </span>
                <div className="dash-activity-copy">
                  <strong>
                    {item.action.toLowerCase().replace(/_/g, " ")}
                  </strong>
                  <p>{item.details}</p>
                </div>
                {validTimestamp && (
                  <time
                    dateTime={timestamp.toISOString()}
                    title={timestamp.toLocaleString()}
                  >
                    {timestamp.toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                    })}
                    <span>
                      {timestamp.toLocaleTimeString("en-GB", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </time>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

export function DashboardActions({
  onMedicine,
  onSupplier,
}: {
  onMedicine: () => void;
  onSupplier: () => void;
}) {
  return (
    <section
      className="dash-panel dash-actions"
      aria-labelledby="actions-title"
    >
      <div className="dash-section-top">
        <div>
          <h2 id="actions-title">Quick actions</h2>
        </div>
      </div>
      <div className="dash-action-list">
        <button type="button" onClick={onMedicine}>
          <Pill size={19} strokeWidth={1.5} aria-hidden="true" />
          <span>
            <strong>Add a medicine</strong>
            <small>Medicine catalogue</small>
          </span>
          <Plus size={17} aria-hidden="true" />
        </button>
        <button type="button" onClick={onSupplier}>
          <Truck size={19} strokeWidth={1.5} aria-hidden="true" />
          <span>
            <strong>Add a supplier</strong>
            <small>Supplier directory</small>
          </span>
          <Plus size={17} aria-hidden="true" />
        </button>
        <Link href="/analytics">
          <BarChart3 size={19} strokeWidth={1.5} aria-hidden="true" />
          <span>
            <strong>Analytics</strong>
            <small>Inventory reports</small>
          </span>
          <ArrowUpRight size={17} aria-hidden="true" />
        </Link>
        <Link href="/app-hub">
          <Grid2X2 size={19} strokeWidth={1.5} aria-hidden="true" />
          <span>
            <strong>All tools</strong>
            <small>Browse workspace</small>
          </span>
          <ArrowUpRight size={17} aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
