import axios from "axios";
import { API_BASE } from "./utils.js";

export function getPastPapers(className, token) {
  return axios.get(`${API_BASE}/v1/exams/past-papers/${className}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
}

export function getSolutions(examId, token) {
  return axios.get(`${API_BASE}/v1/exams/${examId}/solutions`, {
    headers: { Authorization: `Bearer ${token}` }
  });
}

export function scanExamImage(token, payload) {
  return axios.post(`${API_BASE}/v1/exams/scan`, payload, {
    headers: { Authorization: `Bearer ${token}` }
  });
}
