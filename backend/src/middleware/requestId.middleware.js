const { v4: uuidv4 } = require("uuid");

function requestIdMiddleware(req, _res, next) {
  req.requestId = uuidv4();
  next();
}

module.exports = { requestIdMiddleware };
