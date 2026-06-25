import { apiClient } from "./client";
import { normalizeApiResponse } from "./normalize-api-response";
 
// Shape internal yang dipakai komponen
export interface ChatbotResponse {
  answer: string;
  suggestedFaqIds: string[];
}
 
// Shape asli dari backend
interface BackendChatbotData {
  reply: string;           // ← backend pakai "reply"
  suggestedFaqIds: string[];
}
 
export const chatbotApi = {
  query: async (message: string): Promise<ChatbotResponse> => {
    const res = await apiClient.post("/chatbot/query", { message });
    const norm = normalizeApiResponse<BackendChatbotData>(res.data);
    const data = norm.data;
 
    return {
      // FIX: map "reply" → "answer" agar widget bisa pakai res.answer
      answer: data?.reply ?? "Maaf, saya tidak mengerti pertanyaan Anda.",
      suggestedFaqIds: data?.suggestedFaqIds ?? [],
    };
  },
};