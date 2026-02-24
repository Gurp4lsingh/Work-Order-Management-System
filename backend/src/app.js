const express = require("express");
const cors = require("cors");
const indexRoutes = require("./routes/index.routes");
const { notFoundMiddleware } = require("./middleware/notfound.middleware");
const { errorMiddleware } = require("./middleware/error.middleware");
const { requestIdMiddleware } = require("./middleware/requestId.middleware");

const app = express();

const configuredOrigins = (process.env.CORS_ORIGIN || "http://localhost:3000")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) {
        callback(null, true);
        return;
      }

      if (
        configuredOrigins.includes(origin) ||
        /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(origin)
      ) {
        callback(null, true);
        return;
      }

      callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "x-api-key"],
  })
);

// 1) body parser
app.use(express.json());
// 2) request id
app.use(requestIdMiddleware);
// 3) lightweight request logging
app.use((req, _res, next) => {
  // eslint-disable-next-line no-console
  console.log(`[${req.requestId}] ${req.method} ${req.originalUrl}`);
  next();
});
// 4) routes
app.use(indexRoutes);
// 5) 404
app.use(notFoundMiddleware);
// 6) centralized error middleware
app.use(errorMiddleware);

module.exports = app;
