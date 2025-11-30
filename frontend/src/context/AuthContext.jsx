import { createContext, useState, useEffect } from "react";
import api from "../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem("user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  // Helper: persist user to localStorage
  const persistUser = (u) => {
    setUser(u ?? null);
    try {
      if (u) {
        localStorage.setItem("user", JSON.stringify(u));
      } else {
        localStorage.removeItem("user");
      }
    } catch {
      /* ignore storage errors */
    }
  };

  // Fetch current user on mount (cookie-based session)
  const loadUser = async () => {
    try {
      const { data } = await api.get("/auth/user");
      console.debug("Fetched user (auth/user):", data);
      const u = data?.user ?? data;
      persistUser(u);
    } catch (err) {
      console.warn("Failed to fetch user:", err);
      persistUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  const login = async (email, password, guestItems = []) => {
    try {
      const { data } = await api.post("/auth/login", { email, password, guestItems });
      console.debug("Login response:", data);
      const u = data?.user ?? data;
      persistUser(u);
      return u;
    } catch (err) {
      throw err.response?.data || err;
    }
  };

  const register = async (name, email, password) => {
    try {
      const { data } = await api.post("/auth/register", { name, email, password });
      console.debug("Register response:", data);
      const u = data?.user ?? data;
      persistUser(u);
      return u;
    } catch (err) {
      throw err.response?.data || err;
    }
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (err) {
      console.warn("Logout failed:", err);
    }
    persistUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};