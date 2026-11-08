
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import api from "../services/api";
import type {
  User,
  AuthResponse,
  AuthContextType,
} from "../types/auth";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(
    sessionStorage.getItem("token")
  );
  const [isLoading, setIsLoading] = useState(true);

  // Restore the user's session when the application starts.
  useEffect(() => {
    const restoreSession = async () => {
      const savedToken = sessionStorage.getItem("token");

      if (!savedToken) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await api.get<{ user: User }>("/auth/me");
        setUser(response.data.user);
        setToken(savedToken);
      } catch {
        sessionStorage.removeItem("token");
        setUser(null);
        setToken(null);
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();
  }, []);

  // Register a new account.
  const register = async (
    name: string,
    email: string,
    password: string
  ) => {
    const response = await api.post<AuthResponse>("/auth/register", {
      name,
      email,
      password,
    });

    sessionStorage.setItem("token", response.data.token);
    setToken(response.data.token);
    setUser(response.data.user);
  };

  // Log in an existing account.
  const login = async (email: string, password: string) => {
    const response = await api.post<AuthResponse>("/auth/login", {
      email,
      password,
    });

    sessionStorage.setItem("token", response.data.token);
    setToken(response.data.token);
    setUser(response.data.user);
  };

  // Log out the current user.
  const logout = () => {
    sessionStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for accessing authentication.
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
