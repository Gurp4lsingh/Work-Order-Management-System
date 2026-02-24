import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import ErrorBanner from "../../components/ErrorBanner";
import StatusTransition from "../../components/StatusTransition";
import WorkOrderForm, { WorkOrderFormState } from "../../components/WorkOrderForm";
import { changeStatus, deleteWorkOrder, getWorkOrder, updateWorkOrder } from "../../services/api";
import { WorkOrder } from "../../types/workorder";

export default function WorkOrderDetailPage() {
  const router = useRouter();
  const id = router.query.id as string | undefined;

  const [item, setItem] = useState<WorkOrder | null>(null);
  const [apiError, setApiError] = useState<{ message: string; requestId: string } | null>(null);

  useEffect(() => {
    if (!id) return;
    getWorkOrder(id).then((res) => {
      if (res.ok) setItem(res.data);
      else setApiError({ message: res.error.message, requestId: res.requestId });
    });
  }, [id]);

  const form = useMemo<WorkOrderFormState>(
    () => ({
      title: item?.title || "",
      description: item?.description || "",
      department: item?.department || "",
      priority: item?.priority || "",
      requesterName: item?.requesterName || "",
      assignee: item?.assignee || "",
    }),
    [item]
  );

  const [formState, setFormState] = useState<WorkOrderFormState>(form);
  useEffect(() => setFormState(form), [form]);

  if (!item) {
    return (
      <div>
        <h2>Work Order Detail</h2>
        {apiError ? (
          <ErrorBanner message={apiError.message} requestId={apiError.requestId} />
        ) : (
          <p>Loading...</p>
        )}
      </div>
    );
  }

  const save = async () => {
    const res = await updateWorkOrder(item.id, {
      title: formState.title,
      description: formState.description,
      priority: formState.priority as any,
      assignee: formState.assignee || null,
    });
    if (res.ok) setItem(res.data);
    else setApiError({ message: res.error.message, requestId: res.requestId });
  };

  const onStatus = async (status: WorkOrder["status"]) => {
    const res = await changeStatus(item.id, status);
    if (res.ok) setItem(res.data);
    else setApiError({ message: res.error.message, requestId: res.requestId });
  };

  const onDelete = async () => {
    if (!confirm("Delete this work order?")) return;
    const res = await deleteWorkOrder(item.id);
    if (res.ok) router.push("/workorders");
    else setApiError({ message: res.error.message, requestId: res.requestId });
  };

  return (
    <div>
      <h2>Work Order: {item.id}</h2>
      {apiError && <ErrorBanner message={apiError.message} requestId={apiError.requestId} />}
      <div className="panel">
        <h3>Read-only Info</h3>
        <p>Created: {item.createdAt}</p>
        <p>Updated: {item.updatedAt}</p>
        <p>Status: {item.status}</p>
        <p>Department: {item.department}</p>
        <p>Requester: {item.requesterName}</p>
      </div>
      <div className="panel">
        <h3>Edit Work Order</h3>
        <WorkOrderForm
          value={formState}
          onChange={setFormState}
          onSubmit={save}
          errors={{}}
          submitLabel="Save Changes"
          includeRequester={false}
          includeDepartment={false}
        />
      </div>
      <StatusTransition current={item.status} onChangeStatus={onStatus} />
      <button className="danger" onClick={onDelete}>
        Delete Work Order
      </button>
    </div>
  );
}
