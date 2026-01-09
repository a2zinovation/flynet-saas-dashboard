import { createContext, useContext, useState, useEffect } from "react";
import authService from "../services/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => authService.getCurrentUser());
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const result = await authService.login(email, password);
      if (result.success) {
        setUser(result.data);
      }
      return result;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await authService.logout();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const refreshToken = async () => {
    const result = await authService.refreshToken();
    return result.success;
  };

  const isSuperAdmin = () => {
    return authService.isSuperAdmin();
  };

  const getUserRole = () => {
    return authService.getUserRole();
  };

  // Auto-refresh token every 30 minutes
  useEffect(() => {
    if (user) {
      const interval = setInterval(() => {
        refreshToken();
      }, 30 * 60 * 1000); // 30 minutes

      return () => clearInterval(interval);
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, loading, isSuperAdmin, getUserRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
