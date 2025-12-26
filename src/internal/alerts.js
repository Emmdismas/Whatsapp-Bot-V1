import express from "express";
import { sendText } from "../utils.js";

const router = express.Router();

router.post("/alert", async (req, res) => {
  const { type, parent_phone, data } = req.body;

  let message = "";

  if (type === "LOW_MARKS") {
    message = `
⚠️ TAARIFA YA MWANAFUNZI

Mtoto wako amepata alama ndogo kwenye:
📘 ${data.subject}

📉 Wastani: ${data.average}%

Mfumo umeanza kumsaidia mwanafunzi kuboresha maeneo dhaifu.
`;
  }

  if (type === "RESULTS_READY") {
    message = `
📢 TAARIFA MPYA

Matokeo ya mwanafunzi yanapatikana sasa.
Tuma *RESULT* kuyaangalia.
`;
  }

  await sendText(parent_phone, message);

  res.json({ status: "sent" });
});

export default router;
