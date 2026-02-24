const express = require("express");
const workordersRoutes = require("./workorders.routes");
const { sendSuccess } = require("../utils/response.util");

const router = express.Router();

router.get("/health", (req, res) => {
  return sendSuccess(req, res, { status: "ok", time: new Date().toISOString() });
});

router.use("/api/workorders", workordersRoutes);

module.exports = router;
