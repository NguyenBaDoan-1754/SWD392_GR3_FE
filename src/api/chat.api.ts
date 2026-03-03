import { apiClient } from "./client";

export interface ChatMessage {
  question: string;
}

export interface ChatResponse {
  response: string;
}

/**
 * Send a message to the chat API
 */
export const sendChatMessage = async (
  message: ChatMessage,
): Promise<ChatResponse> => {
  try {
    const response = await apiClient.post<ChatResponse>("/api/chat", message);
    return response.data;
  } catch (error) {
    throw error;
  }
};
