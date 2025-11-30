import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // 🔄 Fetch current user from backend on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await api.get("/auth/user"); // backend returns user if cookie valid
        setUser(data);
      } catch {
        setUser(null);
      }
    };
    fetchUser();
  }, []);

  const login = async (email, password, guestItems = []) => {
    const { data } = await api.post("/auth/login", { email, password, guestItems });
    setUser(data.user || data); // backend sets cookie, returns user info
  };

  const register = async (name, email, password) => {
    const { data } = await api.post("/auth/register", { name, email, password });
    setUser(data.user || data);
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout"); // backend clears cookie
    } catch (err) {
      console.warn("Logout API failed, clearing local state anyway:", err);
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};