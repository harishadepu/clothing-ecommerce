import { createContext, useState, useEffect } from "react";
import api from "../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // loading for initial fetch

  // Fetch current user on mount (cookie-based session)
  const loadUser = async () => {
    try {
      const { data } = await api.get("/auth/user");
      setUser(data); // backend should return full user object
    } catch {
      setUser(null);
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
      setUser(data.user); // consistent shape
      return data.user;
    } catch (err) {
      throw err.response?.data || err;
    }
  };

  const register = async (name, email, password) => {
    try {
      const { data } = await api.post("/auth/register", { name, email, password });
      setUser(data.user);
      return data.user;
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
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
