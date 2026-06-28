import { apiClient } from "@/lib/api/client";
import { getServerSession } from "./session";

interface CachedToken {
  token: string;
  expiresAt: number;
}

let serviceTokenCache: CachedToken | null = null;

async function fetchServiceAccessToken(): Promise<string> {
  const email = process.env.SHOP_SERVER_EMAIL;
  const password = process.env.SHOP_SERVER_PASSWORD;

  if (!email || !password) {
    throw new Error(
      "Shop API requires authentication. Log in or set SHOP_SERVER_EMAIL and SHOP_SERVER_PASSWORD in .env.local.",
    );
  }

  if (serviceTokenCache && Date.now() < serviceTokenCache.expiresAt) {
    return serviceTokenCache.token;
  }

  const { data } = await apiClient.post<{
    success: boolean;
    data: { accessToken: string; expiresIn?: number };
  }>("/auth/login", { email, password });

  const accessToken = data.data.accessToken;
  const expiresIn = data.data.expiresIn ?? 900;
  serviceTokenCache = {
    token: accessToken,
    expiresAt: Date.now() + Math.max(expiresIn - 60, 60) * 1000,
  };

  return accessToken;
}

/** Access token for server-side shop API calls (session cookie or service account). */
export async function getShopAccessToken(): Promise<string> {
  const session = await getServerSession();
  if (session?.accessToken) return session.accessToken;
  return fetchServiceAccessToken();
}
