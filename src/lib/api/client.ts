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

    // If it's a 401 and we haven't retried yet
    if (
      typeof window !== "undefined" &&
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      if (isRefreshing) {
        // If a refresh is already happening, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => apiClient(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await axios.post(
          `${baseURL}/auth/refresh`,
          {},
          { withCredentials: true }
        );
        processQueue(null);
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);
        await axios
          .post(`${baseURL}/auth/logout`, {}, { withCredentials: true })
          .catch(() => {});
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);


// import axios from "axios";


// export const tokenStore = {
//   accessToken: null as string | null,
//   refreshFn: null as (() => Promise<void>) | null,
//   logoutFn: null as (() => void) | null,
// };

// const baseURL =
//   process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ||
//   "http://localhost:3000/api";

// export const apiClient = axios.create({
//   baseURL,
//   headers: { "Content-Type": "application/json" },
//   timeout: 15000,
// });

// // Request interceptor: inject Bearer token
// apiClient.interceptors.request.use((config) => {
//   const token = tokenStore.accessToken;
//   if (token) config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });

// // Response interceptor: handle 401 + auto refresh (browser only)
// apiClient.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const original = error.config;
//     if (
//       typeof window !== "undefined" &&
//       error.response?.status === 401 &&
//       !original._retry
//     ) {
//       original._retry = true;
//       try {
//         await tokenStore.refreshFn?.();
//         if (tokenStore.accessToken) {
//           return apiClient(original);
//         }
//       } catch {
//         tokenStore.logoutFn?.();
//         window.location.href = "/login";
//       }
//     }
//     return Promise.reject(error);
//   },
// );

// export function authHeaders(accessToken?: string) {
//   if (!accessToken) return {};
//   return { Authorization: `Bearer ${accessToken}` };
// }
