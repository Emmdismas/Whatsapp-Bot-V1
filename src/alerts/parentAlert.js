// src/alerts/parentAlert.js
import { detectWeaknesses } from "../logic/weakness.js";
import { sendWhatsAppMessage } from "../whatsapp.js";

export async function sendParentAlert(payload) {
    const {
        parent_phone,
        student_name,
        exam_name,
        subjects
    } = payload;

    const { weaknesses } = detectWeaknesses(subjects);

    let message = `📢 *TAARIFA YA MATOKEO*\n\n`;
    message += `Mwanafunzi: *${student_name}*\n`;
    message += `Mtihani: *${exam_name}*\n\n`;

    if (weaknesses.length === 0) {
        message += `✅ Anafanya vizuri kwenye masomo yote.\nEndeleeni kumtia moyo.`;
    } else {
        message += `⚠️ *Maeneo yenye changamoto:*\n`;
        weaknesses.forEach(w => {
            message += `- ${w.subject}\n`;
        });

        message += `\n📚 Pendekezo:\n`;
        message += `Tumia WhatsApp Bot kumsaidia mtoto wako kupata maelezo zaidi kwa masomo haya.`;
    }

    await sendWhatsAppMessage(parent_phone, message);
}
