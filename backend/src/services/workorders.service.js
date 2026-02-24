const { v4: uuidv4 } = require("uuid");
const store = require("../data/workorders.store");
const { errorFactory } = require("../utils/errors.util");
const {
  DEPARTMENTS,
  PRIORITIES,
  WORKORDER_STATUS,
  ALLOWED_TRANSITIONS,
} = require("../utils/constants");

function nowIso() {
  return new Date().toISOString();
}

function validateCreatePayload(payload) {
  const details = [];
  if (!payload || typeof payload !== "object") {
    return [{ field: "body", reason: "Payload is required" }];
  }
  if (!payload.title || payload.title.trim().length < 5) {
    details.push({ field: "title", reason: "Minimum length is 5" });
  }
  if (!payload.description || payload.description.trim().length < 10) {
    details.push({ field: "description", reason: "Minimum length is 10" });
  }
  if (!Object.values(DEPARTMENTS).includes(payload.department)) {
    details.push({
      field: "department",
      reason: "Must be FACILITIES, IT, SECURITY, or HR",
    });
  }
  if (!Object.values(PRIORITIES).includes(payload.priority)) {
    details.push({ field: "priority", reason: "Must be LOW, MEDIUM, or HIGH" });
  }
  if (!payload.requesterName || payload.requesterName.trim().length < 3) {
    details.push({ field: "requesterName", reason: "Minimum length is 3" });
  }
  if (payload.assignee != null && typeof payload.assignee !== "string") {
    details.push({ field: "assignee", reason: "Must be a string when provided" });
  }
  return details;
}

function validateUpdatePayload(payload) {
  const details = [];
  const allowed = ["title", "description", "priority", "assignee"];
  if (!payload || typeof payload !== "object") {
    return [{ field: "body", reason: "Payload is required" }];
  }
  Object.keys(payload).forEach((key) => {
    if (!allowed.includes(key)) {
      details.push({ field: key, reason: "Field cannot be updated" });
    }
  });
  if (payload.title != null && payload.title.trim().length < 5) {
    details.push({ field: "title", reason: "Minimum length is 5" });
  }
  if (payload.description != null && payload.description.trim().length < 10) {
    details.push({ field: "description", reason: "Minimum length is 10" });
  }
  if (payload.priority != null && !Object.values(PRIORITIES).includes(payload.priority)) {
    details.push({ field: "priority", reason: "Must be LOW, MEDIUM, or HIGH" });
  }
  if (payload.assignee != null && typeof payload.assignee !== "string") {
    details.push({ field: "assignee", reason: "Must be a string when provided" });
  }
  return details;
}

function validateStatusPayload(payload) {
  const details = [];
  if (!payload || typeof payload !== "object") {
    return [{ field: "body", reason: "Payload is required" }];
  }
  if (!Object.values(WORKORDER_STATUS).includes(payload.status)) {
    details.push({
      field: "status",
      reason: "Must be NEW, IN_PROGRESS, BLOCKED, or DONE",
    });
  }
  return details;
}

function createWorkOrder(payload) {
  const validation = validateCreatePayload(payload);
  if (validation.length > 0) {
    throw errorFactory.validation("Validation failed", validation);
  }
  const timestamp = nowIso();
  const item = {
    id: uuidv4(),
    title: payload.title.trim(),
    description: payload.description.trim(),
    department: payload.department,
    priority: payload.priority,
    status: WORKORDER_STATUS.NEW,
    requesterName: payload.requesterName.trim(),
    assignee: payload.assignee ? payload.assignee.trim() : null,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
  return store.save(item);
}

function listWorkOrders(query = {}) {
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.max(1, Number(query.limit) || 10);
  const q = query.q ? String(query.q).toLowerCase() : "";

  let items = store.list();
  if (query.status) items = items.filter((item) => item.status === query.status);
  if (query.department) {
    items = items.filter((item) => item.department === query.department);
  }
  if (query.priority) items = items.filter((item) => item.priority === query.priority);
  if (query.assignee) items = items.filter((item) => item.assignee === query.assignee);
  if (q) items = items.filter((item) => item.title.toLowerCase().includes(q));

  items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const total = items.length;
  const start = (page - 1) * limit;
  return {
    items: items.slice(start, start + limit),
    page,
    limit,
    total,
  };
}

function getWorkOrder(id) {
  const item = store.getById(id);
  if (!item) {
    throw errorFactory.notFound("Work order not found");
  }
  return item;
}

function updateWorkOrder(id, payload) {
  const item = getWorkOrder(id);
  const validation = validateUpdatePayload(payload);
  if (validation.length > 0) {
    throw errorFactory.validation("Validation failed", validation);
  }
  const updated = {
    ...item,
    ...payload,
    assignee: payload.assignee === undefined ? item.assignee : payload.assignee,
    updatedAt: nowIso(),
  };
  return store.save(updated);
}

function changeStatus(id, nextStatus) {
  const item = getWorkOrder(id);
  const allowed = ALLOWED_TRANSITIONS[item.status] || [];
  if (!allowed.includes(nextStatus)) {
    throw errorFactory.invalidTransition(
      `Invalid transition from ${item.status} to ${nextStatus}`,
      [{ from: item.status, to: nextStatus, allowed }]
    );
  }
  const updated = {
    ...item,
    status: nextStatus,
    updatedAt: nowIso(),
  };
  return store.save(updated);
}

function deleteWorkOrder(id) {
  getWorkOrder(id);
  store.remove(id);
}

module.exports = {
  validateCreatePayload,
  validateUpdatePayload,
  validateStatusPayload,
  createWorkOrder,
  listWorkOrders,
  getWorkOrder,
  updateWorkOrder,
  changeStatus,
  deleteWorkOrder,
};
