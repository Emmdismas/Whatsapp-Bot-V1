// handlers/books.js
import { getBooks, downloadBook } from "../api/shared.js";
import { setSession } from "../session.js";
import { sendDocument } from "../utils/whatsapp.js";

export async function showBooksList(phone, session) {
  const books = await getBooks(session.school_id);

  if (!books || books.length === 0) {
    return "📭 Hakuna vitabu vilivyopatikana kwa sasa.";
  }

  let msg = `📚 *VITABU VINAVYOPATIKANA*\n\n`;

  books.forEach((b, i) => {
    msg += `${i + 1}️⃣ ${b.title}\n`;
    msg += `📘 ${b.subject} – ${b.class}\n\n`;
  });

  msg += `👉 Tuma *namba* ya kitabu unachotaka kupakua`;

  session.step = "select_book";
  session.books = books;
  await setSession(phone, session);

  return msg;
}

export async function sendBookFile(phone, session, text) {
  const index = parseInt(text) - 1;
  const book = session.books?.[index];

  if (!book) {
    return "❌ Chaguo sio sahihi. Tafadhali tuma namba sahihi.";
  }

  const file = await downloadBook(book.id);

  await sendDocument(
    phone,
    file.url,
    file.filename,
    `📘 ${book.title}`
  );

  session.step = "menu";
  delete session.books;
  await setSession(phone, session);

  return "✅ Kitabu kimetumwa.\n\nJe, unahitaji huduma nyingine?";
}
