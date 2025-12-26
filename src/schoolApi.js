import axios from "axios";
import config from "./config.js";


const api = axios.create({
baseURL: config.laravelUrl,
headers: { Authorization: `Bearer ${config.laravelApiKey}`, Accept: "application/json" },
timeout: 15000
});


export async function getState(phone) {
const res = await api.post("/bot/get-state", { phone });
return res.data;
}


export async function setState(phone, payload) {
const res = await api.post("/bot/set-state", { phone, ...payload });
return res.data;
}


export async function loginUser(school, userId, password) {
const res = await api.post("/bot/login", { school, user_id: userId, password });
return res.data;
}


export async function fetchResults(studentId, examNumber) {
const res = await api.post(`/bot/results`, { student_id: studentId, exam_number: examNumber });
return res.data;
}


export async function searchBook(query) {
const res = await api.post(`/bot/book-search`, { book: query });
return res.data;
}


export async function scanExam(imageUrl, studentId) {
const res = await api.post(`/bot/scan-exam`, { image_url: imageUrl, student_id: studentId });
return res.data;
}

// (append to src/schoolApi.js)

export async function fetchAttendance(studentId) {
  // GET /bot/attendance?student_id=...
  const res = await api.get(`/bot/attendance`, { params: { student_id: studentId } });
  return res.data;
}

export async function fetchFees(studentId) {
  const res = await api.get(`/bot/fees`, { params: { student_id: studentId } });
  return res.data;
}

export async function fetchAssignments(studentId) {
  const res = await api.get(`/bot/assignments`, { params: { student_id: studentId } });
  return res.data;
}


export default api;