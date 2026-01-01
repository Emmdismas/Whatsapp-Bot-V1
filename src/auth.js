// src/auth.js
import axios from "axios";
import config from "./config.js";

/**
 * ======================
 * VERIFY SCHOOL (OPTIONAL)
 * ======================
 * Kama hutaki tena kuuliza shule, hii function unaweza hata kuiacha
 */
export async function verifySchool(schoolName) {
  return axios.post(
    `${config.laravelUrl}/verify-school`,
    { school_name: schoolName },
    {
      headers: {
        "X-API-KEY": config.laravelApiKey
      }
    }
  );
}

/**
 * ======================
 * STUDENT LOGIN
 * ======================
 */
export async function loginStudent(studentId, password) {
  return axios.post(
    `${config.laravelUrl}/bot/login/student`,
    {
      student_id: studentId,
      password
    },
    {
      headers: {
        "X-API-KEY": config.laravelApiKey
      }
    }
  );
}

/**
 * ======================
 * TEACHER LOGIN
 * ======================
 */
export async function loginTeacher(teacherId, password) {
  return axios.post(
    `${config.laravelUrl}/bot/login/teacher`,
    {
      teacher_id: teacherId,
      password
    },
    {
      headers: {
        "X-API-KEY": config.laravelApiKey
      }
    }
  );
}
