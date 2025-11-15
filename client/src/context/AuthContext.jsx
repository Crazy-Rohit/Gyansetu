import { createContext, useContext, useEffect, useState } from "react";
import { loginUser, registerUser } from "../api/authApi";

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(
    () => localStorage.getItem("gs_token") || null
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      // In a real app, decode token / fetch profile
      // For now, user will be set on login/register
      localStorage.setItem("gs_token", token);
    } else {
      localStorage.removeItem("gs_token");
    }
  }, [token]);

  const handleLogin = async (identifier, password) => {
    setLoading(true);
    try {
      const data = await loginUser({ identifier, password });
      setUser(data.user);
      setToken(data.token);
      return { success: true };
    } catch (err) {
      console.error("Login error:", err);
      return {
        success: false,
        message:
          err.response?.data?.message || "Login failed. Please try again.",
      };
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (form) => {
    setLoading(true);
    try {
      const data = await registerUser(form);
      setUser(data.user);
      setToken(data.token);
      return { success: true };
    } catch (err) {
      console.error("Register error:", err);
      return {
        success: false,
        message:
          err.response?.data?.message ||
          "Registration failed. Please check details and try again.",
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  const value = {
    user,
    token,
    loading,
    login: handleLogin,
    register: handleRegister,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
