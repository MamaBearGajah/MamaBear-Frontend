// src/context/AuthContext.tsx
"use client";
import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
} from "react";
import { authApi } from "@/lib/api/auth";
import { tokenStore } from "@/lib/api/client";
import type { User, LoginPayload } from "@/types/index";

type AuthState = {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
};
type AuthAction =
  | {
      type: "LOGIN";
      payload: { user: User; accessToken: string; refreshToken: string };
    }
  | { type: "LOGOUT" }
  | { type: "REFRESH"; payload: { accessToken: string } };

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "LOGIN":
      return { ...action.payload, isAuthenticated: true };
    case "LOGOUT":
      return {
        user: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
      };
    case "REFRESH":
      return { ...state, accessToken: action.payload.accessToken };
    default:
      return state;
  }
}

type AuthContextType = {
  state: AuthState;
  login: (data: LoginPayload) => Promise<void>;
  logout: () => void;
  refreshAccessToken: () => Promise<void>;
  //   isInitializing: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    accessToken: null,
    refreshToken:
      typeof window !== "undefined"
        ? localStorage.getItem("mamabear_rt")
        : null,
    isAuthenticated: false,
  });

  const login = useCallback(async (data: LoginPayload) => {
    const res = await authApi.login(data);
    const { accessToken, refreshToken, user } = res.data.data;
    localStorage.setItem("mamabear_at", accessToken);
    localStorage.setItem("mamabear_rt", refreshToken);
    dispatch({ type: "LOGIN", payload: { user, accessToken, refreshToken } });
  }, []); // dispatch is stable, no deps needed

  const logout = useCallback(() => {
    authApi.logout().catch(() => {});
    localStorage.removeItem("mamabear_at");
    localStorage.removeItem("mamabear_rt");
    dispatch({ type: "LOGOUT" });
  }, []);

  // 👇 useCallback so the reference is stable
  const refreshAccessToken = useCallback(async () => {
    if (!state.refreshToken) throw new Error("No refresh token");
    const res = await authApi.refreshToken(state.refreshToken);
    dispatch({
      type: "REFRESH",
      payload: { accessToken: res.data.data.accessToken },
    });
  }, [state.refreshToken]); // only re-created when refreshToken changes

  // ✅ Now safe to include in deps — reference is stable
  useEffect(() => {
    tokenStore.accessToken = state.accessToken;
    tokenStore.refreshFn = refreshAccessToken;
    tokenStore.logoutFn = logout;
  }, [state.accessToken, refreshAccessToken, logout]);

  return (
    <AuthContext.Provider value={{ state, login, logout, refreshAccessToken }}>
      {children}
    </AuthContext.Provider>
  );
}
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
};
