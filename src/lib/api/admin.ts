import { apiClient} from "./client";
import { isMockProductsEnabled } from "./mock-data";

export interface ExportProductsResponse {
  downloadUrl: string;
}

export async function exportProducts(
  // accessToken?: string,
): Promise<ExportProductsResponse> {
  if (isMockProductsEnabled()) {
    throw new Error("Export tidak tersedia dalam mode mock.");
  }

  const { data } = await apiClient.get<{
    success: boolean;
    data: ExportProductsResponse;
  }>("/admin/products/export", {
    // headers: authHeaders(accessToken),
  });
  return data.data;
}