const express = require("express");
const multer = require("multer");
const controller = require("../controllers/workorders.controller");
const { authMiddleware } = require("../middleware/auth.middleware");
const { validateMiddleware } = require("../middleware/validate.middleware");
const service = require("../services/workorders.service");
const { errorFactory } = require("../utils/errors.util");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const isCsvName = file.originalname.toLowerCase().endsWith(".csv");
    const isCsvMime =
      file.mimetype === "text/csv" ||
      file.mimetype === "application/vnd.ms-excel" ||
      file.mimetype === "application/csv";
    if (!isCsvName && !isCsvMime) {
      return cb(errorFactory.unsupportedMedia("Only .csv files are supported"));
    }
    return cb(null, true);
  },
});

const router = express.Router();

router.use(authMiddleware);

router.get("/", controller.listWorkOrders);
router.get("/:id", controller.getWorkOrder);
router.post(
  "/",
  validateMiddleware((req) => service.validateCreatePayload(req.body)),
  controller.createWorkOrder
);
router.put(
  "/:id",
  validateMiddleware((req) => service.validateUpdatePayload(req.body)),
  controller.updateWorkOrder
);
router.patch(
  "/:id/status",
  validateMiddleware((req) => service.validateStatusPayload(req.body)),
  controller.changeStatus
);
router.delete("/:id", controller.deleteWorkOrder);
router.post("/bulk-upload", upload.single("file"), controller.bulkUpload);
router.post("/data-transfer", upload.single("file"), controller.bulkUpload);

module.exports = router;
