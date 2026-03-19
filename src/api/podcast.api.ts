import { apiClient } from "./client";

export interface PodcastLogItem {
  session: string;
  date: string;
  audioUrl: string;
  status: string;
}

export interface PodcastPageResult {
  podcastLogs: PodcastLogItem[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  code: number;
  message: string;
  result: T;
}

export interface GetPodcastLogsParams {
  session?: string;
  date?: string;
  page?: number;
  size?: number;
}

export const getPodcastLogs = async (
  params: GetPodcastLogsParams = {},
): Promise<ApiResponse<PodcastPageResult>> => {
  const response = await apiClient.get<ApiResponse<PodcastPageResult>>(
    "/api/podcast/log",
    { params },
  );

  return response.data;
};
