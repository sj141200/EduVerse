// Lightweight dev-friendly auth API stubs.
// Replace these with real API calls to your backend.

const TOKEN_KEY = "eduverse_token";

export async function loginUser({ username, password }) {
  // In dev, return a mocked token and user object.
  // TODO: replace with fetch to real backend.
  return Promise.resolve({
    token: "dev-token",
    user: { username, name: username, email: `${username}@example.com` },
  });
}

export async function registerUser({ username, name, email, password }) {
  // Return a mocked created user and token.
  return Promise.resolve({
    token: "dev-token",
    user: { username, name: name || username, email },
  });
}

export function storeToken(token) {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch (e) {
    // ignore
  }
}

export function getToken() {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch (e) {
    return null;
  }
}

export function removeToken() {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch (e) {
    // ignore
  }
}
