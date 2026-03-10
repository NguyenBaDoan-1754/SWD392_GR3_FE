import apiClient from "./client";

export interface RawArticle {
  id: string;
  title: string;
  publishedDate: string;
  sourceName: string;
}

export interface Article {
  id: string;
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
const transformArticle = (raw: RawArticle): Article => {
  const date = new Date(raw.publishedDate);
  const formattedDate = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return {
    id: raw.id,
    title: raw.title,
    source: raw.sourceName || "Unknown Source",
    ticker: "---", // Not available in API response
    date: formattedDate,
    sentiment: "Neutral", // Default sentiment - could be enhanced with AI analysis
    excerpt: raw.title.substring(0, 100) + "...",
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
    const articles = items.map((article) => transformArticle(article));

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

export const getArticleById = async (articleId: string): Promise<Article> => {
  try {
    const response = await apiClient.get(`/api/articles/${encodeURIComponent(articleId)}`);
    const result = response.data?.result;

    if (!result) {
      throw new Error("Invalid response structure");
    }

    // Convert content blocks to plain text
    const content = Array.isArray(result.content)
      ? result.content
          .map((block: any) => {
            if (!block) return "";
            if (block.type === "image") return `![image](${block.url})`;
            if (block.type === "heading") return `## ${block.text}`;
            return block.text;
          })
          .join("\n\n")
      : undefined;

    // Format date
    const date = new Date(result.publishedDate);
    const formattedDate = date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

    // Return transformed article with full content
    return {
      id: result.id,
      title: result.title,
      source: result.sourceName || "Unknown Source",
      ticker: "---",
      date: formattedDate,
      sentiment: "Neutral",
      excerpt: result.title.substring(0, 100) + "...",
      content,
    };
  } catch (error) {
    console.error("Error fetching article:", error);
    throw error;
  }
};
