// src/auth.js
import axios from "axios";
import config from "./config.js";

/**
 * ======================
 * AXIOS INSTANCE
 * ======================
 */
const api = axios.create({
  baseURL: config.laravelUrl,
  headers: {
    "X-API-KEY": config.laravelApiKey,
    "Content-Type": "application/json"
  },
  timeout: 15000
});

/**
 * ======================
 * VERIFY SCHOOL (OPTIONAL)
 * ======================
 */
export async function verifySchool(schoolName) {
  return api.post("/verify-school", {
    school_name: schoolName
  });
}

/**
 * ======================
 * FIND STUDENT BY NAME OR USERNAME
 * ======================
 * Hutumika BEFORE password
 */
export async function findStudentByNameOrUsername(identity) {
  try {
    const res = await api.post("/bot/find-student", {
      identity
    });

    /**
     * Expected Laravel response:
     * {
     *   success: true,
     *   student: {
     *     id: 12,
     *     full_name: "EMMANUEL DISMAS ABDALLAH",
     *     username: "alpha",
     *     school_id: 3
     *   }
     * }
     */

    if (!res.data || !res.data.student) {
      return null;
    }

    return res.data.student;
  } catch (err) {
    // deliberately silent to avoid leaking system info to WhatsApp
    return null;
  }
}

/**
 * ======================
 * STUDENT LOGIN
 * ======================
 */
export async function loginStudent(username, password) {
  return api.post("/bot/login/student", {
    student_id: username,
    password
  });
}

/**
 * ======================
 * TEACHER LOGIN (OPTIONAL)
 * ======================
 */
export async function loginTeacher(teacherId, password) {
  return api.post("/bot/login/teacher", {
    teacher_id: teacherId,
    password
  });
}
