"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isAxiosError } from "axios";
import { cookies } from "next/headers";
import { adminOrdersApi } from "@/lib/api/adminOrders";
import type { ApiErrorBody } from "@/types";

export type OrderActionState = {
  success: boolean;
  message?: string;
};

// FIX: ganti requireAdminSession yang pakai jwtDecode manual (tidak cek expiry, tidak aman)
// dengan implementasi yang decode payload + cek exp field.
// getServerSession() tidak bisa dipakai karena mamabear_session cookie tidak pernah di-set
// di auth flow (backend set accessToken + refreshToken, bukan mamabear_session).
// Solusi: decode accessToken cookie secara manual DENGAN cek expiry.
async function requireAdminSession(): Promise<{ role: string; sub: string }> {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  if (!token) {
    throw new Error("Unauthorized: tidak ada access token");
  }

  let payload: { role?: string; sub?: string; exp?: number };
  try {
    const base64 = token.split(".")[1];
    if (!base64) throw new Error("Token format tidak valid");
    payload = JSON.parse(Buffer.from(base64, "base64url").toString("utf-8"));
  } catch {
    throw new Error("Unauthorized: token tidak valid");
  }

  // Cek expiry
  if (payload.exp && payload.exp * 1000 < Date.now()) {
    throw new Error("Unauthorized: token sudah expired");
  }

  const role = payload.role ?? "";
  if (role !== "admin" && role !== "super_admin") {
    throw new Error("Unauthorized: role tidak cukup");
  }

  return { role, sub: payload.sub ?? "" };
}

function getErrorMessage(error: unknown): string {
  if (isAxiosError<ApiErrorBody>(error)) {
    return error.response?.data?.error?.message ?? error.message;
  }
  if (error instanceof Error) return error.message;
  return "Terjadi kesalahan";
}

export async function updateOrderStatusAction(
  id: string,
  prevState: OrderActionState,
  formData: FormData
): Promise<OrderActionState> {
  try {
    await requireAdminSession();
  } catch (e) {
    return { success: false, message: getErrorMessage(e) };
  }

  const status = formData.get("status") as string;
  const trackingNumber =
    (formData.get("trackingNumber") as string) || undefined;
  const note = (formData.get("note") as string) || undefined;

  if (!status) {
    return { success: false, message: "Status wajib dipilih." };
  }

  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  try {
    await adminOrdersApi.updateStatus(
      id,
      { status, trackingNumber, note },
      { headers: { Cookie: cookieHeader } }
    );
  } catch (error) {
    return { success: false, message: getErrorMessage(error) };
  }

  revalidatePath(`/admin/orders/${id}`);
  revalidatePath(`/admin/orders/${id}/edit`);
  revalidatePath("/admin/orders");
  redirect(`/admin/orders/${id}`);
}