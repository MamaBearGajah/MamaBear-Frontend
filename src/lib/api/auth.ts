import apiClient from "./client";

// src/lib/api/auth.ts
export const authApi = {
  register: (d: RegisterPayload) => apiClient.post('/auth/register', d),
  login: (d: LoginPayload) => apiClient.post('/auth/login', d),
  logout: () => apiClient.post('/auth/logout'),
  refreshToken: (rt: string) => apiClient.post('/auth/refresh', { refreshToken: rt }),
  forgotPassword: (email: string) => apiClient.post('/auth/forgot-password', { email }),
  resetPassword: (token: string, password: string) =>     apiClient.post('/auth/reset-password', { token, password }),
  verifyEmail: (token: string) => apiClient.get(`/auth/verify-email/${token}`),
  resendVerification: (email: string) =>     apiClient.post('/auth/resend-verification', { email }),
};
