import { api, safeRequest } from "./utils.js";

export async function verifySchool(schoolName) {
  return safeRequest(() =>
    api.post(`/auth/school`, { school: schoolName })
  );
}

export async function fetchSchoolDetails(schoolId) {
  return safeRequest(() =>
    api.get(`/schools/${schoolId}`)
  );
}

export async function fetchSchoolSettings(schoolId) {
  return safeRequest(() =>
    api.get(`/schools/${schoolId}/settings`)
  );
}
