import { api, safeRequest } from "./utils.js";

export async function verifySchool(schoolName) {
  return safeRequest(() =>
    api.post(`/auth/school`, { school: schoolName })
  );
}

export async function loginStudent(studentId, password) {
  return safeRequest(() =>
    api.post(`/auth/student`, { studentId, password })
  );
}

export async function loginTeacher(teacherId, password) {
  return safeRequest(() =>
    api.post(`/auth/teacher`, { teacherId, password })
  );
}
