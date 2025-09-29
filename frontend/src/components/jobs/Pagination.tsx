// frontend/src/components/jobs/Pagination.tsx
"use client";

import React from "react";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
};

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  isLoading = false,
}: PaginationProps) => {
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 7;

    if (totalPages <= maxVisible) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show first page
      pages.push(1);

      if (currentPage > 3) {
        pages.push("...");
      }

      // Show pages around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push("...");
      }

      // Show last page
      pages.push(totalPages);
    }

    return pages;
  };

  if (totalPages <= 1) return null;

  const pages = getPageNumbers();

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1 || isLoading}
        className={`px-4 py-2 rounded-md font-medium transition-colors ${
          currentPage === 1 || isLoading
            ? "bg-neutral-800 text-neutral-600 cursor-not-allowed"
            : "bg-neutral-800 text-white hover:bg-neutral-700"
        }`}
      >
        Previous
      </button>

      {/* Page Numbers */}
      {pages.map((page, index) => {
        if (page === "...") {
          return (
            <span key={`ellipsis-${index}`} className="px-2 text-neutral-500">
              ...
            </span>
          );
        }

        const pageNum = page as number;
        const isActive = pageNum === currentPage;

        return (
          <button
            key={pageNum}
            onClick={() => onPageChange(pageNum)}
            disabled={isLoading}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              isActive
                ? "bg-blue-500 text-white"
                : "bg-neutral-800 text-white hover:bg-neutral-700"
            } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {pageNum}
          </button>
        );
      })}

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages || isLoading}
        className={`px-4 py-2 rounded-md font-medium transition-colors ${
          currentPage === totalPages || isLoading
            ? "bg-neutral-800 text-neutral-600 cursor-not-allowed"
            : "bg-neutral-800 text-white hover:bg-neutral-700"
        }`}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
