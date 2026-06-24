import { apiClient } from "./client";

export type ConsultationStatus = "new" | "in_progress" | "closed";

export type Consultation = {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  message: string;
  status: ConsultationStatus;
  createdAt: string;
  updatedAt: string;
};

export type ConsultationMeta = {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
};

type CreateConsultationInput = {
  name: string;
  email: string;
  phone?: string;
  message: string;
};

type AdminGetAllParams = {
  page?: number;
  limit?: number;
  status?: ConsultationStatus;  // ← tambah
  search?: string;              // ← tambah
};

type AdminUpdateStatusInput = {
  status: ConsultationStatus;
};

function mapConsultation(row: unknown): Consultation {
  const item = (row ?? {}) as Record<string, unknown>;
  return {
    id: String(item.id ?? ""),
    name: String(item.name ?? ""),
    email: String(item.email ?? ""),
    phone: item.phone == null ? null : String(item.phone),
    message: String(item.message ?? ""),
    status: (item.status as ConsultationStatus) ?? "new",
    createdAt: String(item.createdAt ?? ""),
    updatedAt: String(item.updatedAt ?? ""),
  };
}

function mapMeta(raw: unknown): ConsultationMeta {
  const meta = (raw ?? {}) as Record<string, unknown>;
  return {
    currentPage: Number(meta.page ?? 1),
    itemsPerPage: Number(meta.limit ?? 20),
    totalItems: Number(meta.totalItems ?? 0),
    totalPages: Number(meta.totalPages ?? 1),
  };
}

export const consultationApi = {
  async create(input: CreateConsultationInput): Promise<Consultation> {
    const response = await apiClient.post("/consultations", input);
    return mapConsultation(response.data?.data);
  },

  async adminGetAll(
    params: AdminGetAllParams,
  ): Promise<{ data: Consultation[]; meta: ConsultationMeta }> {
    const response = await apiClient.get("/admin/consultations", {
      params: {
        page: params.page ?? 1,
        limit: params.limit ?? 20,
        ...(params.status && { status: params.status }),  // ← kirim ke BE jika ada
        ...(params.search && { search: params.search }),  // ← kirim ke BE jika ada
      },
    });
    const rows = Array.isArray(response.data?.data) ? response.data.data : [];
    return {
      data: rows.map(mapConsultation),
      meta: mapMeta(response.data?.meta),
    };
  },

  async adminUpdateStatus(
    id: string,
    input: AdminUpdateStatusInput,
  ): Promise<Consultation> {
    const response = await apiClient.put(`/admin/consultations/${id}`, {
      status: input.status,
    });
    return mapConsultation(response.data?.data);
  },
};