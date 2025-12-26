// authFlow.js
import { verifySchool, loginStudent, loginTeacher } from "./auth.js";
import { getSession, setSession } from "./session.js";

export async function startAuth(phone) {
    const s = await getSession(phone);
    s.step = "ask_school";
    await setSession(phone, s);

    return "🏫 *Taja jina la shule*:\n\nMfano: *Kisutu Secondary*";
}

export async function handleSchool(phone, text) {
    const s = await getSession(phone);
    s.school = text.trim();

    const res = await verifySchool(s.school).catch(() => null);

    if (!res || !res.data?.exists) {
        return "⚠️ Shule haijapatikana. Jaribu tena.";
    }

    s.step = "ask_userid";
    await setSession(phone, s);

    return "🆔 *Tuma Student ID au Teacher ID*";
}

export async function handleUserId(phone, text) {
    const s = await getSession(phone);
    s.userId = text.trim();

    s.step = "ask_password";
    await setSession(phone, s);

    return "🔑 *Tuma password*";
}

export async function handlePassword(phone, text) {
    const s = await getSession(phone);
    s.password = text.trim();

    // Try student login
    let student = await loginStudent(s.userId, s.password).catch(() => null);

    if (student?.data?.success) {
        s.role = "student";
        s.student_id = s.userId;
        s.step = "menu";
        await setSession(phone, s);
        return "✅ *Student login successful*\n\n" + studentMenu();
    }

    // Try teacher login
    let teacher = await loginTeacher(s.userId, s.password).catch(() => null);

    if (teacher?.data?.success) {
        s.role = "teacher";
        s.teacher_id = s.userId;
        s.step = "menu";
        await setSession(phone, s);
        return "✅ *Teacher login successful*\n\n" + teacherMenu();
    }

    return "❌ ID au Password sio sahihi. Jaribu tena.";
}
