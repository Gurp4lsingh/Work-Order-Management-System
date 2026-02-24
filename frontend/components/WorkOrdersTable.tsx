import Link from "next/link";
import { WorkOrder } from "../types/workorder";

export default function WorkOrdersTable({ items }: { items: WorkOrder[] }) {
  return (
    <table className="table">
      <thead>
        <tr>
          <th>Title</th>
          <th>Department</th>
          <th>Priority</th>
          <th>Status</th>
          <th>Assignee</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {items.map((w) => (
          <tr key={w.id}>
            <td>{w.title}</td>
            <td>{w.department}</td>
            <td>{w.priority}</td>
            <td>{w.status}</td>
            <td>{w.assignee || "Unassigned"}</td>
            <td>
              <Link href={`/workorders/${w.id}`}>View</Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
