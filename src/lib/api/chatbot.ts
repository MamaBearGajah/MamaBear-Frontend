import { apiClient } from "./client";
import { normalizeApiResponse } from "./normalize-api-response";

// Shape yang dipakai komponen
export interface ChatbotResponse {
  answer: string;
  suggestedFaqIds: string[];
}

// Shape yang dikembalikan backend (sekarang sudah konsisten pakai "answer")
interface BackendChatbotData {
  answer: string;
  suggestedFaqIds: string[];
}

export const chatbotApi = {
  query: async (message: string): Promise<ChatbotResponse> => {
    const res = await apiClient.post("/chatbot/query", { message });
    const norm = normalizeApiResponse<BackendChatbotData>(res.data);
    const data = norm.data;

    return {
      answer: data?.answer ?? "Maaf, saya tidak mengerti pertanyaan Anda.",
      suggestedFaqIds: data?.suggestedFaqIds ?? [],
    };
  },
};