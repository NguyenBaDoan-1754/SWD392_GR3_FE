import apiClient from "./client";

export interface RawArticle {
  articleUrl: string;
  title: string;
  publishDate: string;
  pageName: string;
}

export interface Article {
  id: number;
  title: string;
  source: string;
  ticker: string;
  date: string;
  sentiment: "Bullish" | "Bearish" | "Neutral";
  excerpt: string;
  content?: string;
  articleUrl?: string;
}

export interface ArticlesResponse {
  code: number;
  message: string;
  result: {
    items: RawArticle[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
    last: boolean;
  };
}

/**
 * Transform API raw article to app Article format
 */
const transformArticle = (raw: RawArticle, index: number): Article => {
  const date = new Date(raw.publishDate);
  const formattedDate = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return {
    id: index,
    title: raw.title,
    source: raw.pageName || "Unknown Source",
    ticker: "---", // Not available in API response
    date: formattedDate,
    sentiment: "Neutral", // Default sentiment - could be enhanced with AI analysis
    excerpt: raw.title.substring(0, 100) + "...",
    articleUrl: raw.articleUrl,
  };
};

export const getArticles = async (
  page: number = 1,
  sort: string = "desc",
): Promise<{
  articles: Article[];
  totalPages: number;
  totalElements: number;
  currentPage: number;
}> => {
  try {
    const response = await apiClient.get<ArticlesResponse>(`/api/articles`, {
      params: {
        page: page - 1, // API uses 0-based pagination
        sort,
      },
    });

    // Safely access the response data
    const items = response.data?.result?.items;
    const result = response.data?.result;

    if (!items || !Array.isArray(items)) {
      console.warn("Invalid API response format:", response.data);
      return {
        articles: [],
        totalPages: 0,
        totalElements: 0,
        currentPage: page,
      };
    }

    // Transform raw articles to app format
    const articles = items.map((article, index) =>
      transformArticle(article, index),
    );

    return {
      articles,
      totalPages: result?.totalPages || 0,
      totalElements: result?.totalElements || 0,
      currentPage: page,
    };
  } catch (error) {
    console.error("Error fetching articles:", error);
    throw error;
  }
};

export const getArticleById = async (articleUrl: string): Promise<Article> => {
  try {
    const response = await apiClient.get(`/api/articles/articleUrl`, {
      params: {
        articleUrl,
      },
    });

    const result = response.data?.result;

    if (!result) {
      throw new Error("Invalid response structure");
    }

    // Format date
    const date = new Date(result.publishDate);
    const formattedDate = date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

    // Return transformed article with full content
    return {
      id: 0,
      title: result.title,
      source: result.pageName || "Unknown Source",
      ticker: "---",
      date: formattedDate,
      sentiment: "Neutral",
      excerpt: result.title.substring(0, 100) + "...",
      content: result.content,
      articleUrl: articleUrl,
    };
  } catch (error) {
    console.error("Error fetching article:", error);
    throw error;
  }
};

export const searchArticles = async (
  query: string,
  page: number = 1,
): Promise<{
  articles: Article[];
  totalPages: number;
  totalElements: number;
  currentPage: number;
}> => {
  try {
    const response = await apiClient.get<ArticlesResponse>(
      `/api/articles/search`,
      {
        params: {
          q: query,
          page: page - 1,
        },
      },
    );

    const items = response.data?.result?.items;
    const result = response.data?.result;

    if (!items || !Array.isArray(items)) {
      console.warn("Invalid API response format:", response.data);
      return {
        articles: [],
        totalPages: 0,
        totalElements: 0,
        currentPage: page,
      };
    }

    const articles = items.map((article, index) =>
      transformArticle(article, index),
    );

    return {
      articles,
      totalPages: result?.totalPages || 0,
      totalElements: result?.totalElements || 0,
      currentPage: page,
    };
  } catch (error) {
    console.error("Error searching articles:", error);
    throw error;
  }
};
