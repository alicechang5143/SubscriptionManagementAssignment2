import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const login = (payload) => {
    const userData = payload?.data || payload;
    const authUser = {
      id: userData.id,
      name: userData.name,
      email: userData.email,
      role: userData.role || "user",
      university: userData.university || "",
      address: userData.address || "",
    };

    localStorage.setItem("user", JSON.stringify(authUser));
    localStorage.setItem("token", userData.token);
    setUser(authUser);
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
