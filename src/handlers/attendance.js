// handlers/attendance.js
import { getAttendanceSummary, getMonthlyAttendance } from "../api/student.js";
import { setSession } from "../session.js";

export async function showAttendanceSummary(phone, session) {
  const data = await getAttendanceSummary(session.student_id);

  if (!data.months?.length) {
    return "❌ Hakuna taarifa za mahudhurio kwa sasa.";
  }

  let msg = `📅 *MAHUDHURIO YA JUMLA (${data.year})*\n\n`;

  data.months.forEach((m, i) => {
    msg += `${i + 1}️⃣ ${m.month}: ${m.present}/${m.total} (${m.percent}%)\n`;
  });

  msg += `\n❓ Chagua namba ya mwezi kuona maelezo zaidi:`;

  session.step = "select_attendance_month";
  session.attendanceMonths = data.months;
  await setSession(phone, session);

  return msg;
}

export async function handleMonthSelection(phone, session, text) {
  const index = parseInt(text) - 1;
  const month = session.attendanceMonths[index];

  if (!month) return "❌ Chaguo sio sahihi.";

  session.selectedMonth = month.month;
  session.step = "view_month_attendance";
  await setSession(phone, session);

  return `📆 ${month.month}\nTafadhali subiri...`;
}

export async function showMonthlyAttendance(phone, session) {
  const data = await getMonthlyAttendance(
    session.student_id,
    session.selectedMonth
  );

  let msg = `📅 *MAHUDHURIO – ${session.selectedMonth}*\n\n`;

  data.days.forEach(d => {
    msg += `${d.day_name} - ${d.date}: ${d.status}\n`;
  });

  session.step = "menu";
  await setSession(phone, session);

  return msg + `\n\n❓ Unahitaji huduma nyingine?`;
}
