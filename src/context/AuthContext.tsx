// "use client";
// import {
//   createContext,
//   useContext,
//   useReducer,
//   useEffect,
//   useCallback,
// } from "react";
// import { authApi } from "@/lib/api/auth";
// import { tokenStore } from "@/lib/api/client";
// import { mapLoginUser } from "@/lib/auth/map-login-user";
// import { setServerSession } from "@/lib/auth/set-session";
// import type { User, LoginPayload } from "@/types/index";

// type AuthState = {
//   user: User | null;
//   accessToken: string | null;
//   refreshToken: string | null;
//   isAuthenticated: boolean;
// };
// type AuthAction =
//   | {
//       type: "LOGIN";
//       payload: { user: User; accessToken: string; refreshToken: string };
//     }
//   | { type: "LOGOUT" }
//   | { type: "REFRESH"; payload: { accessToken: string } };

// function authReducer(state: AuthState, action: AuthAction): AuthState {
//   switch (action.type) {
//     case "LOGIN":
//       return { ...action.payload, isAuthenticated: true };
//     case "LOGOUT":
//       return {
//         user: null,
//         accessToken: null,
//         refreshToken: null,
//         isAuthenticated: false,
//       };
//     case "REFRESH":
//       return { ...state, accessToken: action.payload.accessToken };
//     default:
//       return state;
//   }
// }

// type AuthContextType = {
//   state: AuthState;
//   login: (data: LoginPayload) => Promise<void>;
//   logout: () => void;
//   refreshAccessToken: () => Promise<void>;
// };

// const AuthContext = createContext<AuthContextType | null>(null);

// function readStoredAccessToken(): string | null {
//   if (typeof window === "undefined") return null;
//   return localStorage.getItem("mamabear_at");
// }

// function readStoredRefreshToken(): string | null {
//   if (typeof window === "undefined") return null;
//   return localStorage.getItem("mamabear_rt");
// }

// export function AuthProvider({ children }: { children: React.ReactNode }) {
//   const [state, dispatch] = useReducer(authReducer, {
//     user: null,
//     accessToken: readStoredAccessToken(),
//     refreshToken: readStoredRefreshToken(),
//     isAuthenticated: Boolean(readStoredAccessToken()),
//   });

//   const login = useCallback(async (data: LoginPayload) => {
//     const res = await authApi.login(data);
//     const payload = res.data.data as {
//       accessToken: string;
//       refreshToken?: string;
//       user: { id: string; name: string; email: string; role: string };
//     };

//     const accessToken = payload.accessToken;
//     const refreshToken = payload.refreshToken ?? "";
//     const user = mapLoginUser(payload.user);

//     localStorage.setItem("mamabear_at", accessToken);
//     if (refreshToken) localStorage.setItem("mamabear_rt", refreshToken);

//     await setServerSession({ user, accessToken });

//     dispatch({ type: "LOGIN", payload: { user, accessToken, refreshToken } });
//   }, []);

//   const logout = useCallback(() => {
//     authApi.logout().catch(() => {});
//     localStorage.removeItem("mamabear_at");
//     localStorage.removeItem("mamabear_rt");
//     dispatch({ type: "LOGOUT" });
//   }, []);

//   const refreshAccessToken = useCallback(async () => {
//     if (!state.refreshToken) throw new Error("No refresh token");
//     const res = await authApi.refreshToken(state.refreshToken);
//     const accessToken = res.data.data.accessToken;
//     localStorage.setItem("mamabear_at", accessToken);
//     dispatch({
//       type: "REFRESH",
//       payload: { accessToken },
//     });
//   }, [state.refreshToken]);

//   useEffect(() => {
//     tokenStore.accessToken = state.accessToken;
//     tokenStore.refreshFn = refreshAccessToken;
//     tokenStore.logoutFn = logout;
//   }, [state.accessToken, refreshAccessToken, logout]);

//   return (
//     <AuthContext.Provider value={{ state, login, logout, refreshAccessToken }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }
// export const useAuth = () => {
//   const ctx = useContext(AuthContext);
//   if (!ctx) throw new Error("useAuth must be inside AuthProvider");
//   return ctx;
// };



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