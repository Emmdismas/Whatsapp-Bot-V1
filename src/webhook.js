// webhook.js
import express from "express";
import {
  sendResultsAlert,
  sendAttendanceAlert,
  sendFeesAlert
} from "./alerts/alerts.js";

const router = express.Router();

router.post("/alerts", async (req, res) => {
  const { type, parent, student, data } = req.body;

  try {
    if (type === "results") {
      await sendResultsAlert(parent.phone, student, data.exam);
    }

    if (type === "attendance") {
      await sendAttendanceAlert(parent.phone, student, data.date);
    }

    if (type === "fees") {
      await sendFeesAlert(parent.phone, student, data.balance);
    }

    res.json({ success: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false });
  }
});

export default router;
