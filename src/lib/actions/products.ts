"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isAxiosError } from "axios";
import {
  createProduct,
  deleteProduct,
  updateProduct,
} from "@/lib/api/products";
import { getServerSession, isAdminRole } from "@/lib/auth/session";
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

async function requireAdminSession() {
  const session = await getServerSession();
  if (!session || !isAdminRole(session.user.role)) {
    throw new Error("Unauthorized");
  }
  return session;
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
  const session = await requireAdminSession();
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
  const session = await requireAdminSession();
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
  const session = await requireAdminSession();
  await deleteProduct(id, session.accessToken);
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