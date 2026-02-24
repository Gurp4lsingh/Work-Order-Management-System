const { errorFactory } = require("../utils/errors.util");

function authMiddleware(req, _res, next) {
  const token = req.header("x-api-key");
  if (!token || token !== process.env.API_KEY) {
    return next(errorFactory.unauthorized());
  }
  return next();
}

module.exports = { authMiddleware };
