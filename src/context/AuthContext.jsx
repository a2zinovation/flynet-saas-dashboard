import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("flynet_user");
    return saved ? JSON.parse(saved) : null;
  });

  const login = (email, password) => {
    // 🔥 Demo login only — replace with API later
    if (email === "admin@flynet.com" && password === "admin123") {
      const userData = { email };
      localStorage.setItem("flynet_user", JSON.stringify(userData));
      setUser(userData);
      return { success: true };
    }
    return { success: false, message: "Invalid credentials" };
  };

  const logout = () => {
    localStorage.removeItem("flynet_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
