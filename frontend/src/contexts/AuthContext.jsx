import { createContext, useEffect, useState } from "react";
import * as auth from "../services/auth";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("jwt");

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    auth
      .getCurrentUser(token)
      .then((user) => {
        setCurrentUser(user);
        setLoggedIn(true);
      })
      .catch((err) => {
        console.error(err);
        localStorage.removeItem("jwt");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [token]);

  const handleLogin = (user, tokenValue) => {
    localStorage.setItem("jwt", tokenValue);
    setCurrentUser(user);
    setLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    setCurrentUser(null);
    setLoggedIn(false);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        loggedIn,
        loading,
        setCurrentUser,
        handleLogin,
        handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}