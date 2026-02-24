const { errorFactory } = require("../utils/errors.util");

function notFoundMiddleware(req, _res, next) {
  next(errorFactory.notFound(`Route not found: ${req.method} ${req.originalUrl}`));
}

module.exports = { notFoundMiddleware };
