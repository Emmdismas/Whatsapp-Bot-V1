// src/internalWebhook.js
import { sendParentAlert } from "./alerts/parentAlert.js";

export async function internalWebhook(req, res) {
    try {
        const payload = req.body;

        // Expected format:
        // {
        //   parent_phone,
        //   student_name,
        //   exam_name,
        //   subjects: [{ name, average }]
        // }

        await sendParentAlert(payload);

        return res.json({ status: "OK" });
    } catch (err) {
        console.error("Internal webhook error", err);
        return res.status(500).json({ error: "Failed" });
    }
}
