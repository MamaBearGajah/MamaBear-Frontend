import axios from "axios";

const baseURL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "http://localhost:3000/api";

export const apiClient = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

export function authHeaders(accessToken?: string) {
  if (!accessToken) return {};
  return { Authorization: `Bearer ${accessToken}` };
}
