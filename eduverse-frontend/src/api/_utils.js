// Lightweight helpers used by the dev API stubs
export function sleep(ms = 300) {
  return new Promise((res) => setTimeout(res, ms));
}

export function makeId(prefix = '') {
  return `${prefix}${Date.now().toString(36)}${Math.random().toString(36).slice(2,7)}`;
}

export function safeParse(raw, fallback) {
  try {
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
}

// API helpers
export const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000';
import axios from 'axios'

// axios instance configured for API base and CORS-friendly options
const axiosInstance = axios.create({
  baseURL: API_BASE,
  headers: {
    Accept: 'application/json',
  },
  // allow sending cookies / credentials for cross-site requests when needed
  withCredentials: true,
})

// Request helper to match previous apiFetch behavior but using axios
export async function apiFetch(path, { method = 'GET', body = null, token = null, headers = {} } = {}) {
  const opts = {
    url: path,
    method: method.toLowerCase(),
    headers: { ...headers },
  }

  if (token) {
    opts.headers = opts.headers || {}
    opts.headers['Authorization'] = `Bearer ${token}`
  }

  if (body) {
    if (body instanceof FormData) {
      // let axios set the correct multipart headers
      opts.data = body
    } else {
      opts.headers['Content-Type'] = 'application/json'
      opts.data = body
    }
  }

  try {
    const resp = await axiosInstance.request(opts)
    return resp.data
  } catch (err) {
    // Normalize error similar to previous apiFetch throwing an Error
    if (err.response) {
      const d = err.response.data
      const message = (d && (d.error || d.message)) || err.response.statusText || String(err.message)
      throw new Error(message)
    }
    throw new Error(err.message || 'Request failed')
  }
}
