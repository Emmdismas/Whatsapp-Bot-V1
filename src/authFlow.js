// src/authFlow.js
import { loginStudent, loginTeacher } from "./auth.js";
import { setSession } from "./session.js";

export async function startAuth(phone) {
  await setSession(phone, {
    step: "ask_userid"
  });

  return "👤 Tuma USER ID yako:";
}

export async function handleUserId(phone, text) {
  const session = {
    step: "ask_password",
    user_id: text.trim()
  };

  await setSession(phone, session);
  return "🔐 Tuma PASSWORD yako:";
}

export async function handlePassword(phone, text) {
  const session = await import("./session.js").then(m => m.getSession(phone));

  try {
    // jaribu student kwanza
    const res = await loginStudent(session.user_id, text.trim());

    await setSession(phone, {
      step: "menu",
      role: "student",
      student_id: res.data.student.id,
      school_id: res.data.student.school_id
    });

    return "✅ Login successful\n\n" + (await import("./menu.js")).studentMenu();
  } catch {
    // kama sio student, jaribu teacher
    try {
      const res = await loginTeacher(session.user_id, text.trim());

      await setSession(phone, {
        step: "menu",
        role: "teacher",
        teacher_id: res.data.teacher.id,
        school_id: res.data.teacher.school_id
      });

      return "✅ Login successful\n\n" + (await import("./menu.js")).teacherMenu();
    } catch {
      return "❌ USER ID au PASSWORD sio sahihi.";
    }
  }
}
