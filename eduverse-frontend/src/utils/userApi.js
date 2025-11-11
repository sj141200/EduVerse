// Dev stubs for user API actions. Replace with real API client logic.

export async function fetchUserProfile(token) {
  // If a user was stored in localStorage by AuthContext, return it.
  try {
    const raw = localStorage.getItem('eduverse_user');
    if (raw) return JSON.parse(raw);
  } catch (e) {
    // ignore
  }
  // Fallback mock profile
  return { username: 'dev', name: 'Developer', email: 'dev@example.com' };
}

export async function fetchUserHistory(token) {
  // Return empty history by default for dev.
  return [];
}

export async function fetchOrganizedQuizzes(token) {
  return [];
}

export async function updateUserProfile(token, updates) {
  // merge into localStorage stored user if exists
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
  // remove stored user in dev
  try {
    localStorage.removeItem('eduverse_user');
    return { success: true };
  } catch (e) {
    throw new Error('Failed to delete user');
  }
}
