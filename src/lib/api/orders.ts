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

export async function getOrderList(
  params: OrderListParams = {},
  options?: OrdersRequestOptions
): Promise<ApiResponse<Order[]>> {
  const { data } = await apiClient.get<ApiResponse<Order[]>>("/orders/admin", {
    params,
    ...ordersRequestConfig(options),
  });
  const normalized = normalizeApiResponse<unknown>(data);
  return {
    ...normalized,
    data: mapOrdersFromApi(normalized.data),
  };
}

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

export async function createOrder(
  payload: CreateOrderPayload,
  options?: OrdersRequestOptions
): Promise<ApiResponse<CreateOrderResult>> {
  const { data } = await apiClient.post<ApiResponse<CreateOrderResult>>(
    "/orders",
    payload,
    ordersRequestConfig(options)
  );
  return normalizeApiResponse<CreateOrderResult>(data);
}

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
