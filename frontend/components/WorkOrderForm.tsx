import { FormEvent } from "react";
import InlineError from "./InlineError";

export interface WorkOrderFormState {
  title: string;
  description: string;
  department: string;
  priority: string;
  requesterName: string;
  assignee: string;
}

export default function WorkOrderForm({
  value,
  onChange,
  onSubmit,
  errors,
  submitLabel,
  includeRequester = true,
  includeDepartment = true,
}: {
  value: WorkOrderFormState;
  onChange: (value: WorkOrderFormState) => void;
  onSubmit: () => void;
  errors: Record<string, string>;
  submitLabel: string;
  includeRequester?: boolean;
  includeDepartment?: boolean;
}) {
  const submit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={submit} className="form">
      <label>
        Title
        <input
          value={value.title}
          onChange={(e) => onChange({ ...value, title: e.target.value })}
        />
        {errors.title && <InlineError message={errors.title} />}
      </label>
      <label>
        Description
        <textarea
          value={value.description}
          onChange={(e) => onChange({ ...value, description: e.target.value })}
        />
        {errors.description && <InlineError message={errors.description} />}
      </label>
      {includeDepartment && (
        <label>
          Department
          <select
            value={value.department}
            onChange={(e) => onChange({ ...value, department: e.target.value })}
          >
            <option value="">Select</option>
            <option value="FACILITIES">FACILITIES</option>
            <option value="IT">IT</option>
            <option value="SECURITY">SECURITY</option>
            <option value="HR">HR</option>
          </select>
          {errors.department && <InlineError message={errors.department} />}
        </label>
      )}
      <label>
        Priority
        <select
          value={value.priority}
          onChange={(e) => onChange({ ...value, priority: e.target.value })}
        >
          <option value="">Select</option>
          <option value="LOW">LOW</option>
          <option value="MEDIUM">MEDIUM</option>
          <option value="HIGH">HIGH</option>
        </select>
        {errors.priority && <InlineError message={errors.priority} />}
      </label>
      {includeRequester && (
        <label>
          Requester Name
          <input
            value={value.requesterName}
            onChange={(e) => onChange({ ...value, requesterName: e.target.value })}
          />
          {errors.requesterName && <InlineError message={errors.requesterName} />}
        </label>
      )}
      <label>
        Assignee
        <input
          value={value.assignee}
          onChange={(e) => onChange({ ...value, assignee: e.target.value })}
        />
      </label>
      <button type="submit">{submitLabel}</button>
    </form>
  );
}
