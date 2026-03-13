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

export interface MyAudioResponse {
  myQuestion: string;
  ChatAnswer: string;
  audioUrl: string;
}

export interface ApiResponse<T> {
  code: number;
  message: string;
  result: T;
}

/**
 * Get chat history for current user
 */
export const getMyAudios = async (): Promise<ApiResponse<MyAudioResponse[]>> => {
  const response = await apiClient.get<ApiResponse<MyAudioResponse[]>>("/api/chat/my-audios");
  return response.data;
};
