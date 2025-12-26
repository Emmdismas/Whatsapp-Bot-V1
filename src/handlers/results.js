// handlers/results.js
import { getStudentExams, getExamResults } from "../api/student.js";
import { setSession } from "../session.js";

export async function showResultsMenu(phone, session) {
  const exams = await getStudentExams(session.student_id);

  if (!exams.length) {
    return "❌ Hakuna matokeo yaliyopatikana kwa sasa.";
  }

  let msg = `📊 *CHAGUA MTIHANI*\n\n`;
  exams.forEach((e, i) => {
    msg += `${i + 1}️⃣ ${e.month} – ${e.exam_type} (${e.academic_year})\n`;
  });

  session.step = "select_exam";
  session.exams = exams;
  await setSession(phone, session);

  return msg + `\nTuma namba ya mtihani:`;
}

export async function handleExamSelection(phone, session, text) {
  const index = parseInt(text) - 1;
  const exam = session.exams[index];

  if (!exam) return "❌ Chaguo sio sahihi.";

  session.selected_exam = exam;
  session.step = "view_results";
  await setSession(phone, session);

  return `📘 ${exam.exam_type} – ${exam.month}\nTuma *OK* kuona matokeo.`;
}

export async function sendExamResults(phone, session, text) {
  if (text.toLowerCase() !== "ok") {
    return "⚠️ Tuma *OK* kuona matokeo.";
  }

  const data = await getExamResults(
    session.student_id,
    session.selected_exam.id
  );

  let msg = `📊 *MATOKEO YA MTIHANI*\n\n`;

  data.subjects.forEach(s => {
    msg += `${s.subject}: ${s.marks} (${s.grade})\n`;
  });

  msg += `\n📌 *Jumla:* ${data.total}\n`;
  msg += `📈 *Wastani:* ${data.average}\n`;
  msg += `🏆 *Nafasi:* ${data.position}\n`;

  if (data.weak_subjects.length) {
    msg += `\n⚠️ Ongeza bidii kwenye: ${data.weak_subjects.join(", ")}`;
  }

  session.step = "menu";
  await setSession(phone, session);

  return msg + `\n\n❓ Unahitaji huduma nyingine?`;
}
