// TimeLapseList/components/Pagination.tsx
import React from 'react'

interface PaginationProps {
  totalPages: number
  currentPage: number
  onPageChange?: (page: number) => void
}

const Pagination: React.FC<PaginationProps> = ({
  totalPages,
  currentPage,
  onPageChange = () => {},
}) => {
  // 표시할 페이지 버튼 개수 제한
  const getPageNumbers = () => {
    const pageNumbers = []

    // 현재 페이지 앞뒤로 1페이지씩만 표시하는 예제
    // 실제 구현에서는 요구사항에 맞게 조정
    if (totalPages <= 5) {
      // 전체 페이지가 5개 이하면 모두 표시
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i)
      }
    } else {
      // 현재 페이지 주변만 표시하고 나머지는 ...으로 표시
      if (currentPage <= 3) {
        // 1, 2, 3, ..., {totalPages}
        pageNumbers.push(1, 2, 3, '...', totalPages)
      } else if (currentPage >= totalPages - 2) {
        // 1, ..., {totalPages-2}, {totalPages-1}, {totalPages}
        pageNumbers.push(1, '...', totalPages - 2, totalPages - 1, totalPages)
      } else {
        // 1, ..., {currentPage-1}, {currentPage}, {currentPage+1}, ..., {totalPages}
        pageNumbers.push(
          1,
          '...',
          currentPage - 1,
          currentPage,
          currentPage + 1,
          '...',
          totalPages,
        )
      }
    }

    return pageNumbers
  }

  const handlePageClick = (page: number) => {
    if (page !== currentPage) {
      onPageChange(page)
    }
  }

  const goToPrevPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1)
    }
  }

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1)
    }
  }

  return (
    <div className="flex justify-center items-center mt-6 space-x-4">
      <button
        className="px-2 py-1 hover:bg-gray-100 rounded"
        onClick={goToPrevPage}
        disabled={currentPage === 1}
      >
        &lt;
      </button>

      {getPageNumbers().map((page, index) => (
        <React.Fragment key={index}>
          {page === '...' ? (
            <span className="px-2 py-1">...</span>
          ) : (
            <button
              className={`px-2 py-1 rounded ${
                page === currentPage
                  ? 'font-bold bg-gray-100'
                  : 'hover:bg-gray-100'
              }`}
              onClick={() => handlePageClick(page as number)}
            >
              {page}
            </button>
          )}
        </React.Fragment>
      ))}

      <button
        className="px-2 py-1 hover:bg-gray-100 rounded"
        onClick={goToNextPage}
        disabled={currentPage === totalPages}
      >
        &gt;
      </button>
    </div>
  )
}

export default Pagination
