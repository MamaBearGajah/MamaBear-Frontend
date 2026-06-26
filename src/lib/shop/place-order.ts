import { createOrder } from "@/lib/api/orders";
import { checkoutPayment } from "@/lib/api/payments";
import { apiClient } from "@/lib/api/client";

export type PlaceShopOrderInput = {
  courier: string;
  service: string;
  provider?: "xendit" | "midtrans";
  notes?: string;
  voucherId?: string; // dikirim ke BE supaya diskon diterapkan dan usedCount++
};

export type PlaceShopOrderResult = {
  orderId: string;
  paymentUrl?: string;
  snapToken?: string;
};

async function resolveDefaultAddressId(): Promise<string | null> {
  const { data } = await apiClient.get<{
    success: boolean;
    data: Array<{ id: string; isDefault?: boolean }>;
  }>("/users/me/addresses");

  const addresses = data?.data ?? [];
  if (!Array.isArray(addresses) || addresses.length === 0) return null;

  return (
    addresses.find((address) => address.isDefault)?.id ??
    addresses[0]?.id ??
    null
  );
}

export async function placeShopOrder(
  input: PlaceShopOrderInput
): Promise<PlaceShopOrderResult> {
  const addressId = await resolveDefaultAddressId();
  if (!addressId) {
    throw new Error("Alamat pengiriman tidak ditemukan. Tambahkan alamat dulu.");
  }

  const provider = input.provider ?? "xendit";

  // 1. Buat order di BE
  //    - courier di-lowercase (konvensi BE)
  //    - service JANGAN di-lowercase — kode RajaOngkir (REG/YES/OKE) case-sensitive
  //    - voucherId dikirim supaya BE menerapkan diskon dan increment usedCount
  const orderRes = await createOrder({
    addressId,
    courier: input.courier.toLowerCase(),
    service: input.service,
    notes: input.notes,
    voucherId: input.voucherId || undefined,
  });

  const orderId = orderRes.data?.orderId;
  if (!orderId) {
    throw new Error("Order berhasil dibuat tapi orderId tidak ditemukan.");
  }

  // Ambil total dari response order untuk dikirim ke payment endpoint
  const total = (orderRes.data as any)?.total ?? (orderRes.data as any)?.amount;
  if (!total) {
    console.warn("placeShopOrder: total tidak ada di order response, payment mungkin gagal");
  }

  // 2. Buat payment
  try {
    const paymentRes = await checkoutPayment({
      orderId,
      provider,
      amount: Number(total ?? 0),
    });

    return {
      orderId,
      paymentUrl: paymentRes.data?.paymentUrl || undefined,
      snapToken: paymentRes.data?.snapToken || undefined,
    };
  } catch {
    return { orderId };
  }
}