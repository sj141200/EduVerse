import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { loginUser, registerUser, storeToken, getToken, removeToken } from "../api/auth";
import { fetchUserProfile } from "../api/users";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("eduverse_user");
    if (!stored || stored === "undefined") return null;
    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(getToken());
  const [loading, setLoading] = useState(false);

  // On mount, check for token and set user if needed (optional: decode token for user info)
  useEffect(() => {
    if (!token) {
      setUser(null);
      localStorage.removeItem("eduverse_user");
    }
    // else: keep user as is (from login/register or localStorage)
  }, [token]);

  const login = useCallback(async (username, password) => {
    setLoading(true);
    try {
      const res = await loginUser({ username, password });
      storeToken(res.token);
      setToken(res.token);
      
      // Fetch user profile after successful login
      try {
        const userProfile = await fetchUserProfile(res.token);
        setUser(userProfile);
        localStorage.setItem("eduverse_user", JSON.stringify(userProfile));
      } catch (profileError) {
        console.warn("Failed to fetch user profile:", profileError.message);
        // Still consider login successful even if profile fetch fails
        setUser(res.user || null);
        if (res.user) {
          localStorage.setItem("eduverse_user", JSON.stringify(res.user));
        }
      }
      
      setLoading(false);
      return { success: true };
    } catch (err) {
      setLoading(false);
      return { success: false, error: err.message };
    }
  }, []);

  const register = useCallback(async (username, name, email, password) => {
    setLoading(true);
    try {
      const res = await registerUser({ username, name, email, password });
      storeToken(res.token);
      setToken(res.token);
      if (res.user) {
        setUser(res.user);
        localStorage.setItem("eduverse_user", JSON.stringify(res.user));
      } else {
        setUser(null);
        localStorage.removeItem("eduverse_user");
      }
      setLoading(false);
      return { success: true };
    } catch (err) {
      setLoading(false);
      return { success: false, error: err.message };
    }
  }, []);

  const logout = useCallback(() => {
    removeToken();
    setToken(null);
    setUser(null);
    localStorage.removeItem("eduverse_user");
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
