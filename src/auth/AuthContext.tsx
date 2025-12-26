import { createContext, useContext, useMemo, useState } from "react";

interface AuthContextValue {
  isLoggedIn: boolean;
  login: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const login = () =>
    new Promise<void>((resolve) => {
      setTimeout(() => {
        setIsLoggedIn(true);
        resolve();
      }, 500);
    });

  const logout = () => setIsLoggedIn(false);

  const value = useMemo(() => ({ isLoggedIn, login, logout }), [isLoggedIn]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
