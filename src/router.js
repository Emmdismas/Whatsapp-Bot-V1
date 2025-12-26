// src/router.js

import {
  startAuth,
  handleSchool,
  handleUserId,
  handlePassword
} from "./authFlow.js";

import { studentMenu, teacherMenu } from "./menu.js";
import { getSession, setSession } from "./session.js";

// RESULTS
import {
  showResultsMenu,
  handleExamSelection,
  sendExamResults
} from "./handlers/results.js";

// ATTENDANCE
import {
  showAttendanceSummary,
  handleAttendanceMonthSelection,
  showMonthlyAttendance
} from "./handlers/attendance.js";

// FEES
import { showFeesStatus } from "./handlers/fees.js";

// ASSIGNMENTS
import { sendAssignments } from "./handlers/assignments.js";

// BOOKS
import { sendBooks } from "./handlers/books.js";

// NOTICES
import { sendNotices } from "./handlers/notices.js";

// OCR SCAN EXAM
import { scanAndMarkExam } from "./ai.js";
import { getMediaUrl } from "./utils/media.js";

/**
 * MAIN ENTRY POINT
 */
export async function handleIncoming({ from, text, type, raw }) {
  const phone = from;
  let session = await getSession(phone);

  // ---------------------------
  // 0: START AUTH
  // ---------------------------
  if (!session.step) {
    return startAuth(phone);
  }

  // ---------------------------
  // AUTH FLOW
  // ---------------------------
  if (session.step === "ask_school") return handleSchool(phone, text);
  if (session.step === "ask_userid") return handleUserId(phone, text);
  if (session.step === "ask_password") return handlePassword(phone, text);

  // ---------------------------
  // MAIN MENU
  // ---------------------------
  if (session.step === "menu") {
    const cmd = text?.trim();

    if (session.role === "student") {
      return handleStudentMenu(cmd, session, phone);
    }

    if (session.role === "teacher") {
      return handleTeacherMenu(cmd, session, phone);
    }
  }

  // ---------------------------
  // RESULTS FLOW
  // ---------------------------
  if (session.step === "select_exam") {
    return handleExamSelection(phone, session, text);
  }

  if (session.step === "view_results") {
    return sendExamResults(phone, session, text);
  }

  // ---------------------------
  // ATTENDANCE FLOW
  // ---------------------------
  if (session.step === "attendance_month_select") {
    return handleAttendanceMonthSelection(phone, session, text);
  }

  // ---------------------------
  // OCR SCAN EXAM FLOW
  // ---------------------------
  if (session.step === "await_exam_image" && type === "image") {
    try {
      const mediaId = raw.image?.id;
      const imageUrl = await getMediaUrl(mediaId);

      await sendText(phone, "⏳ Ninasoma mtihani, tafadhali subiri...");

      const result = await scanAndMarkExam(imageUrl);

      session.step = "menu";
      await setSession(phone, session);

      return sendText(phone, result);
    } catch (err) {
      console.error(err);
      return sendText(phone, "❌ Tatizo limetokea kusoma mtihani. Jaribu tena.");
    }
  }

  return "⚠️ Tafadhali chagua huduma sahihi kutoka kwenye menu.";
}

/**
 * =============================
 * STUDENT (PARENT) MENU LOGIC
 * =============================
 */
async function handleStudentMenu(cmd, session, phone) {
  switch (cmd) {
    // RESULTS
    case "1":
      session.step = "select_exam";
      await setSession(phone, session);
      return showResultsMenu(phone, session);

    // ATTENDANCE
    case "2":
      session.step = "attendance_month_select";
      await setSession(phone, session);
      return showAttendanceSummary(phone, session);

    // FEES
    case "3":
      return showFeesStatus(phone, session);

    // QUIZ / AI LEARNING (handled elsewhere)
    case "4":
      session.step = "generate_quiz";
      await setSession(phone, session);
      return "🧪 Taja topic ya quiz:";

    // ASSIGNMENTS
    case "5":
      return sendAssignments(phone, session);

    // NOTICES
    case "6":
      return sendNotices(phone, session);

    // AI TEACHER
    case "7":
      session.step = "ai_teacher";
      await setSession(phone, session);
      return "👩‍🏫 Uliza swali lolote la masomo:";

    // BOOKS
    case "8":
      return sendBooks(phone, session);

    // SCAN EXAM
    case "9":
      session.step = "await_exam_image";
      await setSession(phone, session);
      return `
📸 *SCAN EXAM MODE*

Tuma picha ya mtihani au homework:
✔ iwe clear
✔ page moja moja
✔ isiwe blur

Nitatoa:
- Majibu
- Hatua za ufumbuzi
- Marking scheme
`;

    default:
      return "❌ Chaguo sio sahihi.\n\n" + studentMenu();
  }
}

/**
 * =============================
 * TEACHER MENU LOGIC
 * =============================
 */
async function handleTeacherMenu(cmd, session, phone) {
  switch (cmd) {
    case "1":
      return "📤 Upload assignment (tayari backend)";

    case "2":
      return "📤 Upload past paper (tayari backend)";

    case "3":
      return "📢 Upload notice (tayari backend)";

    case "4":
      return "📊 Upload marks (tayari backend)";

    case "5":
      return "📥 View submissions (tayari backend)";

    case "6":
      session.step = "ai_teacher";
      await setSession(phone, session);
      return "👩‍🏫 AI Teacher mode. Uliza swali:";

    default:
      return "❌ Chaguo sio sahihi.\n\n" + teacherMenu();
  }
}
