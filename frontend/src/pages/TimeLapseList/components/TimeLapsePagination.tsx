import React from 'react'
import '@/styles/TimeLapsePagination.css'

interface TimeLapsePaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

const TimeLapsePagination: React.FC<TimeLapsePaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange
}) => {
  return (
    <div className="pagination-container">
      <button
        className="pagination-button"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
      >
        &lt;
      </button>

      {/* 페이지 번호 동적 생성 */}
      {Array.from(
        { length: Math.min(5, totalPages) },
        (_, i) => {
          // 현재 페이지를 중심으로 표시할 페이지 번호 계산
          const pageNum = i + 1
          return (
            <button
              key={pageNum}
              className={`pagination-button ${currentPage === pageNum ? 'pagination-active' : ''}`}
              onClick={() => onPageChange(pageNum)}
            >
              {pageNum}
            </button>
          )
        },
      )}

      {totalPages > 5 && <span className="pagination-ellipsis">.....</span>}

      {totalPages > 5 && (
        <button
          className="pagination-button"
          onClick={() => onPageChange(totalPages)}
        >
          {totalPages}
        </button>
      )}

      <button
        className="pagination-button"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
      >
        &gt;
      </button>
    </div>
  )
}

export default TimeLapsePagination