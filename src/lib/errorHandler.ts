import { isAxiosError } from "axios";
import { toast } from "sonner";
import type { ApiErrorBody } from "@/types";

export function getApiErrorMessage(error: unknown): string {
  if (isAxiosError<ApiErrorBody>(error)) {
    return error.response?.data?.error?.message ?? error.message;
  }
  if (error instanceof Error) return error.message;
  return "Terjadi kesalahan. Silakan coba lagi.";
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
      toast.error("Data tidak ditemukan.");
      break;
    case "CONFLICT":
      toast.error(message);
      break;
    case "FORBIDDEN":
      toast.error("Anda tidak memiliki akses untuk aksi ini.");
      break;
    case "VALIDATION_ERROR":
      toast.error(message);
      break;
    default:
      toast.error(message);
  }
}
