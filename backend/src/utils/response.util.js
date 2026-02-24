function sendSuccess(req, res, data, statusCode = 200) {
  return res.status(statusCode).json({
    requestId: req.requestId,
    success: true,
    data,
  });
}

function sendError(req, res, error, statusCode) {
  return res.status(statusCode).json({
    requestId: req.requestId,
    success: false,
    error,
  });
}

module.exports = { sendSuccess, sendError };
