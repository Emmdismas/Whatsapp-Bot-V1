// src/webhook-files.js
import express from "express";
import { sendFile } from "./handlers/files.js";

const router = express.Router();

router.post("/files", async (req, res) => {
  const { parent_phone, file } = req.body;

  try {
    await sendFile(parent_phone, file);
    res.json({ success: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false });
  }
});

export default router;
