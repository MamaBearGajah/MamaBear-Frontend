import { apiClient } from "./client";
import { normalizeApiResponse } from "./normalize-api-response";

export type ConsultationStatus = "new" | "in_progress" | "closed";

export interface Consultation {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: ConsultationStatus;
  adminNote?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateConsultationPayload {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export const consultationApi = {
  /** POST /consultations — kirim konsultasi baru (public) */
  submit: async (payload: CreateConsultationPayload): Promise<Consultation> => {
    const res = await apiClient.post("/consultations", payload);
    const norm = normalizeApiResponse<Consultation>(res.data);
    return norm.data;
  },

  adminGetAll: async (params?: {
    status?: ConsultationStatus;
    page?: number;
    limit?: number;
  }): Promise<{ data: Consultation[]; meta: any }> => {
    const res = await apiClient.get("/admin/consultations", { params });
    const norm = normalizeApiResponse<Consultation[]>(res.data);
    return { data: Array.isArray(norm.data) ? norm.data : [], meta: norm.meta };
  },

  adminUpdateStatus: (
    id: string,
    payload: { status: ConsultationStatus; adminNote?: string }
  ) => apiClient.put(`/admin/consultations/${id}`, payload),
};