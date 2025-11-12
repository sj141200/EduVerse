import { apiFetch } from '../_utils';

const TOKEN_KEY = 'eduverse_token';

export async function loginUser({ username, password }) {
  const data = await apiFetch('/auth/login', { method: 'POST', body: { username, password } });
  return data;
}

export async function registerUser({ username, name, email, password }) {
  const data = await apiFetch('/auth/register', { method: 'POST', body: { username, name, email, password } });
  return data;
}

export function storeToken(token) {
  try { localStorage.setItem(TOKEN_KEY, token); } catch (e) { /* ignore */ }
}

export function getToken() {
  try { return localStorage.getItem(TOKEN_KEY); } catch (e) { return null; }
}

export function removeToken() {
  try { localStorage.removeItem(TOKEN_KEY); } catch (e) { /* ignore */ }
}

export { loginUser as login, registerUser as signup };
