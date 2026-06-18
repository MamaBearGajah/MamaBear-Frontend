"use client";
import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { authApi } from "@/lib/api/auth";
import type { User, LoginPayload } from "@/types/index";

// ─── Types ────────────────────────────────────────────────────────────────────

type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
};

type AuthAction =
  | { type: "LOGIN"; payload: User }
  | { type: "LOGOUT" }
  | { type: "INITIALIZE"; payload: User | null };

type AuthContextType = {
  state: AuthState;
  login: (data: LoginPayload) => Promise<void>;
  logout: () => Promise<void>;
};

// ─── Reducer ──────────────────────────────────────────────────────────────────

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "LOGIN":
      return { user: action.payload, isAuthenticated: true, isLoading: false };
    case "LOGOUT":
      return { user: null, isAuthenticated: false, isLoading: false };
    case "INITIALIZE":
      return { user: action.payload, isAuthenticated: !!action.payload, isLoading: false };
    default:
      return state;
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // ─── Init: cek session via GET /users/me ──────────────────────────────────
  // Kalau accessToken expired, apiClient interceptor otomatis hit POST /auth/refresh
  // (pakai refreshToken cookie) lalu retry request ini.
  useEffect(() => {
    async function loadUser() {
      try {
        const res = await authApi.getMe();
        // FIX: Backend return { success, data: { id, name, ... } }
        // res.data = { success, data: User } — ambil res.data.data
        const user = res.data?.data ?? res.data;
        dispatch({ type: "INITIALIZE", payload: user ?? null });
      } catch {
        // Refresh token juga expired / tidak ada → user tidak login
        dispatch({ type: "INITIALIZE", payload: null });
      }
    }
    loadUser();
  }, []);

  // ─── Login ────────────────────────────────────────────────────────────────
  const login = useCallback(async (data: LoginPayload) => {
    const res = await authApi.login(data);
    // Backend return { success, data: { expiresIn, user } }
    // Cookies (accessToken + refreshToken) di-set otomatis oleh backend
    const user = res.data?.data?.user ?? res.data?.user;
    if (!user) throw new Error("Login gagal: user tidak ditemukan di response");
    dispatch({ type: "LOGIN", payload: user });
  }, []);

  // ─── Logout ───────────────────────────────────────────────────────────────
  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch (e) {
      console.error("Logout API error:", e);
    } finally {
      dispatch({ type: "LOGOUT" });
      localStorage.removeItem("cart");
      window.location.href = "/";
    }
  }, []);

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