const { parse } = require("csv-parse/sync");
const { v4: uuidv4 } = require("uuid");
const service = require("../services/workorders.service");
const { sendSuccess } = require("../utils/response.util");
const { errorFactory } = require("../utils/errors.util");
const { CSV_REQUIRED_HEADERS } = require("../utils/constants");

function listWorkOrders(req, res, next) {
  try {
    const result = service.listWorkOrders(req.query);
    return sendSuccess(req, res, result);
  } catch (err) {
    return next(err);
  }
}

function getWorkOrder(req, res, next) {
  try {
    const result = service.getWorkOrder(req.params.id);
    return sendSuccess(req, res, result);
  } catch (err) {
    return next(err);
  }
}

function createWorkOrder(req, res, next) {
  try {
    const created = service.createWorkOrder(req.body);
    return sendSuccess(req, res, created, 201);
  } catch (err) {
    return next(err);
  }
}

function updateWorkOrder(req, res, next) {
  try {
    const updated = service.updateWorkOrder(req.params.id, req.body);
    return sendSuccess(req, res, updated);
  } catch (err) {
    return next(err);
  }
}

function changeStatus(req, res, next) {
  try {
    const updated = service.changeStatus(req.params.id, req.body.status);
    return sendSuccess(req, res, updated);
  } catch (err) {
    return next(err);
  }
}

function deleteWorkOrder(req, res, next) {
  try {
    service.deleteWorkOrder(req.params.id);
    return sendSuccess(req, res, { deleted: true });
  } catch (err) {
    return next(err);
  }
}

function validateCsvHeaders(headers) {
  const normalized = headers.map((h) => h.trim().toLowerCase());
  const missing = CSV_REQUIRED_HEADERS.filter(
    (required) => !normalized.includes(required.toLowerCase())
  );
  return { normalized, missing };
}

function rowToPayload(row) {
  const payload = {
    title: row.title ? String(row.title).trim() : "",
    description: row.description ? String(row.description).trim() : "",
    department: row.department ? String(row.department).trim().toUpperCase() : "",
    priority: row.priority ? String(row.priority).trim().toUpperCase() : "",
    requesterName: row.requestername ? String(row.requestername).trim() : "",
  };
  if (row.assignee != null && String(row.assignee).trim() !== "") {
    payload.assignee = String(row.assignee).trim();
  }
  return payload;
}

function bulkUpload(req, res, next) {
  try {
    if (!req.file) {
      throw errorFactory.validation("CSV file is required", [
        { field: "file", reason: "File is required" },
      ]);
    }

    const content = req.file.buffer.toString("utf-8");
    const records = parse(content, {
      columns: (headers) => headers.map((h) => String(h).trim().toLowerCase()),
      skip_empty_lines: true,
      trim: true,
      relax_column_count: true,
    });

    if (records.length === 0) {
      throw errorFactory.validation("CSV has no data rows", []);
    }

    const headerCheck = validateCsvHeaders(Object.keys(records[0]));
    if (headerCheck.missing.length > 0) {
      throw errorFactory.validation("CSV headers are invalid", headerCheck.missing.map((h) => ({
        field: "header",
        reason: `Missing required column: ${h}`,
      })));
    }

    const errors = [];
    let accepted = 0;

    records.forEach((row, index) => {
      const rowNumber = index + 2;
      const payload = rowToPayload(row);
      const fieldErrors = service.validateCreatePayload(payload);
      if (fieldErrors.length > 0) {
        fieldErrors.forEach((err) => {
          errors.push({ row: rowNumber, field: err.field, reason: err.reason });
        });
        return;
      }
      service.createWorkOrder(payload);
      accepted += 1;
    });

    return sendSuccess(req, res, {
      uploadId: uuidv4(),
      strategy: "PARTIAL_ACCEPTANCE",
      totalRows: records.length,
      accepted,
      rejected: records.length - accepted,
      errors,
    });
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  listWorkOrders,
  getWorkOrder,
  createWorkOrder,
  updateWorkOrder,
  changeStatus,
  deleteWorkOrder,
  bulkUpload,
};
