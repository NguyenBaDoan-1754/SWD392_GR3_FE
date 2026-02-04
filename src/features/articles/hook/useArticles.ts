import { useEffect, useState } from "react";
import type { Article } from "../../../api/article.api";
import { getArticles } from "../../../api/article.api";

interface UseArticlesReturn {
  articles: Article[];
  loading: boolean;
  error: string | null;
  page: number;
  sort: string;
  searchQuery: string;
  totalPages: number;
  totalElements: number;
  setPage: (page: number) => void;
  setSort: (sort: string) => void;
  setSearchQuery: (query: string) => void;
}

export const useArticles = (): UseArticlesReturn => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("desc");
  const [searchQuery, setSearchQuery] = useState("");
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const response = await getArticles(page, sort);

        // Extract metadata from response
        const articlesData = Array.isArray(response)
          ? response
          : response?.articles || [];
        const pages = response?.totalPages || 0;
        const total = response?.totalElements || 0;

        setArticles(articlesData);
        setTotalPages(pages);
        setTotalElements(total);
        setError(null);
      } catch (err) {
        setError("Failed to load articles");
        setArticles([]); // Set empty array on error
        setTotalPages(0);
        setTotalElements(0);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [page, sort]);

  return {
    articles,
    loading,
    error,
    page,
    sort,
    searchQuery,
    totalPages,
    totalElements,
    setPage,
    setSort,
    setSearchQuery,
  };
};
