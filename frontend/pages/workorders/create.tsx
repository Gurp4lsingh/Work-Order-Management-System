import { useState } from "react";
import { useRouter } from "next/router";
import ErrorBanner from "../../components/ErrorBanner";
import WorkOrderForm, { WorkOrderFormState } from "../../components/WorkOrderForm";
import { createWorkOrder } from "../../services/api";

const initialState: WorkOrderFormState = {
  title: "",
  description: "",
  department: "",
  priority: "",
  requesterName: "",
  assignee: "",
};

function validate(form: WorkOrderFormState) {
  const errors: Record<string, string> = {};
  if (form.title.trim().length < 5) errors.title = "Title min length is 5";
  if (form.description.trim().length < 10) errors.description = "Description min length is 10";
  if (!form.department) errors.department = "Department required";
  if (!form.priority) errors.priority = "Priority required";
  if (form.requesterName.trim().length < 3) errors.requesterName = "Requester min length is 3";
  return errors;
}

export default function CreateWorkOrderPage() {
  const router = useRouter();
  const [form, setForm] = useState<WorkOrderFormState>(initialState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState<{ message: string; requestId: string } | null>(null);

  const submit = async () => {
    const localErrors = validate(form);
    setErrors(localErrors);
    if (Object.keys(localErrors).length > 0) return;

    const res = await createWorkOrder({
      title: form.title,
      description: form.description,
      department: form.department as any,
      priority: form.priority as any,
      requesterName: form.requesterName,
      assignee: form.assignee || null,
    });
    if (res.ok) {
      router.push(`/workorders/${res.data.id}`);
      return;
    }
    setApiError({ message: res.error.message, requestId: res.requestId });
  };

  return (
    <div>
      <h2>Create Work Order</h2>
      {apiError && <ErrorBanner message={apiError.message} requestId={apiError.requestId} />}
      <WorkOrderForm
        value={form}
        onChange={setForm}
        onSubmit={submit}
        errors={errors}
        submitLabel="Create Work Order"
      />
    </div>
  );
}
