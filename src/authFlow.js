// src/authFlow.js
import {
  findStudentByNameOrUsername,
  loginStudent
} from "./auth.js";

import { setSession, getSession } from "./session.js";
import { studentMenu } from "./menu.js";

/**
 * ======================
 * STEP 1: INTRO
 * ======================
 */
export async function startAuth(phone) {
  await setSession(phone, {
    step: "ask_identity"
  });

  return (
    "👋 Karibu Smart School System\n\n" +
    "Tafadhari tuma *JINA KAMILI* la mwanafunzi\n" +
    "(mf. EMMANUEL DISMAS ABDALLAH)\n" +
    "au *USERNAME* kama unaijua."
  );
}

/**
 * ======================
 * STEP 2: CHECK IDENTITY
 * ======================
 */
export async function handleIdentity(phone, text) {
  const identity = text.trim().toUpperCase();

  const student = await findStudentByNameOrUsername(identity);

  if (!student) {
    return (
      "❌ Samahani, mwanafunzi huyu hapatikani.\n" +
      "Tafadhari hakiki jina au tuma USERNAME sahihi."
    );
  }

  // ✅ HAPA NDO KILA KITU KINAWEKWA SAWA
  await setSession(phone, {
    step: "ask_password",
    student_id: student.id,
    student_name: student.full_name,
    username: student.username,
    school_id: student.school_id
  });

  return (
    `🔐 Tafadhari tuma PASSWORD ya akaunti ya\n` +
    `*${student.full_name}*`
  );
}

/**
 * ======================
 * STEP 3: PASSWORD CHECK
 * ======================
 */
export async function handlePassword(phone, text) {
  const session = await getSession(phone);

  try {
    await loginStudent(session.username, text.trim());

    await setSession(phone, {
      step: "menu",
      role: "parent",
      student_id: session.student_id,
      student_name: session.student_name,
      school_id: session.school_id
    });

    return (
      `✅ Karibu mzazi wa *${session.student_name}*\n\n` +
      studentMenu()
    );
  } catch {
    return (
      "❌ Password sio sahihi.\n" +
      "Tafadhari jaribu tena."
    );
  }
}
