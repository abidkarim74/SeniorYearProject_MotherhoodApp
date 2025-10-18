import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import Cookies from "js-cookie";
import { type AuthUser } from "../interfaces/AuthInterfaces";
import { getRequest } from "../api/requests";
import api from "../api/axios_instance";


type AuthContextType = {
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
  mainLoading: boolean;
  user: AuthUser | null;
  setUser: (value: AuthUser | null) => void;
  setLoading: (value: boolean) => void;
  logout: () => void;
};

// Create the context with a default value of null or undefined
const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [mainLoading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<AuthUser | null>(null);

  /** 🔹 Refresh Access Token */
  const refreshAccessToken = async (): Promise<string | null> => {
    try {
      const response = await api.post("/auth/refresh-token", {});
      const token = response.data;
      if (token) {
        setAccessToken(token);
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        return token;
      }
      return null;
    } catch (err) {
      console.error("Failed to refresh token:", err);
      logout();
      return null;
    }
  };

  /** 🔹 Get authenticated user */
  const fetchAuthenticatedUser = async (): Promise<AuthUser | null> => {
    try {
      const response = await getRequest("/auth/auth-user");
      return response.data;
    } catch (error) {
      console.error("Failed to fetch authenticated user:", error);
      return null;
    }
  };

  /** 🔹 Logout */
  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Logout API call failed:", error);
    } finally {
      setAccessToken(null);
      setUser(null);
      delete api.defaults.headers.common["Authorization"];
      
      // Clear any stored tokens or cookies
      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");
    }
  };

  /** 🔹 Axios interceptor */
  useEffect(() => {
    const interceptor = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        if (
          error.response?.status === 401 &&
          !originalRequest._retry &&
          !originalRequest.url.includes("/auth/refresh-token")
        ) {
          originalRequest._retry = true;
          const newToken = await refreshAccessToken();
          if (newToken) {
            originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
            return api(originalRequest);
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.response.eject(interceptor);
    };
  }, []);

  /** 🔹 Sync headers */
  useEffect(() => {
    if (accessToken) {
      api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
    } else {
      delete api.defaults.headers.common["Authorization"];
    }
  }, [accessToken]);

  /** 🔹 On mount: always try to refresh using cookie */
  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = await refreshAccessToken();
        if (token) {
          const userData = await fetchAuthenticatedUser();
          setUser(userData);
        }
      } catch (error) {
        console.error("Auth initialization failed:", error);
      } finally {
        setLoading(false);
      }
    };
    
    initAuth();
  }, []);

  // Create the context value object
  const contextValue: AuthContextType = {
    mainLoading,
    user,
    setUser,
    setLoading,
    accessToken,
    setAccessToken,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}