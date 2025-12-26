import axios from "axios";
import { API_BASE } from "./utils.js";

export function uploadNotice(token, payload) {
  return axios.post(`${API_BASE}/v1/teacher/notices`, payload, {
    headers: { Authorization: `Bearer ${token}` }
  });
}

export function uploadPastPaper(token, payload) {
  return axios.post(`${API_BASE}/v1/teacher/past-papers`, payload, {
    headers: { Authorization: `Bearer ${token}` }
  });
}

export function uploadSolution(token, payload) {
  return axios.post(`${API_BASE}/v1/teacher/solutions`, payload, {
    headers: { Authorization: `Bearer ${token}` }
  });
}
