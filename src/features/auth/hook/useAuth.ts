import { useEffect, useState } from "react";
import { getToken, isTokenValid, getTokenInfo } from "../../../lib/token";
import type { DecodedToken } from "../../../lib/token";
import { clearAuthRelatedStorage } from "../../../lib/auth-session";

interface UseAuthReturn {
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
  user: DecodedToken | null;
  logout: () => void;
}

export const useAuth = (): UseAuthReturn => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<DecodedToken | null>(null);

  useEffect(() => {
    const checkAuth = () => {
      try {
        const currentToken = getToken();

        if (currentToken && isTokenValid(currentToken)) {
          setToken(currentToken);
          setIsAuthenticated(true);

          // Lấy thông tin user từ token
          const tokenInfo = getTokenInfo();
          setUser(tokenInfo);
        } else {
          setToken(null);
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (error) {
        console.error("Error checking auth:", error);
        setIsAuthenticated(false);
        setToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    // Lắng nghe sự thay đổi trong localStorage (từ tab khác)
    const handleStorageChange = () => {
      checkAuth();
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const logout = () => {
    clearAuthRelatedStorage();
    localStorage.removeItem("authToken");
    setToken(null);
    setIsAuthenticated(false);
    setUser(null);
  };

  return {
    isAuthenticated,
    isLoading,
    token,
    user,
    logout,
  };
};
