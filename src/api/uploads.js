import { api, safeRequest } from "./utils.js";

// NOTE: payload must be FormData (file upload)

export async function uploadAssignmentFile(studentId, formData) {
  return safeRequest(() =>
    api.post(`/students/${studentId}/upload-assignment`, formData, {
      headers: { "Content-Type": "multipart/form-data" }
    })
  );
}

export async function uploadExamScan(studentId, formData) {
  return safeRequest(() =>
    api.post(`/students/${studentId}/scan-exam`, formData, {
      headers: { "Content-Type": "multipart/form-data" }
    })
  );
}

export async function uploadBook(teacherId, formData) {
  return safeRequest(() =>
    api.post(`/teachers/${teacherId}/upload-book`, formData, {
      headers: { "Content-Type": "multipart/form-data" }
    })
  );
}

export async function uploadPastPaper(teacherId, formData) {
  return safeRequest(() =>
    api.post(`/teachers/${teacherId}/upload-pastpaper`, formData, {
      headers: { "Content-Type": "multipart/form-data" }
    })
  );
}
