import { sleep, makeId, safeParse } from '../_utils';

const TOKEN_KEY = 'eduverse_token';

// Dev stub: loginUser returns { token, user }
export async function loginUser({ username, password }) {
  await sleep(250);
  // In a real client, you'd POST to /auth/login and return server response.
  const user = { username, name: username, email: `${username}@example.com`, role: (username === 'teacher' || username.includes('ins')) ? 'instructor' : 'student' };
  return { token: makeId('t_'), user };
}

export async function registerUser({ username, name, email, password }) {
  await sleep(300);
  const user = { username, name: name || username, email };
  return { token: makeId('t_'), user };
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

// For convenience, expose alias names used elsewhere
export { loginUser as login, registerUser as signup };
