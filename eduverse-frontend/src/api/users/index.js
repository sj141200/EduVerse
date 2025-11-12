import { apiFetch } from '../_utils';

export async function fetchUserProfile(token) {
  const t = token || undefined;
  return apiFetch('/auth/me', { method: 'GET', token: t });
}

export async function fetchUserHistory(token) {
  // backend route not implemented yet; return empty for now
  return [];
}

export async function fetchOrganizedQuizzes(token) {
  // backend route not implemented yet; return empty for now
  return [];
}

export async function updateUserProfile(token, updates) {
  const t = token || undefined;
  // A user update endpoint isn't implemented in the backend yet; if added, call it here.
  return apiFetch('/users/me', { method: 'PUT', body: updates, token: t });
}

export async function deleteUserAccount(token) {
  const t = token || undefined;
  return apiFetch('/users/me', { method: 'DELETE', token: t });
}
