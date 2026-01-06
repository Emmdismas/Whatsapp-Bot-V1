// src/router.js
import { startAuth, handleIdentity, handlePassword } from "./authFlow.js";
import { studentMenu, teacherMenu } from "./menu.js";
import { getSession, setSession } from "./session.js";

// RESULTS
import {
  showResultsMenu,
  handleExamSelection,
  sendExamResults,
} from "./handlers/results.js";

// ATTENDANCE
import {
  showAttendanceSummary,
  handleAttendanceMonthSelection,
} from "./handlers/attendance.js";

// FEES
import { showFeesSummary, showFeesDetails } from "./handlers/fees.js";

// ASSIGNMENTS
import {
  showAssignmentsList,
  sendAssignmentFile,
} from "./handlers/assignments.js";

// BOOKS
import { showBooksList, sendBookFile } from "./handlers/books.js";

// NOTICES
import { showNoticesList, sendNotice } from "./handlers/notices.js";

// OCR
import { scanAndMarkExam } from "./ai.js";
import { getMediaUrl } from "./utils/media.js";

export async function handleIncoming({ from, text, type, raw }) {
  const phone = from;

  // 1. SESSION
  let session = await getSession(phone);
  if (!session) {
    return startAuth(phone);
  }

  // 2. AUTH FLOW
  if (session.step === "ask_userid") {
    return handleIdentity(phone, text);
  }

  if (session.step === "ask_password") {
    return handlePassword(phone, text);
  }

  // 3. MENU
  if (session.step === "menu") {
    const cmd = text?.trim();

    if (session.role === "student") {
      return handleStudentMenu(cmd, session, phone);
    }

    if (session.role === "teacher") {
      return handleTeacherMenu(cmd, session, phone);
    }

    return "⚠️ Tafadhali chagua chaguo sahihi.";
  }

  // RESULTS
  if (session.step === "select_exam") {
    return handleExamSelection(phone, session, text);
  }

  if (session.step === "view_results") {
    return sendExamResults(phone, session, text);
  }

  // ATTENDANCE
  if (session.step === "attendance_month_select") {
    return handleAttendanceMonthSelection(phone, session, text);
  }

  // ASSIGNMENTS
  if (session.step === "select_assignment") {
    return sendAssignmentFile(phone, session, text);
  }

  // BOOKS
  if (session.step === "select_book") {
    return sendBookFile(phone, session, text);
  }

  // NOTICES
  if (session.step === "select_notice") {
    return sendNotice(phone, session, text);
  }

  // FEES
  if (session.step === "view_fees_details") {
    if (text?.toLowerCase() === "yes") {
      return showFeesDetails(phone, session);
    }

    session.step = "menu";
    await setSession(phone, session);
    return "➡️ Umerudi kwenye menu.\n\n" + studentMenu();
  }

  // OCR
  if (session.step === "await_exam_image") {
    if (type !== "image") {
      return "📸 Tafadhali tuma picha ya mtihani.";
    }

    try {
      const mediaId = raw.image?.id;
      const imageUrl = await getMediaUrl(mediaId);

      session.step = "processing_exam";
      await setSession(phone, session);

      const result = await scanAndMarkExam(imageUrl);

      session.step = "menu";
      await setSession(phone, session);

      return result;
    } catch {
      return "❌ Imeshindikana kusoma mtihani. Jaribu tena.";
    }
  }

 // ============================
// FALLBACK (SAFE)
// ============================
if (session.step === "ask_userid") {
  return (
    "❌ Jina au username haijatambuliwa.\n" +
    "Tafadhali tuma *JINA KAMILI* la mwanafunzi tena."
  );
}

if (session.step === "ask_password") {
  return "🔐 Tafadhali tuma PASSWORD sahihi ya akaunti.";
}

// Only fallback to menu IF already authenticated
session.step = "menu";
await setSession(phone, session);
return "⚠️ Chaguo halijatambuliwa.\n\n" + studentMenu();

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
      session.step = "view_fees_summary";
      await setSession(phone, session);
      return showFeesSummary(phone, session);

    // QUIZ / AI LEARNING (handled elsewhere)
    case "4":
      session.step = "generate_quiz";
      await setSession(phone, session);
      return "🧪 Taja topic ya quiz:";

    // ASSIGNMENTS
    case "5":
      session.step = "select_assignment";
      await setSession(phone, session);
      return showAssignmentsList(phone, session);

    // NOTICES
    case "6":
      session.step = "select_notice";
      await setSession(phone, session);
      return showNoticesList(phone, session);

    // AI TEACHER
    case "7":
      session.step = "ai_teacher";
      await setSession(phone, session);
      return "👩‍🏫 Uliza swali lolote la masomo:";

    // BOOKS
    case "8":
      session.step = "select_book";
      await setSession(phone, session);
      return showBooksList(phone, session);

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
