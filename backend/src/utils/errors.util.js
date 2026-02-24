class AppError extends Error {
  constructor(statusCode, code, message, details = []) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = Array.isArray(details) ? details : [details];
  }
}

const errorFactory = {
  validation: (message, details = []) =>
    new AppError(400, "VALIDATION_ERROR", message, details),
  unauthorized: (message = "Invalid or missing API key") =>
    new AppError(401, "UNAUTHORIZED", message),
  notFound: (message = "Resource not found") =>
    new AppError(404, "NOT_FOUND", message),
  conflict: (message = "Conflict", details = []) =>
    new AppError(409, "CONFLICT", message, details),
  invalidTransition: (message, details = []) =>
    new AppError(409, "INVALID_TRANSITION", message, details),
  tooLarge: (message = "Payload too large") =>
    new AppError(413, "PAYLOAD_TOO_LARGE", message),
  unsupportedMedia: (message = "Unsupported media type") =>
    new AppError(415, "UNSUPPORTED_MEDIA_TYPE", message),
  internal: (message = "Unexpected internal error") =>
    new AppError(500, "INTERNAL_ERROR", message),
};

module.exports = { AppError, errorFactory };
