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

export async function apiFetch(path, { method = 'GET', body = null, token = null, headers = {} } = {}) {
  const url = `${API_BASE}${path}`;
  const opts = { method, headers: { ...headers } };
  if (token) opts.headers['Authorization'] = `Bearer ${token}`;
  if (body) {
    if (body instanceof FormData) {
      opts.body = body;
    } else {
      opts.headers['Content-Type'] = 'application/json';
      opts.body = JSON.stringify(body);
    }
  }
  const res = await fetch(url, opts);
  const text = await res.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch (e) { data = text; }
  if (!res.ok) {
    const err = (data && data.error) ? data.error : (data && data.message) ? data.message : res.statusText;
    throw new Error(err || 'Request failed');
  }
  return data;
}
