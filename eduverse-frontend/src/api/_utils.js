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
