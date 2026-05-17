import axios from "axios";

// Token store di luar React tree — diupdate oleh AuthContext
export const tokenStore = {
  accessToken: null as string | null,
  refreshFn: null as (() => Promise<void>) | null,
  logoutFn: null as (() => void) | null,
};

const baseURL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ||
  "http://localhost:3000/api";

export const apiClient = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

// Request interceptor: inject Bearer token
apiClient.interceptors.request.use((config) => {
  const token = tokenStore.accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response interceptor: handle 401 + auto refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        await tokenStore.refreshFn?.();
        return apiClient(original);
      } catch {
        tokenStore.logoutFn?.();
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export function authHeaders(accessToken?: string) {
  if (!accessToken) return {};
  return { Authorization: `Bearer ${accessToken}` };
}
