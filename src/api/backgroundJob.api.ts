import apiClient from "./client";

interface JobResponse {
  code: number;
  message: string;
  result?: any;
}

export const backgroundJobApi = {
  // Crawl Article
  async startCrawlArticle(): Promise<JobResponse> {
    try {
      const response = await apiClient.post(
        "/api/background/job/crawl-article/start",
      );
      return response.data;
    } catch (error) {
      console.error("Failed to start crawl article job:", error);
      throw error;
    }
  },

  async stopCrawlArticle(): Promise<JobResponse> {
    try {
      const response = await apiClient.post(
        "/api/background/job/crawl-article/stop",
      );
      return response.data;
    } catch (error) {
      console.error("Failed to stop crawl article job:", error);
      throw error;
    }
  },

  async getCrawlArticleStatus(): Promise<JobResponse> {
    try {
      const response = await apiClient.get(
        "/api/background/job/crawl-article/status",
      );
      return response.data;
    } catch (error) {
      console.error("Failed to get crawl article status:", error);
      throw error;
    }
  },

  // Article Vector
  async startArticleVector(): Promise<JobResponse> {
    try {
      const response = await apiClient.post(
        "/api/background/job/article-vector/start",
      );
      return response.data;
    } catch (error) {
      console.error("Failed to start article vector job:", error);
      throw error;
    }
  },

  async stopArticleVector(): Promise<JobResponse> {
    try {
      const response = await apiClient.post(
        "/api/background/job/article-vector/stop",
      );
      return response.data;
    } catch (error) {
      console.error("Failed to stop article vector job:", error);
      throw error;
    }
  },

  async getArticleVectorStatus(): Promise<JobResponse> {
    try {
      const response = await apiClient.get(
        "/api/background/job/article-vector/status",
      );
      return response.data;
    } catch (error) {
      console.error("Failed to get article vector status:", error);
      throw error;
    }
  },

  // Article Save File MD
  async startArticleSaveFileMd(): Promise<JobResponse> {
    try {
      const response = await apiClient.post(
        "/api/background/job/article-save-file-md/start",
      );
      return response.data;
    } catch (error) {
      console.error("Failed to start article save file md job:", error);
      throw error;
    }
  },

  async stopArticleSaveFileMd(): Promise<JobResponse> {
    try {
      const response = await apiClient.post(
        "/api/background/job/article-save-file-md/stop",
      );
      return response.data;
    } catch (error) {
      console.error("Failed to stop article save file md job:", error);
      throw error;
    }
  },

  async getArticleSaveFileMdStatus(): Promise<JobResponse> {
    try {
      const response = await apiClient.get(
        "/api/background/job/article-save-file-md/status",
      );
      return response.data;
    } catch (error) {
      console.error("Failed to get article save file md status:", error);
      throw error;
    }
  },

  // Article Extract Ticker
  async startArticleExtractTicker(): Promise<JobResponse> {
    try {
      const response = await apiClient.post(
        "/api/background/job/article-extract-ticker/start",
      );
      return response.data;
    } catch (error) {
      console.error("Failed to start article extract ticker job:", error);
      throw error;
    }
  },

  async stopArticleExtractTicker(): Promise<JobResponse> {
    try {
      const response = await apiClient.post(
        "/api/background/job/article-extract-ticker/stop",
      );
      return response.data;
    } catch (error) {
      console.error("Failed to stop article extract ticker job:", error);
      throw error;
    }
  },

  async getArticleExtractTickerStatus(): Promise<JobResponse> {
    try {
      const response = await apiClient.get(
        "/api/background/job/article-extract-ticker/status",
      );
      return response.data;
    } catch (error) {
      console.error("Failed to get article extract ticker status:", error);
      throw error;
    }
  },

  // Article Chunking
  async startArticleChunking(): Promise<JobResponse> {
    try {
      const response = await apiClient.post(
        "/api/background/job/article-chunking/start",
      );
      return response.data;
    } catch (error) {
      console.error("Failed to start article chunking job:", error);
      throw error;
    }
  },

  async stopArticleChunking(): Promise<JobResponse> {
    try {
      const response = await apiClient.post(
        "/api/background/job/article-chunking/stop",
      );
      return response.data;
    } catch (error) {
      console.error("Failed to stop article chunking job:", error);
      throw error;
    }
  },

  async getArticleChunkingStatus(): Promise<JobResponse> {
    try {
      const response = await apiClient.get(
        "/api/background/job/article-chunking/status",
      );
      return response.data;
    } catch (error) {
      console.error("Failed to get article chunking status:", error);
      throw error;
    }
  },
};

export default backgroundJobApi;
