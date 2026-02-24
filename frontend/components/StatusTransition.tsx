import { useState } from "react";
import { STATUS_TRANSITIONS, WorkOrderStatus } from "../types/workorder";

export default function StatusTransition({
  current,
  onChangeStatus,
}: {
  current: WorkOrderStatus;
  onChangeStatus: (next: WorkOrderStatus) => void;
}) {
  const allowed = STATUS_TRANSITIONS[current];
  const [next, setNext] = useState<WorkOrderStatus | "">("");

  if (allowed.length === 0) {
    return <p>No transitions allowed from {current}.</p>;
  }

  return (
    <div className="panel">
      <h3>Status Transition</h3>
      <div className="row">
        <select value={next} onChange={(e) => setNext(e.target.value as WorkOrderStatus)}>
          <option value="">Select next status</option>
          {allowed.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
        <button disabled={!next} onClick={() => next && onChangeStatus(next)}>
          Apply
        </button>
      </div>
    </div>
  );
}
