import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

import "./config.js";          // loads env
import "./session.js";         // initializes Redis

import { handleIncoming } from "./router.js";
import { sendText } from "./utils/whatsapp.js";

import alertsRouter from "./internal/alerts.js";
import { internalWebhook } from "./internalWebhook.js";

const app = express();

// ===============================
// MIDDLEWARES
// ===============================
app.use(cors());
app.use(express.json({ limit: "200mb" }));
app.use(bodyParser.json({ limit: "200mb" }));
app.use(bodyParser.urlencoded({ extended: true }));

// ===============================
// WHATSAPP WEBHOOK VERIFICATION
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
// WHATSAPP INCOMING MESSAGES
// ===============================
app.post("/webhook", async (req, res) => {
  try {
    const entry = req.body.entry?.[0];
    const change = entry?.changes?.[0];
    const message = change?.value?.messages?.[0];

    // WhatsApp sometimes sends delivery/read events
    if (!message) {
      return res.sendStatus(200);
    }

    const from = message.from;
    const text = message.text?.body;
    const type = message.type;

    console.log("📩 Incoming message:", { from, text, type });

    // MAIN BOT LOGIC
    const reply = await handleIncoming({
      from,
      text,
      type,
      raw: message,
    });

    // SEND RESPONSE BACK TO WHATSAPP
    if (typeof reply === "string" && reply.trim() !== "") {
      await sendText(from, reply);
    }

    return res.sendStatus(200);
  } catch (err) {
    console.error("❌ Webhook error:", err);
    return res.sendStatus(500);
  }
});

// ===============================
// INTERNAL ROUTES
// ===============================
app.post("/internal/parent-alert", internalWebhook);
app.use("/internal", alertsRouter);

// ===============================
// HEALTH CHECK (Render)
// ===============================
app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

// ===============================
// START SERVER
// ===============================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`📡 ShuleBot running on port ${PORT}`);
});
