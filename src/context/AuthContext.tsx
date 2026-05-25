"use client";
import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
} from "react";
import { authApi } from "@/lib/api/auth"; // Make sure your axios instance has withCredentials: true
import type { User, LoginPayload } from "@/types/index";

type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean; // Added to handle the initial flash before /me finishes
};

type AuthAction =
  | { type: "LOGIN"; payload: { user: User } }
  | { type: "LOGOUT" }
  | { type: "INITIALIZE"; payload: { user: User | null } };

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "LOGIN":
      return {
        user: action.payload.user,
        isAuthenticated: true,
        isLoading: false,
      };
    case "LOGOUT":
      return { user: null, isAuthenticated: false, isLoading: false };
    case "INITIALIZE":
      return {
        user: action.payload.user,
        isAuthenticated: !!action.payload.user,
        isLoading: false,
      };
    default:
      return state;
  }
}

type AuthContextType = {
  state: AuthState;
  login: (data: LoginPayload) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    isAuthenticated: false,
    isLoading: true, // Start loading as true while we check the /me endpoint
  });

  // 1. Check session on initial load
  useEffect(() => {
    async function loadUser() {
      try {
        // This request will automatically send the HttpOnly access token cookie
        const res = await authApi.getMe();
        console.log("User loaded:", res.data);
        dispatch({ type: "INITIALIZE", payload: { user: res.data.data } });
      } catch (error) {
        // If it fails (401), the user isn't logged in.
        // Axios interceptor will handle token refresh if needed!
        dispatch({ type: "INITIALIZE", payload: { user: null } });
      }
    }
    loadUser();
  }, []);

  // 2. Login Flow
  const login = useCallback(async (data: LoginPayload) => {
    const res = await authApi.login(data);

    // The backend set the cookies, we just care about the user data now
    const user = res.data.data;

    dispatch({ type: "LOGIN", payload: { user } });
  }, []);

  // 3. Logout Flow
  const logout = useCallback(async () => {
    try {
      // Tell the backend to clear the HttpOnly cookies
      await authApi.logout();
    } catch (e) {
      console.error(e);
    } finally {
      dispatch({ type: "LOGOUT" });
      // Optional: Redirect to login page
      // window.location.href = '/login';
    }
  }, []);

  return (
    <AuthContext.Provider value={{ state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
};
