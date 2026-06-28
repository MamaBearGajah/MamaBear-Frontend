import type { ApiResponse, PaginationMeta } from "@/types";

type NestedListPayload<T> = {
  data: T;
  meta?: PaginationMeta;
};

/** BE may return { data: { data, meta } } instead of { data, meta }. */
export function normalizeApiResponse<T>(
  raw: ApiResponse<T> | { success?: boolean; data: unknown },
): ApiResponse<T> {
  const success = raw.success ?? true;
  const payload = raw.data;

  if (
    payload &&
    typeof payload === "object" &&
    !Array.isArray(payload) &&
    "data" in payload
  ) {
    const nested = payload as NestedListPayload<T>;
    return {
      success,
      data: nested.data,
      meta: nested.meta,
    };
  }

  return {
    success,
    data: payload as T,
    meta: (raw as ApiResponse<T>).meta,
  };
}
