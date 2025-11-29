import React from "react";

const Pagination = ({ totalPages, currentPage, onPageChange }) => {
  
  const createPageNumbers = () => {
    let pages = [];

    for (let i = 1; i <= Math.min(3, totalPages); i++) {
      pages.push(i);
    }

    if (currentPage > 5 && totalPages > 6) {
      pages.push("...");
    }

    for (let i = currentPage - 1; i <= currentPage + 1; i++) {
      if (i > 3 && i < totalPages - 2) {
        pages.push(i);
      }
    }

    if (currentPage < totalPages - 4 && totalPages > 6) {
      pages.push("...");
    }

    for (let i = Math.max(totalPages - 2, 4); i <= totalPages; i++) {
      if (i > 0) pages.push(i);
    }

    return pages;
  };

  const pages = createPageNumbers();

  return (
    <div className="flex justify-center mt-6 space-x-2">
      {pages.map((page, index) => (
        page === "..." ? (
          <span key={index} className="px-3 py-2 text-gray-500">
            ...
          </span>
        ) : (
          <button
            key={index}
            onClick={() => onPageChange(page)}
            className={`px-3 py-2 rounded 
              ${currentPage === page 
                ? "bg-blue-600 text-white" 
                : "bg-gray-200 hover:bg-gray-300"
              }`}
          >
            {page}
          </button>
        )
      ))}
    </div>
  );
};

export default Pagination;
