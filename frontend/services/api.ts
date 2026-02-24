import { ApiResult, WorkOrder, WorkOrderListResponse, WorkOrderStatus } from "../types/workorder";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001";
const API_KEY = process.env.NEXT_PUBLIC_API_KEY || "";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

async function request<T>(
  path: string,
  method: HttpMethod,
  body?: unknown,
  isMultipart = false
): Promise<ApiResult<T>> {
  try {
    const headers: Record<string, string> = {
      "x-api-key": API_KEY,
    };
    if (!isMultipart) {
      headers["Content-Type"] = "application/json";
    }

    const response = await fetch(`${API_BASE}${path}`, {
      method,
      headers,
      body: body
        ? isMultipart
          ? (body as BodyInit)
          : JSON.stringify(body)
        : undefined,
    });

    const payload = await response.json();
    if (payload.success) {
      return {
        ok: true,
        requestId: payload.requestId || "unknown",
        data: payload.data as T,
      };
    }
    return {
      ok: false,
      requestId: payload.requestId || "unknown",
      error: payload.error || {
        code: "INTERNAL_ERROR",
        message: "Unexpected error",
      },
    };
  } catch (_err) {
    return {
      ok: false,
      requestId: "unknown",
      error: {
        code: "NETWORK_ERROR",
        message: "Unable to reach backend API",
      },
    };
  }
}

export function listWorkOrders(query: Record<string, string | number | undefined>) {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([k, v]) => {
    if (v !== undefined && v !== "") params.set(k, String(v));
  });
  return request<WorkOrderListResponse>(`/api/workorders?${params.toString()}`, "GET");
}

export function getWorkOrder(id: string) {
  return request<WorkOrder>(`/api/workorders/${id}`, "GET");
}

export function createWorkOrder(payload: Partial<WorkOrder>) {
  return request<WorkOrder>("/api/workorders", "POST", payload);
}

export function updateWorkOrder(id: string, payload: Partial<WorkOrder>) {
  return request<WorkOrder>(`/api/workorders/${id}`, "PUT", payload);
}

export function changeStatus(id: string, status: WorkOrderStatus) {
  return request<WorkOrder>(`/api/workorders/${id}/status`, "PATCH", { status });
}

export function deleteWorkOrder(id: string) {
  return request<{ deleted: boolean }>(`/api/workorders/${id}`, "DELETE");
}

export function bulkUploadCsv(file: File) {
  const form = new FormData();
  form.append("file", file);
  return request<{
    uploadId: string;
    strategy: string;
    totalRows: number;
    accepted: number;
    rejected: number;
    errors: Array<{ row: number; field: string; reason: string }>;
  }>("/api/workorders/data-transfer", "POST", form, true);
}
