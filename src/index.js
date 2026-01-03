import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

import "./config.js";
import "./session.js";   // ✅ just load it
import router from "./router.js";
import alertsRouter from "./internal/alerts.js";
import { internalWebhook } from "./internalWebhook.js";

const app = express();

// --- Middlewares ---
app.use(cors());
app.use(express.json({ limit: "200mb" }));
app.use(express.urlencoded({ extended: false, limit: "200mb" }));
app.use(bodyParser.json({ limit: "200mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "200mb" }));

// -------- ROUTES --------
app.post("/internal/parent-alert", internalWebhook);
app.use("/internal", alertsRouter);
app.use("/", router);

// Health check
app.get("/health", (req, res) => res.send("OK"));

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`📡 ShuleBot running on port ${PORT}`);
});
