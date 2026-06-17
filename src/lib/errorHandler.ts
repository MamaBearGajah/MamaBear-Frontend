import { isAxiosError } from "axios";
import { toast } from "sonner";
import type { ApiErrorBody } from "@/types";

export function getApiErrorMessage(error: unknown): string {
  if (isAxiosError<ApiErrorBody>(error)) {
    const details = error.response?.data?.error?.details;
    if (details?.length) {
      return details.map((detail) => detail.message).join(" ");
    }

    const message = error.response?.data?.error?.message;
    if (message === "Validasi gagal") {
      return "Validation failed. Please check the form fields.";
    }
    if (message === "Gagal mengupdate produk") {
      return "Failed to update product. Please try again.";
    }
    if (message === "Terjadi kesalahan pada server") {
      return "Server error. Please try again or contact support.";
    }

    return message ?? error.message;
  }
  if (error instanceof Error) return error.message;
  return "Something went wrong. Please try again.";
}

export function getApiErrorCode(error: unknown): string | undefined {
  if (isAxiosError<ApiErrorBody>(error)) {
    return error.response?.data?.error?.code;
  }
  if (error instanceof Error && "code" in error) {
    return (error as Error & { code?: string }).code;
  }
  return undefined;
}

export function handleApiError(error: unknown): void {
  const code = getApiErrorCode(error);
  const message = getApiErrorMessage(error);

  switch (code) {
    case "NOT_FOUND":
      toast.error("Data not found.");
      break;
    case "CONFLICT":
      toast.error(message);
      break;
    case "FORBIDDEN":
      toast.error("You do not have permission for this action.");
      break;
    case "VALIDATION_ERROR":
      toast.error(message);
      break;
    default:
      toast.error(message);
  }
}