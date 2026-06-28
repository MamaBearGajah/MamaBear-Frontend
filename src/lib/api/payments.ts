import type {
  ApiResponse,
  CheckoutPaymentPayload,
  CheckoutPaymentResult,
} from "@/types";
import { apiClient } from "./client";
import { normalizeApiResponse } from "./normalize-api-response";

export async function checkoutPayment(
  payload: CheckoutPaymentPayload,
): Promise<ApiResponse<CheckoutPaymentResult>> {
  const { data } = await apiClient.post<ApiResponse<CheckoutPaymentResult>>(
    "/payments/checkout",
    payload,
  );
  const normalized = normalizeApiResponse<CheckoutPaymentResult>(data);
  return {
    ...normalized,
    data: {
      paymentUrl: String(
        (normalized.data as CheckoutPaymentResult)?.paymentUrl ??
          (normalized.data as Record<string, unknown>)?.payment_url ??
          "",
      ),
      provider: String(
        (normalized.data as CheckoutPaymentResult)?.provider ?? payload.provider,
      ),
    },
  };
}
