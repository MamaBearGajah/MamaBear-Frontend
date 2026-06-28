import { apiClient} from "./client";

export interface ExportProductsResponse {
  downloadUrl: string;
}

export async function exportProducts(
  // accessToken?: string,
): Promise<ExportProductsResponse> {
  const { data } = await apiClient.get<{
    success: boolean;
    data: ExportProductsResponse;
  }>("/admin/products/export", {
    // headers: authHeaders(accessToken),
  });
  return data.data;
}