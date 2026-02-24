const { errorFactory } = require("../utils/errors.util");

function validateMiddleware(validator) {
  return (req, _res, next) => {
    const details = validator(req);
    if (details.length > 0) {
      return next(errorFactory.validation("Validation failed", details));
    }
    return next();
  };
}

module.exports = { validateMiddleware };
