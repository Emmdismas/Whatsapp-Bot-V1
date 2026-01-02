import axios from "axios";
import { API_BASE } from "./utils.js";


export async function getStudentExams(studentId) {
  const res = await axios.get(
    `${API_BASE}/students/${studentId}/exams`
  );
  return res.data || [];
}

export async function getExamResults(studentId, examId) {
  const res = await axios.get(
    `${API_BASE}/students/${studentId}/results/${examId}`
  );
  return res.data;
}


/* RESULTS */
export async function getStudentExams(studentId) {
  const res = await axios.get(`${API_BASE}/students/${studentId}/exams`);
  return res.data || [];
}

export async function getExamResults(studentId, examId) {
  const res = await axios.get(
    `${API_BASE}/students/${studentId}/results/${examId}`
  );
  return res.data;
}

/* ATTENDANCE */
export async function getAttendanceSummary(studentId) {
  const res = await axios.get(
    `${API_BASE}/attendance/${studentId}/summary`
  );
  return res.data;
}

export async function getMonthlyAttendance(studentId, month) {
  const res = await axios.get(
    `${API_BASE}/attendance/${studentId}/month/${month}`
  );
  return res.data;
}


// FEES
export async function getFeesSummary(studentId) {
  const res = await axios.get(
    `${API_BASE}/students/${studentId}/fees/summary`
  );
  return res.data;
}

export async function getFeesDetails(studentId) {
  const res = await axios.get(
    `${API_BASE}/students/${studentId}/fees/details`
  );
  return res.data;
}

// ASSIGNMENTS
export async function getAssignments(studentId) {
  const res = await axios.get(
    `${API_BASE}/students/${studentId}/assignments`
  );
  return res.data;
}

export async function downloadAssignment(assignmentId) {
  const res = await axios.get(
    `${API_BASE}/assignments/${assignmentId}/download`
  );
  return res.data;
}
