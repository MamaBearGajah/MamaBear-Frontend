/**
 * src/lib/api/chatbot.ts
 * BE: POST /chatbot/query — rule-based FAQ matching
 */

import { apiClient } from "./client";
import { normalizeApiResponse } from "./normalize-api-response";

export interface ChatbotResponse {
  answer: string;
  suggestedFaqIds: string[];
}

export const chatbotApi = {
  query: async (message: string): Promise<ChatbotResponse> => {
    const res = await apiClient.post("/chatbot/query", { message });
    const norm = normalizeApiResponse<ChatbotResponse>(res.data);
    return norm.data ?? { answer: "Maaf, saya tidak mengerti pertanyaan Anda.", suggestedFaqIds: [] };
  },
};
