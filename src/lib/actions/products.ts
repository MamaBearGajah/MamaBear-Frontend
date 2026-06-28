"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isAxiosError } from "axios";
import { cookies } from "next/headers";
import {
  createProduct,
  deleteProduct,
  updateProduct,
} from "@/lib/api/products";
import {
  formValuesToPayload,
  productFormSchema,
  type ProductFormValues,
} from "@/lib/validations/product.schema";
import type { ApiErrorBody } from "@/types";

export type ProductActionState = {
  success: boolean;
  message?: string;
  fieldErrors?: Record<string, string>;
};

function parseFieldErrors(error: unknown): Record<string, string> | undefined {
  if (isAxiosError<ApiErrorBody>(error)) {
    const details = error.response?.data?.error?.details;
    if (!details?.length) return undefined;
    return Object.fromEntries(details.map((d) => [d.field, d.message]));
  }
  return undefined;
}

// FIX: requireAdminSession() lama memanggil getServerSession() yang membaca
// cookie mamabear_session — cookie ini TIDAK PERNAH di-set oleh auth flow
// (backend hanya set accessToken + refreshToken).
// Akibatnya semua product server action selalu throw "Unauthorized" secara diam-diam.
// Implementasi baru: decode accessToken cookie langsung + cek expiry.
async function requireAdminSession(): Promise<{ role: string; accessToken: string }> {
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

  if (payload.exp && payload.exp * 1000 < Date.now()) {
    throw new Error("Unauthorized: token sudah expired");
  }

  const role = payload.role ?? "";
  if (role !== "admin" && role !== "super_admin") {
    throw new Error("Unauthorized: role tidak cukup");
  }

  return { role, accessToken: token };
}

function getErrorMessage(error: unknown): string {
  if (isAxiosError<ApiErrorBody>(error)) {
    return error.response?.data?.error?.message ?? error.message;
  }
  if (error instanceof Error) return error.message;
  return "Terjadi kesalahan";
}

export async function createProductAction(
  values: ProductFormValues,
): Promise<ProductActionState> {
  let session: { role: string; accessToken: string };
  try {
    session = await requireAdminSession();
  } catch (e) {
    return { success: false, message: getErrorMessage(e) };
  }

  const parsed = productFormSchema.safeParse(values);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    parsed.error.issues.forEach((issue) => {
      const key = issue.path[0]?.toString();
      if (key) fieldErrors[key] = issue.message;
    });
    return { success: false, message: "Validasi gagal", fieldErrors };
  }

  try {
    await createProduct(formValuesToPayload(parsed.data), session.accessToken);
  } catch (error) {
    return {
      success: false,
      message: getErrorMessage(error),
      fieldErrors: parseFieldErrors(error),
    };
  }

  revalidatePath("/admin/products");
  redirect("/admin/products");
}

export async function updateProductAction(
  id: string,
  values: ProductFormValues,
): Promise<ProductActionState> {
  let session: { role: string; accessToken: string };
  try {
    session = await requireAdminSession();
  } catch (e) {
    return { success: false, message: getErrorMessage(e) };
  }

  const parsed = productFormSchema.safeParse(values);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    parsed.error.issues.forEach((issue) => {
      const key = issue.path[0]?.toString();
      if (key) fieldErrors[key] = issue.message;
    });
    return { success: false, message: "Validasi gagal", fieldErrors };
  }

  try {
    await updateProduct(id, formValuesToPayload(parsed.data), session.accessToken);
  } catch (error) {
    return {
      success: false,
      message: getErrorMessage(error),
      fieldErrors: parseFieldErrors(error),
    };
  }

  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${id}`);
  redirect("/admin/products");
}

export async function deleteProductAction(id: string): Promise<{ success: boolean }> {
  const { accessToken } = await requireAdminSession();
  await deleteProduct(id, accessToken);
  revalidatePath("/admin/products");
  return { success: true };
}

export async function revalidateAdminProductsAction(): Promise<void> {
  revalidatePath("/admin/products");
}

export async function deleteProductAndRedirectAction(id: string): Promise<void> {
  await deleteProductAction(id);
  redirect("/admin/products");
}