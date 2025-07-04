// eslint-disable-next-line no-unused-vars
import React from "react";

// eslint-disable-next-line react/prop-types
const Pagination = ({ pageNo, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="pagination-custom">
      <button
        className="pagination-btn"
        onClick={() => onPageChange(pageNo - 1)}
        disabled={pageNo === 0}
      >
        &lt;
      </button>
      {[...Array(totalPages)].map((_, idx) => (
        <button
          key={idx}
          className={`pagination-btn page-number-btn${pageNo === idx ? " active" : ""}`}
          onClick={() => onPageChange(idx)}
          disabled={pageNo === idx}
        >
          {idx + 1}
        </button>
      ))}
      <button
        className="pagination-btn"
        onClick={() => onPageChange(pageNo + 1)}
        disabled={pageNo >= totalPages - 1}
      >
        &gt;
      </button>
    </div>
  );
};

export default Pagination;