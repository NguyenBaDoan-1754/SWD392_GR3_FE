import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  loading?: boolean;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  loading = false,
}: PaginationProps) {
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;
    const halfVisible = Math.floor(maxVisible / 2);

    if (totalPages <= maxVisible) {
      // Show all pages if less than max
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      // Calculate range around current page
      let startPage = Math.max(2, currentPage - halfVisible);
      let endPage = Math.min(totalPages - 1, currentPage + halfVisible);

      // Add ellipsis if needed
      if (startPage > 2) {
        pages.push("...");
      }

      // Add page numbers
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      // Add ellipsis if needed
      if (endPage < totalPages - 1) {
        pages.push("...");
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex items-center justify-center gap-2 mt-8 py-6">
      {/* Previous Button */}
      <button
        onClick={handlePrevious}
        disabled={currentPage === 1 || loading}
        className={`flex items-center gap-1 px-4 py-2 rounded-lg border transition-colors ${
          currentPage === 1 || loading
            ? "border-slate-700 text-slate-500 cursor-not-allowed"
            : "border-slate-600 text-slate-300 hover:border-blue-500 hover:text-blue-400"
        }`}
      >
        <ChevronLeft className="w-5 h-5" />
        Previous
      </button>

      {/* Page Numbers */}
      <div className="flex items-center gap-2">
        {pageNumbers.map((page, index) => (
          <button
            key={index}
            onClick={() => typeof page === "number" && onPageChange(page)}
            disabled={page === "..." || loading}
            className={`w-10 h-10 rounded-lg border transition-colors flex items-center justify-center font-medium ${
              page === currentPage
                ? "bg-blue-600 border-blue-600 text-white"
                : page === "..."
                  ? "border-slate-700 text-slate-500 cursor-default"
                  : "border-slate-600 text-slate-300 hover:border-blue-500 hover:text-blue-400"
            } ${loading && page !== "..." ? "cursor-not-allowed" : ""}`}
          >
            {page}
          </button>
        ))}
      </div>

      {/* Next Button */}
      <button
        onClick={handleNext}
        disabled={currentPage === totalPages || loading}
        className={`flex items-center gap-1 px-4 py-2 rounded-lg border transition-colors ${
          currentPage === totalPages || loading
            ? "border-slate-700 text-slate-500 cursor-not-allowed"
            : "border-slate-600 text-slate-300 hover:border-blue-500 hover:text-blue-400"
        }`}
      >
        Next
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Info Text */}
      <div className="ml-4 text-slate-400 text-sm">
        Page {currentPage} of {totalPages}
      </div>
    </div>
  );
}
