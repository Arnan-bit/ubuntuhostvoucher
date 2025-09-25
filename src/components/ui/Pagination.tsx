"use client";
import React from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  style?: 'numbers' | 'arrows' | 'both';
  className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  style = 'both',
  className = ''
}) => {
  if (totalPages <= 1) return null;

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const visiblePages = getVisiblePages();

  const buttonClass = "px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 border";
  const activeClass = "bg-blue-600 text-white border-blue-600 hover:bg-blue-700";
  const inactiveClass = "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700";
  const disabledClass = "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed dark:bg-gray-900 dark:text-gray-600 dark:border-gray-700";

  return (
    <div className={`flex items-center justify-center space-x-1 ${className}`}>
      {/* Previous Button */}
      {(style === 'arrows' || style === 'both') && (
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`${buttonClass} ${currentPage === 1 ? disabledClass : inactiveClass}`}
          aria-label="Previous page"
        >
          <ChevronLeft size={16} />
        </button>
      )}

      {/* Page Numbers */}
      {(style === 'numbers' || style === 'both') && visiblePages.map((page, index) => {
        if (page === '...') {
          return (
            <span key={`dots-${index}`} className="px-3 py-2 text-gray-500 dark:text-gray-400">
              <MoreHorizontal size={16} />
            </span>
          );
        }

        const pageNum = page as number;
        return (
          <button
            key={pageNum}
            onClick={() => onPageChange(pageNum)}
            className={`${buttonClass} ${pageNum === currentPage ? activeClass : inactiveClass}`}
            aria-label={`Page ${pageNum}`}
            aria-current={pageNum === currentPage ? 'page' : undefined}
          >
            {pageNum}
          </button>
        );
      })}

      {/* Next Button */}
      {(style === 'arrows' || style === 'both') && (
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`${buttonClass} ${currentPage === totalPages ? disabledClass : inactiveClass}`}
          aria-label="Next page"
        >
          <ChevronRight size={16} />
        </button>
      )}
    </div>
  );
};

// Simple pagination info component
export const PaginationInfo: React.FC<{
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  className?: string;
}> = ({ currentPage, totalPages, totalItems, itemsPerPage, className = '' }) => {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className={`text-sm text-gray-600 dark:text-gray-400 ${className}`}>
      Showing {startItem} to {endItem} of {totalItems} results
    </div>
  );
};

export default Pagination;
