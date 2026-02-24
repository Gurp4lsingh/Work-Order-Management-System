const multer = require("multer");
const { AppError } = require("../utils/errors.util");
const { sendError } = require("../utils/response.util");

function errorMiddleware(err, req, res, _next) {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return sendError(
        req,
        res,
        {
          code: "PAYLOAD_TOO_LARGE",
          message: "CSV file is too large",
          details: [],
        },
        413
      );
    }
  }

  if (err instanceof AppError) {
    return sendError(
      req,
      res,
      {
        code: err.code,
        message: err.message,
        details: err.details || [],
      },
      err.statusCode
    );
  }

  // eslint-disable-next-line no-console
  console.error("Unhandled error:", err);
  return sendError(
    req,
    res,
    {
      code: "INTERNAL_ERROR",
      message: "Unexpected internal error",
      details: [],
    },
    500
  );
}

module.exports = { errorMiddleware };
