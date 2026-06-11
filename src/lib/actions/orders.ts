"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isAxiosError } from "axios";
import { cookies } from "next/headers";
import { getServerSession, isAdminRole } from "@/lib/auth/session";
import { adminOrdersApi } from "@/lib/api/adminOrders";
import type { ApiErrorBody } from "@/types";
import { jwtDecode } from "jwt-decode";

export type OrderActionState = {
  success: boolean;
  message?: string;
};

async function requireAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;
  const decodedToken: { role: string } = jwtDecode(token?.toString() as string);

  if (decodedToken.role === "customer") {
    throw new Error("Unauthorized");
  }

  // const session = await getServerSession();
  // if (!session || !isAdminRole(session.user.role)) {
  //   throw new Error("Unauthorized");
  // }
  return decodedToken;
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
  await requireAdminSession();

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
