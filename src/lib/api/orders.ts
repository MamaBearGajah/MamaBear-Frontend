import type {
  ApiResponse,
  CreateOrderPayload,
  CreateOrderResult,
  Order,
  OrderListParams,
} from "@/types";
import { apiClient } from "./client";
import { mapOrderFromApi, mapOrdersFromApi } from "./map-order";
import { normalizeApiResponse } from "./normalize-api-response";

export type { Order, OrderItem } from "@/types";

type OrdersRequestOptions = {
  cookieHeader?: string;
};

function ordersRequestConfig(options?: OrdersRequestOptions) {
  if (!options?.cookieHeader) return {};
  return { headers: { Cookie: options.cookieHeader } };
}

// ─── User: daftar order milik sendiri ────────────────────────────────────────
export async function getOrderList(
  params: OrderListParams = {},
  options?: OrdersRequestOptions
): Promise<ApiResponse<Order[]>> {
  const { data } = await apiClient.get<ApiResponse<Order[]>>("/users/me/orders", {
    params,
    ...ordersRequestConfig(options),
  });
  const normalized = normalizeApiResponse<unknown>(data);
  return {
    ...normalized,
    data: mapOrdersFromApi(normalized.data),
  };
}

// ─── Detail order (user maupun admin) ────────────────────────────────────────
export async function getOrderById(
  id: string,
  options?: OrdersRequestOptions
): Promise<ApiResponse<Order>> {
  const { data } = await apiClient.get<ApiResponse<unknown>>(`/orders/${id}`, {
    ...ordersRequestConfig(options),
  });
  const normalized = normalizeApiResponse<unknown>(data);
  return {
    ...normalized,
    data: mapOrderFromApi(normalized.data),
  };
}

// ─── Create order ─────────────────────────────────────────────────────────────
function mapCreateOrderResult(raw: unknown): CreateOrderResult {
  const row = (raw ?? {}) as Record<string, unknown>;
  return {
    orderId: String(row.orderId ?? row.id ?? ""),
    status: String(row.status ?? ""),
    total: Number(row.total ?? row.amount ?? 0),
  };
}

export async function createOrder(
  payload: CreateOrderPayload,
  options?: OrdersRequestOptions
): Promise<ApiResponse<CreateOrderResult>> {
  const { data } = await apiClient.post<ApiResponse<unknown>>(
    "/orders",
    payload,
    ordersRequestConfig(options)
  );
  const normalized = normalizeApiResponse<unknown>(data);
  return {
    ...normalized,
    data: mapCreateOrderResult(normalized.data),
  };
}

// ─── Cancel order ─────────────────────────────────────────────────────────────
export async function cancelOrder(
  id: string,
  options?: OrdersRequestOptions
): Promise<ApiResponse<Order>> {
  const { data } = await apiClient.post<ApiResponse<unknown>>(
    `/orders/${id}/cancel`,
    undefined,
    ordersRequestConfig(options)
  );
  const normalized = normalizeApiResponse<unknown>(data);
  return {
    ...normalized,
    data: mapOrderFromApi(normalized.data),
  };
}