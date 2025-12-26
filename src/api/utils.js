import axios from "axios";

export const API_BASE = process.env.API_BASE;

// Create single axios instance for all requests
export const api = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
  headers: {
    "Accept": "application/json",
    "Content-Type": "application/json"
  }
});

// wrapper for safe requests
export async function safeRequest(fn) {
  try {
    const res = await fn();
    return { ok: true, data: res.data };
  } catch (err) {
    console.error("API ERROR:", err.response?.data || err.message);
    return {
      ok: false,
      error: err.response?.data?.message || "Server error"
    };
  }
}
