"use server";

import { revalidatePath } from "next/cache";
import { isAxiosError } from "axios";
import {
  createCategory,
  deleteCategory,
  updateCategory,
} from "@/lib/api/categories";
import { getServerSession, isAdminRole } from "@/lib/auth/session";
import {
  categoryFormSchema,
  formValuesToCategoryPayload,
  type CategoryFormValues,
} from "@/lib/validations/category.schema";
import type { ApiErrorBody } from "@/types";

export type CategoryActionState = {
  success: boolean;
  message?: string;
  fieldErrors?: Record<string, string>;
};

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

function parseFieldErrors(error: unknown): Record<string, string> | undefined {
  if (isAxiosError<ApiErrorBody>(error)) {
    const details = error.response?.data?.error?.details;
    if (!details?.length) return undefined;
    return Object.fromEntries(details.map((d) => [d.field, d.message]));
  }
  return undefined;
}

function parseForm(values: CategoryFormValues): CategoryActionState | CategoryFormValues {
  const parsed = categoryFormSchema.safeParse(values);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    parsed.error.issues.forEach((issue) => {
      const key = issue.path[0]?.toString();
      if (key) fieldErrors[key] = issue.message;
    });
    return { success: false, message: "Validasi gagal", fieldErrors };
  }
  return parsed.data;
}

export async function createCategoryAction(
  values: CategoryFormValues,
): Promise<CategoryActionState> {
  const session = await requireAdminSession();
  const parsed = parseForm(values);
  if ("success" in parsed) return parsed;

  try {
    await createCategory(
      formValuesToCategoryPayload(parsed),
      session.accessToken,
    );
  } catch (error) {
    return {
      success: false,
      message: getErrorMessage(error),
      fieldErrors: parseFieldErrors(error),
    };
  }

  revalidatePath("/admin/categories");
  return { success: true, message: "Kategori berhasil dibuat" };
}

export async function updateCategoryAction(
  id: string,
  values: CategoryFormValues,
): Promise<CategoryActionState> {
  const session = await requireAdminSession();
  const parsed = parseForm(values);
  if ("success" in parsed) return parsed;

  try {
    await updateCategory(
      id,
      formValuesToCategoryPayload(parsed),
      session.accessToken,
    );
  } catch (error) {
    return {
      success: false,
      message: getErrorMessage(error),
      fieldErrors: parseFieldErrors(error),
    };
  }

  revalidatePath("/admin/categories");
  return { success: true, message: "Kategori berhasil diperbarui" };
}

export async function deleteCategoryAction(
  id: string,
): Promise<CategoryActionState> {
  const session = await requireAdminSession();

  try {
    await deleteCategory(id, session.accessToken);
  } catch (error) {
    return {
      success: false,
      message: getErrorMessage(error),
    };
  }

  revalidatePath("/admin/categories");
  return { success: true, message: "Kategori berhasil dihapus" };
}

export async function toggleCategoryActiveAction(
  id: string,
  isActive: boolean,
): Promise<CategoryActionState> {
  const session = await requireAdminSession();

  try {
    await updateCategory(id, { isActive }, session.accessToken);
  } catch (error) {
    return {
      success: false,
      message: getErrorMessage(error),
    };
  }

  revalidatePath("/admin/categories");
  return { success: true };
}
