export type WorkOrderStatus = "NEW" | "IN_PROGRESS" | "BLOCKED" | "DONE";
export type Department = "FACILITIES" | "IT" | "SECURITY" | "HR";
export type Priority = "LOW" | "MEDIUM" | "HIGH";

export interface WorkOrder {
  id: string;
  title: string;
  description: string;
  department: Department;
  priority: Priority;
  status: WorkOrderStatus;
  requesterName: string;
  assignee: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface WorkOrderListResponse {
  items: WorkOrder[];
  page: number;
  limit: number;
  total: number;
}

export interface ApiErrorShape {
  code: string;
  message: string;
  details?: any[];
}

export type ApiResult<T> =
  | { ok: true; requestId: string; data: T }
  | { ok: false; requestId: string; error: ApiErrorShape };

export const STATUS_TRANSITIONS: Record<WorkOrderStatus, WorkOrderStatus[]> = {
  NEW: ["IN_PROGRESS"],
  IN_PROGRESS: ["BLOCKED", "DONE"],
  BLOCKED: ["IN_PROGRESS"],
  DONE: [],
};
