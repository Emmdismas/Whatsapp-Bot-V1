import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

import "./config.js";
import "./session.js";

import { handleIncoming } from "./router.js"; // ✅ SAHIHI
import alertsRouter from "./internal/alerts.js";
import { internalWebhook } from "./internalWebhook.js";

const app = express();

// middlewares
app.use(cors());
app.use(express.json({ limit: "200mb" }));
app.use(bodyParser.json({ limit: "200mb" }));

// WhatsApp webhook
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
