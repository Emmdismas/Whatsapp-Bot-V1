// alerts/alerts.js
import { sendText } from "../utils/whatsapp.js";

/**
 * RESULTS ALERT
 */
export async function sendResultsAlert(parentPhone, student, exam) {
  const msg = `
📊 *MATOKEO YAMEPATIKANA*

👤 Mwanafunzi: ${student.name}
🏫 Darasa: ${student.class}
📝 Mtihani: ${exam.name}

👉 Tuma *1* kuona matokeo kamili kupitia bot.
`;

  await sendText(parentPhone, msg);
}

/**
 * ATTENDANCE ALERT
 */
export async function sendAttendanceAlert(parentPhone, student, date) {
  const msg = `
⚠️ *TAARIFA YA MAHUDHURIO*

👤 ${student.name}
📅 ${date}

Mwanafunzi *hakuwepo shule* siku hii.

👉 Tuma *2* kuona mahudhurio kamili.
`;

  await sendText(parentPhone, msg);
}

/**
 * FEES ALERT
 */
export async function sendFeesAlert(parentPhone, student, balance) {
  const msg = `
💰 *TAARIFA YA ADA*

👤 ${student.name}
💵 Salio: TZS ${balance.toLocaleString()}

Tafadhali fanya malipo haraka.

📞 Accountant: 0712 345 678
`;

  await sendText(parentPhone, msg);
}
