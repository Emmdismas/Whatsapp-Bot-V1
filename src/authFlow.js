import { loginStudent, loginTeacher } from "./auth.js";
import { getSession, setSession } from "./session.js";
import { studentMenu, teacherMenu } from "./menu.js";

export async function startAuth(phone) {
    const s = await getSession(phone);
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
    const password = text.trim();

    // Try student
    const student = await loginStudent(s.userId, password).catch(() => null);

    if (student?.data?.success) {
        s.step = "menu";
        s.role = "student";
        s.student_id = s.userId;
        s.school_id = student.data.school_id;
        s.school_name = student.data.school_name;

        await setSession(phone, s);

        return `✅ *Karibu ${student.data.student_name}*\n🏫 ${s.school_name}\n\n${studentMenu()}`;
    }

    // Try teacher
    const teacher = await loginTeacher(s.userId, password).catch(() => null);

    if (teacher?.data?.success) {
        s.step = "menu";
        s.role = "teacher";
        s.teacher_id = s.userId;
        s.school_id = teacher.data.school_id;
        s.school_name = teacher.data.school_name;

        await setSession(phone, s);

        return `✅ *Karibu Mwalimu ${teacher.data.teacher_name}*\n🏫 ${s.school_name}\n\n${teacherMenu()}`;
    }

    // Reset flow
    s.step = "ask_userid";
    await setSession(phone, s);

    return "❌ ID au Password sio sahihi.\n\n🆔 Tafadhali tuma tena Student ID au Teacher ID:";
}
