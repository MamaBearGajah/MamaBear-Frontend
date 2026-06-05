import { createOrder } from "@/lib/api/orders";
import { checkoutPayment } from "@/lib/api/payments";
import { apiClient } from "@/lib/api/client";

export type PlaceShopOrderInput = {
  courier: string;
  service: string;
  provider?: "xendit" | "midtrans";
};

export type PlaceShopOrderResult = {
  orderId: string;
  paymentUrl?: string;
};

async function resolveDefaultAddressId(): Promise<string | null> {
  const { data } = await apiClient.get<{
    success: boolean;
    data: Array<{ id: string; isDefault?: boolean }>;
  }>("/users/me/addresses");

  const addresses = data?.data ?? [];
  if (!Array.isArray(addresses) || addresses.length === 0) return null;

  return (
    addresses.find((address) => address.isDefault)?.id ?? addresses[0]?.id ?? null
  );
}

export async function placeShopOrder(
  input: PlaceShopOrderInput,
): Promise<PlaceShopOrderResult> {
  const addressId = await resolveDefaultAddressId();
  if (!addressId) {
    throw new Error("No shipping address found. Please add an address first.");
  }

  const provider = input.provider ?? "xendit";
  const orderRes = await createOrder({
    addressId,
    courier: input.courier.toLowerCase(),
    service: input.service.toLowerCase(),
    paymentMethod: provider,
  });

  const orderId = orderRes.data?.orderId;
  if (!orderId) {
    throw new Error("Order creation did not return an order ID.");
  }

  try {
    const paymentRes = await checkoutPayment({ orderId, provider });
    return {
      orderId,
      paymentUrl: paymentRes.data?.paymentUrl || undefined,
    };
  } catch {
    return { orderId };
  }
}
