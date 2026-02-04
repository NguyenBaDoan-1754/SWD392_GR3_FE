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
    content: RawArticle[];
    empty: boolean;
    first: boolean;
    last: boolean;
    number: number;
    numberOfElements: number;
    pageable: {
      offset: number;
      pageNumber: number;
      pageSize: number;
      paged: boolean;
      sort: {
        empty: boolean;
        sorted: boolean;
        unsorted: boolean;
      };
      unpaged: boolean;
    };
    size: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    totalElements: number;
    totalPages: number;
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

    // Transform raw articles to app format
    const articles = response.data.result.content.map((article, index) =>
      transformArticle(article, index),
    );

    return {
      articles,
      totalPages: response.data.result.totalPages,
      totalElements: response.data.result.totalElements,
      currentPage: page,
    };
  } catch (error) {
    console.error("Error fetching articles:", error);
    throw error;
  }
};

export const getArticleById = async (id: number): Promise<Article> => {
  try {
    const response = await apiClient.get(`/api/articles/${id}`);
    return response.data;
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

    const articles = response.data.result.content.map((article, index) =>
      transformArticle(article, index),
    );

    return {
      articles,
      totalPages: response.data.result.totalPages,
      totalElements: response.data.result.totalElements,
      currentPage: page,
    };
  } catch (error) {
    console.error("Error searching articles:", error);
    throw error;
  }
};
