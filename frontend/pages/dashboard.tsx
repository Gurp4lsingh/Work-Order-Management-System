import { useEffect, useState } from "react";
import Link from "next/link";
import ErrorBanner from "../components/ErrorBanner";
import { listWorkOrders } from "../services/api";
import { WorkOrder } from "../types/workorder";

type Counts = Record<"NEW" | "IN_PROGRESS" | "BLOCKED" | "DONE", number>;

export default function DashboardPage() {
  const [items, setItems] = useState<WorkOrder[]>([]);
  const [error, setError] = useState<{ message: string; requestId: string } | null>(null);

  useEffect(() => {
    listWorkOrders({ page: 1, limit: 200 }).then((res) => {
      if (res.ok) setItems(res.data.items);
      else setError({ message: res.error.message, requestId: res.requestId });
    });
  }, []);

  const counts = items.reduce<Counts>(
    (acc, cur) => ({ ...acc, [cur.status]: acc[cur.status] + 1 }),
    { NEW: 0, IN_PROGRESS: 0, BLOCKED: 0, DONE: 0 }
  );

  const statuses: Array<keyof Counts> = ["NEW", "IN_PROGRESS", "BLOCKED", "DONE"];

  return (
    <div>
      <h2>Dashboard</h2>
      {error && <ErrorBanner message={error.message} requestId={error.requestId} />}
      <div className="kpi-grid">
        {statuses.map((status) => (
          <div className="card" key={status}>
            <h3>{status}</h3>
            <p>{counts[status]} work orders</p>
            {items
              .filter((x) => x.status === status)
              .slice(0, 4)
              .map((wo) => (
                <div key={wo.id} className="mini-row">
                  <span>{wo.title}</span>
                  <Link href={`/workorders/${wo.id}`}>Open</Link>
                </div>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
}
