import { createContext, useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Try to fetch profile if token exists
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }
    const fetchProfile = async () => {
      try {
        const { data } = await api.get("/auth/me");
        setUser(data.user);
      } catch {
        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const login = async (email, password, guestItems = []) => {
    try {
      const { data } = await api.post("/auth/login", { email, password, guestItems });
      const { user: u, token } = data;
      localStorage.setItem("token", token);
      setUser(u);
      return u;
    } catch (err) {
      throw err.response?.data || err;
    }
  };

  const register = async (name, email, password) => {
    try {
      const { data } = await api.post("/auth/register", { name, email, password });
      const { user: u, token } = data;
      localStorage.setItem("token", token);
      setUser(u);
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
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};