const WORKORDER_STATUS = {
  NEW: "NEW",
  IN_PROGRESS: "IN_PROGRESS",
  BLOCKED: "BLOCKED",
  DONE: "DONE",
};

const DEPARTMENTS = {
  FACILITIES: "FACILITIES",
  IT: "IT",
  SECURITY: "SECURITY",
  HR: "HR",
};

const PRIORITIES = {
  LOW: "LOW",
  MEDIUM: "MEDIUM",
  HIGH: "HIGH",
};

const ALLOWED_TRANSITIONS = {
  NEW: ["IN_PROGRESS"],
  IN_PROGRESS: ["BLOCKED", "DONE"],
  BLOCKED: ["IN_PROGRESS"],
  DONE: [],
};

const CSV_REQUIRED_HEADERS = [
  "title",
  "description",
  "department",
  "priority",
  "requesterName",
];

module.exports = {
  WORKORDER_STATUS,
  DEPARTMENTS,
  PRIORITIES,
  ALLOWED_TRANSITIONS,
  CSV_REQUIRED_HEADERS,
};
