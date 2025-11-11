import { sleep, safeParse } from '../_utils';

export async function fetchUserProfile(token) {
  await sleep(150);
  try {
    const raw = localStorage.getItem('eduverse_user');
    if (raw) return JSON.parse(raw);
  } catch (e) {
    // ignore
  }
  return { username: 'dev', name: 'Developer', email: 'dev@example.com' };
}

export async function fetchUserHistory(token) {
  await sleep(120);
  return [];
}

export async function fetchOrganizedQuizzes(token) {
  await sleep(120);
  return [];
}

export async function updateUserProfile(token, updates) {
  await sleep(150);
  try {
    const raw = localStorage.getItem('eduverse_user');
    const user = raw ? JSON.parse(raw) : { username: 'dev', name: 'Developer', email: 'dev@example.com' };
    const merged = { ...user, ...updates };
    localStorage.setItem('eduverse_user', JSON.stringify(merged));
    return merged;
  } catch (e) {
    throw new Error('Failed to update profile');
  }
}

export async function deleteUserAccount(token) {
  await sleep(100);
  try { localStorage.removeItem('eduverse_user'); return { success: true }; }
  catch (e) { throw new Error('Failed to delete user'); }
}
