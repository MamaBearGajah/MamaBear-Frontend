import axios from "axios";

const baseURL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ||
  "http://localhost:3000/api";

export const apiClient = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
  withCredentials: true,
});

// Axios instance khusus untuk auth proxy routes (Next.js API routes)
// Tidak perlu baseURL backend — ini hit /api/auth/* di domain frontend sendiri
export const authProxyClient = axios.create({
  baseURL: "/api/auth",
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
  withCredentials: true,
});

// Variables to handle concurrent requests so we don't spam the refresh endpoint
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

// Response interceptor: handle 401 + auto refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      typeof window !== "undefined" &&
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      // Jangan refresh kalau request-nya memang ke auth endpoint
      const isAuthEndpoint =
        originalRequest.url?.includes("/auth/refresh") ||
        originalRequest.url?.includes("/auth/logout") ||
        originalRequest.url?.includes("/auth/login");
      if (isAuthEndpoint) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => apiClient(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Hit Next.js proxy /api/auth/refresh (bukan backend langsung)
        // supaya cookie di-set di domain frontend
        await axios.post("/api/auth/refresh", {}, { withCredentials: true });
        processQueue(null);
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);
        // Hapus session via proxy
        await axios
          .post("/api/auth/logout", {}, { withCredentials: true })
          .catch(() => {});
        const protectedPaths = ["/account", "/checkout", "/admin"];
        const isProtected = protectedPaths.some((p) =>
          window.location.pathname.startsWith(p)
        );
        if (isProtected) {
          window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`;
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);

export function authHeaders(accessToken?: string) {
  if (!accessToken) return {};
  return { Authorization: `Bearer ${accessToken}` };
}