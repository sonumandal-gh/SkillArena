import { createContext, useState, useEffect, useCallback } from "react";
import authService from "../services/authService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem("token") || null);
  const [refreshToken, setRefreshToken] = useState(() => localStorage.getItem("refreshToken") || null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Logout handler
  const logout = useCallback(async () => {
    try {
      if (token) {
        await authService.logout();
      }
    } catch (err) {
      console.warn("Logout error:", err);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      setUser(null);
      setToken(null);
      setRefreshToken(null);
      setError(null);
    }
  }, [token]);

  // Load and verify current user on mount
  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      const savedToken = localStorage.getItem("token");
      if (!savedToken) {
        if (isMounted) setIsLoading(false);
        return;
      }

      try {
        const data = await authService.getMe();
        if (isMounted && data?.user) {
          setUser(data.user);
          localStorage.setItem("user", JSON.stringify(data.user));
        }
      } catch (err) {
        console.warn("Token verification failed:", err?.response?.data?.message || err.message);
        // Clear broken session
        if (isMounted) {
          logout();
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    initializeAuth();

    // Listen to global logout events dispatched by api interceptor
    const handleLogoutEvent = () => logout();
    window.addEventListener("auth:logout", handleLogoutEvent);

    return () => {
      isMounted = false;
      window.removeEventListener("auth:logout", handleLogoutEvent);
    };
  }, [logout]);

  // Login action
  const login = useCallback(async (email, password) => {
    setError(null);
    try {
      const data = await authService.login({ email, password });
      
      const { accessToken, refreshToken: newRefreshToken, user: userData } = data;

      localStorage.setItem("token", accessToken);
      if (newRefreshToken) {
        localStorage.setItem("refreshToken", newRefreshToken);
        setRefreshToken(newRefreshToken);
      }
      localStorage.setItem("user", JSON.stringify(userData));

      setToken(accessToken);
      setUser(userData);

      return { success: true, data };
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Login failed. Please check your credentials.";
      setError(msg);
      return { success: false, error: msg };
    }
  }, []);

  // Register action
  const register = useCallback(async (name, email, password) => {
    setError(null);
    try {
      const data = await authService.register({ name, email, password });
      return { success: true, data };
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Registration failed. Please try again.";
      setError(msg);
      return { success: false, error: msg };
    }
  }, []);

  // Set session directly (e.g. for OAuth redirect)
  const setSession = useCallback(async (newAccessToken, newRefreshToken) => {
    try {
      localStorage.setItem("token", newAccessToken);
      setToken(newAccessToken);

      if (newRefreshToken) {
        localStorage.setItem("refreshToken", newRefreshToken);
        setRefreshToken(newRefreshToken);
      }

      // Fetch user profile with this token
      const data = await authService.getMe();
      if (data?.user) {
        setUser(data.user);
        localStorage.setItem("user", JSON.stringify(data.user));
      }
      return { success: true };
    } catch (err) {
      console.error("Failed to establish OAuth session:", err);
      logout();
      return { success: false, error: err.message };
    }
  }, [logout]);

  // Refresh user state
  const refreshUser = useCallback(async () => {
    try {
      const data = await authService.getMe();
      if (data?.user) {
        setUser(data.user);
        localStorage.setItem("user", JSON.stringify(data.user));
      }
    } catch (err) {
      console.warn("Could not refresh user data:", err);
    }
  }, []);

  const value = {
    user,
    token,
    refreshToken,
    isAuthenticated: !!user && !!token,
    isLoading,
    error,
    login,
    register,
    logout,
    setSession,
    refreshUser,
    clearError: () => setError(null),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;

