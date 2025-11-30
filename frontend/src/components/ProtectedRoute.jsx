import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

// Wrapper for routes that require authentication
export default function ProtectedRoute({ children }) {
  const { user } = useContext(AuthContext);

  // If no user, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Otherwise render the protected page
  return children;
}