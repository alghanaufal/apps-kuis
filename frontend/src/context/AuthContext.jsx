import React, { createContext, useState, useContext } from "react";

const AuthContext = createContext();

// Membuat provider untuk menyimpan state user maupun memperbaharui state user
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  // Menyimpan data user saat login
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };
  // Menghapus data user saat log out
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };
  // set value
  const authContextValue = {
    user,
    login,
    logout,
  };

  return <AuthContext.Provider value={authContextValue}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
