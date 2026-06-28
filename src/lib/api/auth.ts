import { apiClient, authProxyClient } from "@/lib/api/client";
import type { RegisterPayload, LoginPayload } from "@/types/index";

export const authApi = {
  // ── Auth endpoints — lewat Next.js proxy (/api/auth/*)
  // supaya cookie di-set di domain frontend, bisa dibaca middleware
  login: (d: LoginPayload) => authProxyClient.post("/login", d),
  logout: () => authProxyClient.post("/logout"),
  getMe: () => authProxyClient.get("/me"),

  // ── Non-auth endpoints — langsung ke backend (tidak butuh cookie management)
  register: (d: RegisterPayload) => apiClient.post("/auth/register", d),
  forgotPassword: (email: string) =>
    apiClient.post("/auth/forgot-password", { email }),
  resetPassword: (token: string, newPassword: string) =>
    apiClient.post("/auth/reset-password", { token, newPassword }),
  verifyEmail: (token: string) => apiClient.get(`/auth/verify-email/${token}`),
  resendVerification: (email: string) =>
    apiClient.post("/auth/resend-verification", { email }),
};