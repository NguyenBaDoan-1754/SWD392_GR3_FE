import { useEffect, useMemo, useState } from "react";
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
  const [allArticles, setAllArticles] = useState<Article[]>([]);
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

        const articlesData = response?.articles || [];
        const pages = response?.totalPages || 0;
        const total = response?.totalElements || 0;

        setAllArticles(articlesData);
        setTotalPages(pages);
        setTotalElements(total);
        setError(null);
      } catch (err) {
        setError("Failed to load articles");
        setAllArticles([]);
        setTotalPages(0);
        setTotalElements(0);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [page, sort]);

  const articles = useMemo(() => {
    if (!searchQuery.trim()) return allArticles;
    const q = searchQuery.toLowerCase();
    return allArticles.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.source.toLowerCase().includes(q) ||
        a.excerpt.toLowerCase().includes(q),
    );
  }, [allArticles, searchQuery]);

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
