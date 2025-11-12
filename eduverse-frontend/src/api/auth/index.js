import { apiFetch } from '../_utils';

const TOKEN_KEY = 'eduverse_token';

export async function loginUser({ username, password, role } = {}) {
  // If role provided, use role-specific endpoint to ensure server enforces role
  const endpoint = role === 'instructor' ? '/auth/login/instructor' : role === 'student' ? '/auth/login/student' : '/auth/login';
  const body = role ? { username, password, role } : { username, password };
  const data = await apiFetch(endpoint, { method: 'POST', body });
  return data;
}

export async function registerUser({ username, name, email, password, role } = {}) {
  const endpoint = role === 'instructor' ? '/auth/register/instructor' : role === 'student' ? '/auth/register/student' : '/auth/register';
  const body = role ? { username, name, email, password, role } : { username, name, email, password };
  const data = await apiFetch(endpoint, { method: 'POST', body });
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
