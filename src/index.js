import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

import "./config.js";
import "./session.js";

import { handleIncoming } from "./router.js";
import alertsRouter from "./internal/alerts.js";
import { internalWebhook } from "./internalWebhook.js";

const app = express();

// middlewares
app.use(cors());
app.use(express.json({ limit: "200mb" }));
app.use(bodyParser.json({ limit: "200mb" }));

// ===============================
// WhatsApp webhook VERIFICATION
// ===============================
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === process.env.VERIFY_TOKEN) {
    console.log("✅ Webhook verified by Meta");
    return res.status(200).send(challenge);
  }

  console.log("❌ Webhook verification failed");
  return res.sendStatus(403);
});

// ===============================
// WhatsApp webhook MESSAGES
// ===============================
app.post("/webhook", async (req, res) => {
  try {
    const entry = req.body.entry?.[0];
    const change = entry?.changes?.[0];
    const message = change?.value?.messages?.[0];

    if (!message) return res.sendStatus(200);

    const from = message.from;
    const text = message.text?.body;
    const type = message.type;

    await handleIncoming({
      from,
      text,
      type,
      raw: message,
    });

    res.sendStatus(200);
  } catch (err) {
    console.error("Webhook error:", err);
    res.sendStatus(500);
  }
});

// internal routes
app.post("/internal/parent-alert", internalWebhook);
app.use("/internal", alertsRouter);

// health check
app.get("/health", (req, res) => res.send("OK"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`📡 ShuleBot running on port ${PORT}`)
);
