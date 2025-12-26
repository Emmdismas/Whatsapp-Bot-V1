// handlers/fees.js
import { getFeesSummary, getFeesDetails } from "../api/student.js";
import { setSession } from "../session.js";

export async function showFeesSummary(phone, session) {
  const data = await getFeesSummary(session.student_id);

  if (!data) {
    return "❌ Hakuna taarifa za ada kwa sasa.";
  }

  let msg = `💰 *HALI YA ADA – ${data.academic_year}*\n\n`;
  msg += `Jumla Inayotakiwa: TZS ${data.total}\n`;
  msg += `Iliyolipwa: TZS ${data.paid}\n`;
  msg += `Salio: TZS ${data.balance}\n`;
  msg += `Status: ${data.balance > 0 ? "⚠️ Bado" : "✅ Imekamilika"}\n`;

  msg += `\n❓ Je, unataka maelezo zaidi? (yes/no)`;

  session.step = "view_fees_details";
  session.feesMeta = data;
  await setSession(phone, session);

  return msg;
}

export async function showFeesDetails(phone, session) {
  // Optional deep breakdown
  const details = await getFeesDetails(session.student_id);

  let msg = `📄 *MAELEZO YA MALIPO*\n\n`;

  details.payments.forEach(p => {
    msg += `📅 ${p.date}\n`;
    msg += `💳 ${p.method}\n`;
    msg += `💵 TZS ${p.amount}\n`;
    msg += `🧾 Ref: ${p.reference}\n\n`;
  });

  msg += `📞 Kwa maelezo zaidi wasiliana na Accountant:\n`;
  msg += `☎️ ${details.accountant_phone}\n`;

  session.step = "menu";
  await setSession(phone, session);

  return msg;
}
