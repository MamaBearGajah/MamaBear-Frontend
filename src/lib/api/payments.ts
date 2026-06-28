import type {
  ApiResponse,
  CheckoutPaymentPayload,
  CheckoutPaymentResult,
} from "@/types";
import { apiClient } from "./client";
import { normalizeApiResponse } from "./normalize-api-response";

/**
 * FIX: checkoutPayment
 *
 * Backend POST /payments/checkout membutuhkan { orderId, provider, amount }.
 * Sebelumnya amount tidak selalu dikirim dari frontend.
 * Sekarang payload harus include amount.
 */
export interface PaymentCheckoutPayload {
  orderId: string;
  provider: "xendit" | "midtrans";
  amount: number;
}

export interface PaymentCheckoutResult {
  paymentUrl: string;
  provider: string;
  externalId?: string;
  snapToken?: string;   // Midtrans
  expiredAt?: string;
}

export async function checkoutPayment(
  payload: PaymentCheckoutPayload
): Promise<ApiResponse<PaymentCheckoutResult>> {
  const { data } = await apiClient.post<ApiResponse<PaymentCheckoutResult>>(
    "/payments/checkout",
    payload
  );
  const normalized = normalizeApiResponse<PaymentCheckoutResult>(data);

  // Cast once through unknown to safely access either camelCase or snake_case fields
  const raw = normalized.data as unknown as Record<string, unknown>;

  return {
    ...normalized,
    data: {
      paymentUrl: String(raw?.paymentUrl ?? raw?.payment_url ?? ""),
      provider: String(raw?.provider ?? payload.provider),
      externalId: raw?.externalId as string | undefined,
      snapToken: raw?.snapToken as string | undefined,
      expiredAt: raw?.expiredAt as string | undefined,
    },
  };
}