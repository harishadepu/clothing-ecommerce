import { createContext, useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  useEffect(()=>{
    if(!user){
      navigate("/login");
    }
  },[user])

  const login = async (email, password, guestItems = []) => {
    try {
      const { data } = await api.post("/auth/login", { email, password, guestItems });
      const u = data?.user ?? data;
      console.log(u)
      setUser(u);
      return u;
    } catch (err) {
      throw err.response?.data || err;
    }
  };

  const register = async (name, email, password) => {
    try {
      const { data } = await api.post("/auth/register", { name, email, password });
      const u = data?.user ?? data;
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
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};