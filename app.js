import express from "express";
import bodyParser from "body-parser";

import whatsappWebhook from "./src/webhook.js";
import filesWebhook from "./src/webhook-files.js";

const app = express();

app.use(bodyParser.json());

// WhatsApp incoming messages
app.use("/api", whatsappWebhook);

// Laravel → Bot (files, alerts, etc.)
app.use("/api", filesWebhook);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("🤖 School Bot running on port", PORT);
});
