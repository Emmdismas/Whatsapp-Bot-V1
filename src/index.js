import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import "./config.js";       // Loads env + config
import { initRedis } from "./session.js";
import router from "./router.js";
import alertsRouter from "./internal/alerts.js";
import bodyParser from "body-parser";
import { internalWebhook } from "./internalWebhook.js";
app.use(bodyParser.json());

app.post("/internal/parent-alert", internalWebhook);

app.use("/internal", alertsRouter);


const app = express();

// --- Middlewares ---
app.use(cors());
app.use(express.json({ limit: "200mb" }));
app.use(express.urlencoded({ extended: false, limit: "200mb" }));

// WhatsApp will send file payloads, images, PDFs
app.use(bodyParser.json({ limit: "200mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "200mb" }));

// -------- CONNECT REDIS --------
initRedis();

// -------- ROUTES --------
app.use("/", router);

// For Render / Health checks
app.get("/health", (req, res) => {
    res.status(200).send("OK");
});

// Handle invalid endpoints
app.use((req, res) => {
    res.status(404).json({ error: "Endpoint not found" });
});

// Basic error handler
app.use((err, req, res, next) => {
    console.error("SERVER ERROR:", err);
    res.status(500).json({ error: "Internal server error" });
});

// -------- START SERVER --------
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`📡 ShuleBot running on port ${PORT}`);
});
