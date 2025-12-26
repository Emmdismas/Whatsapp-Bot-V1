// handlers/assignments.js
import { getAssignments, downloadAssignment } from "../api/student.js";
import { setSession } from "../session.js";
import { sendDocument } from "../utils/whatsapp.js";

export async function showAssignmentsList(phone, session) {
  const assignments = await getAssignments(session.student_id);

  if (!assignments || assignments.length === 0) {
    return "📭 Hakuna assignments kwa sasa.";
  }

  let msg = `📘 *ASSIGNMENTS ZILIZOPO*\n\n`;

  assignments.forEach((a, i) => {
    msg += `${i + 1}️⃣ ${a.title}\n`;
    msg += `📚 ${a.subject}\n`;
    msg += `📅 ${a.deadline}\n\n`;
  });

  msg += `👉 Tuma *namba* ya assignment unayotaka kupakua`;

  session.step = "select_assignment";
  session.assignments = assignments;
  await setSession(phone, session);

  return msg;
}

export async function sendAssignmentFile(phone, session, text) {
  const index = parseInt(text) - 1;
  const assignment = session.assignments?.[index];

  if (!assignment) {
    return "❌ Chaguo sio sahihi. Tuma namba sahihi.";
  }

  const file = await downloadAssignment(assignment.id);

  await sendDocument(
    phone,
    file.url,
    file.filename,
    `📘 ${assignment.title}`
  );

  session.step = "menu";
  delete session.assignments;
  await setSession(phone, session);

  return "✅ Assignment imetumwa.\n\nJe, unahitaji huduma nyingine?";
}
