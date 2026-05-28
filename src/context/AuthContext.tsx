"use client";
import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { authApi } from "@/lib/api/auth"; // Make sure your axios instance has withCredentials: true
import type { User, LoginPayload } from "@/types/index";

// =========================
// TYPES
// =========================

type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
};

type AuthAction =
  | { type: "LOGIN"; payload: { user: User } }
  | { type: "LOGOUT" }
  | { type: "INITIALIZE"; payload: { user: User | null } };

type AuthContextType = {
  state: AuthState;
  login: (data: LoginPayload) => Promise<void>;
  logout: () => Promise<void>;
};

// =========================
// REDUCER
// =========================

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

// =========================
// CONTEXT
// =========================

const AuthContext = createContext<AuthContextType | null>(null);

// =========================
// PROVIDER
// =========================

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    isAuthenticated: false,
    isLoading: true, // Start loading as true while we check the /me endpoint
  });

  // -------------------------------------------------------
  // 1. CHECK SESSION on mount
  //    Sends the HttpOnly cookie automatically — axios must
  //    have withCredentials: true on the instance.
  // -------------------------------------------------------
  useEffect(() => {
    async function loadUser() {
      try {
        const res = await authApi.getMe();
        dispatch({ type: "INITIALIZE", payload: { user: res.data } });
      } catch {
        // 401 → not logged in (interceptor handles token refresh if configured)
        dispatch({ type: "INITIALIZE", payload: { user: null } });
      }
    }
    loadUser();
  }, []);

  // -------------------------------------------------------
  // 2. LOGIN
  //    Cart migration is handled by CartContext watching
  //    user?.id, so nothing cart-related belongs here.
  // -------------------------------------------------------
  const login = useCallback(async (data: LoginPayload) => {
    const res = await authApi.login(data);
    // FIX: unwrap to the actual user object your API returns
    const user: User = res.data.data.data;
    // FIX: payload must match { user: User }
    dispatch({ type: "LOGIN", payload: { user } });
  }, []);

  // -------------------------------------------------------
  // 3. LOGOUT
  //    Cart reset is handled by CartContext watching user?.id.
  // -------------------------------------------------------
  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch (e) {
      console.error("Logout API error:", e);
    } finally {
      dispatch({ type: "LOGOUT" });
    }
  }, []);

  // -------------------------------------------------------
  // 4. MEMOIZED VALUE — prevents all consumers re-rendering
  //    on unrelated state changes.
  // -------------------------------------------------------
  const value = useMemo(
    () => ({ state, login, logout }),
    [state, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
};
