import { ChangeEvent } from "react";

export interface FilterState {
  status: string;
  department: string;
  priority: string;
  assignee: string;
  q: string;
}

export default function FilterBar({
  filters,
  onChange,
}: {
  filters: FilterState;
  onChange: (next: FilterState) => void;
}) {
  const handle = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    onChange({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className="filter-grid">
      <input name="q" placeholder="Search title" value={filters.q} onChange={handle} />
      <select name="status" value={filters.status} onChange={handle}>
        <option value="">All Status</option>
        <option value="NEW">NEW</option>
        <option value="IN_PROGRESS">IN_PROGRESS</option>
        <option value="BLOCKED">BLOCKED</option>
        <option value="DONE">DONE</option>
      </select>
      <select name="department" value={filters.department} onChange={handle}>
        <option value="">All Departments</option>
        <option value="FACILITIES">FACILITIES</option>
        <option value="IT">IT</option>
        <option value="SECURITY">SECURITY</option>
        <option value="HR">HR</option>
      </select>
      <select name="priority" value={filters.priority} onChange={handle}>
        <option value="">All Priorities</option>
        <option value="LOW">LOW</option>
        <option value="MEDIUM">MEDIUM</option>
        <option value="HIGH">HIGH</option>
      </select>
      <input name="assignee" placeholder="Assignee" value={filters.assignee} onChange={handle} />
    </div>
  );
}
