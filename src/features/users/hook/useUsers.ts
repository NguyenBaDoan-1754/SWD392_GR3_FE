import { useEffect, useState } from "react";
import { getUsersApi } from "../../../api/auth.api";

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status?: string;
}

interface UsersResponse {
  code: number;
  message: string;
  result: {
    content: User[];
    empty: boolean;
    totalElements?: number;
    totalPages?: number;
    currentPage?: number;
    pageSize?: number;
  };
}

interface UseUsersReturn {
  users: User[];
  isLoading: boolean;
  error: string | null;
  page: number;
  pageSize: number;
  totalPages: number;
  totalElements: number;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
}


export const useUsers = (): UseUsersReturn => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const response: UsersResponse = await getUsersApi(
          page,
          pageSize,
          "asc",
        );

        if (response.result) {
          setUsers(response.result.content || []);
          setTotalPages(response.result.totalPages || 1);
          setTotalElements(response.result.totalElements || 0);
        }
        setError(null);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("Failed to load users");
        setUsers([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [page, pageSize]);

  return {
    users,
    isLoading,
    error,
    page,
    pageSize,
    totalPages,
    totalElements,
    setPage,
    setPageSize,
  };
};
