import { useEffect, useState } from "react";
import ErrorBanner from "../../components/ErrorBanner";
import FilterBar, { FilterState } from "../../components/FilterBar";
import WorkOrdersTable from "../../components/WorkOrdersTable";
import { listWorkOrders } from "../../services/api";
import { WorkOrder } from "../../types/workorder";

const initialFilters: FilterState = {
  status: "",
  department: "",
  priority: "",
  assignee: "",
  q: "",
};

export default function WorkOrdersListPage() {
  const [items, setItems] = useState<WorkOrder[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [error, setError] = useState<{ message: string; requestId: string } | null>(null);

  useEffect(() => {
    listWorkOrders({ ...filters, page, limit }).then((res) => {
      if (res.ok) {
        setItems(res.data.items);
        setTotal(res.data.total);
        setError(null);
      } else {
        setError({ message: res.error.message, requestId: res.requestId });
      }
    });
  }, [filters, page, limit]);

  return (
    <div>
      <h2>Work Orders</h2>
      {error && <ErrorBanner message={error.message} requestId={error.requestId} />}
      <FilterBar
        filters={filters}
        onChange={(next) => {
          setPage(1);
          setFilters(next);
        }}
      />
      <WorkOrdersTable items={items} />
      <div className="row">
        <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
          Prev
        </button>
        <span>
          page {page} / {Math.max(1, Math.ceil(total / limit))}
        </span>
        <button disabled={page >= Math.ceil(total / limit)} onClick={() => setPage((p) => p + 1)}>
          Next
        </button>
      </div>
    </div>
  );
}
