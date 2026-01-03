import { getNotices, downloadNotice } from "../api/shared.js";
import { setSession } from "../session.js";
import { sendWhatsAppMessage, sendDocument } from "../utils/whatsapp.js";

export async function showNoticesList(phone, session) {
  const notices = await getNotices(
    session.school_id,
    session.class
  );

  if (!notices || notices.length === 0) {
    return "📭 Hakuna matangazo mapya kwa sasa.";
  }

  let msg = `📢 *MATANGAZO YA SHULE*\n\n`;

  notices.forEach((n, i) => {
    msg += `${i + 1}️⃣ ${n.title}\n`;
    msg += `📅 ${n.date}\n\n`;
  });

  msg += "👉 Tuma *namba* ya tangazo unalotaka kufungua";

  session.step = "select_notice";
  session.notices = notices;
  await setSession(phone, session);

  return msg;
}

export async function sendNotice(phone, session, text) {
  const index = parseInt(text, 10) - 1;
  const notice = session.notices?.[index];

  if (!notice) {
    return "❌ Chaguo sio sahihi. Tafadhali tuma namba sahihi.";
  }

  // TEXT NOTICE
  if (notice.type === "text") {
    await sendWhatsAppMessage(
      phone,
      `📢 *${notice.title}*\n\n${notice.content}`
    );
  }

  // FILE NOTICE (PDF / DOC)
  if (notice.type === "file") {
    const file = await downloadNotice(notice.id);

    await sendDocument(
      phone,
      file.url,
      file.filename,
      `📢 ${notice.title}`
    );
  }

  session.step = "menu";
  delete session.notices;
  await setSession(phone, session);

  return "✅ Tangazo limetumwa.\n\nJe, unahitaji huduma nyingine?";
}
