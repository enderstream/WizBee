import React from 'react'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (pageNumber: number) => void
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  // 페이지네이션 범위 계산
  const getPageRange = () => {
    // 현재 페이지 기준 앞뒤로 2개씩 보여줌 (총 5개)
    let startPage = Math.max(1, currentPage - 2)
    let endPage = Math.min(totalPages, startPage + 4)
    
    // 끝 페이지가 totalPages를 초과하지 않도록 조정
    if (endPage > totalPages) {
      endPage = totalPages
      startPage = Math.max(1, endPage - 4)
    }
    
    return { startPage, endPage }
  }

  // 페이지네이션 버튼 생성 함수
  const renderPaginationButtons = () => {
    const pageButtons = []
    const { startPage, endPage } = getPageRange()
    
    // 첫 페이지 버튼 (<<)
    pageButtons.push(
      <button 
        key="first" 
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
        className="mx-1 px-4 py-2 bg-transparent border-none cursor-pointer text-base focus:outline-none text-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        &lt;&lt;
      </button>
    )
    
    // 이전 페이지 버튼 (<)
    pageButtons.push(
      <button 
        key="prev" 
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="mx-1 px-4 py-2 bg-transparent border-none cursor-pointer text-base focus:outline-none text-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        &lt;
      </button>
    )
    
    // 페이지 번호 버튼 (최대 5개)
    for (let i = startPage; i <= endPage; i++) {
      pageButtons.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={`mx-1 px-4 py-2 bg-transparent border-none cursor-pointer text-base focus:outline-none rounded-md text-blue-500 ${
            currentPage === i ? 'bg-blue-500 text-white' : ''
          }`}
        >
          {i}
        </button>
      )
    }
    
    // 다음 페이지 버튼 (>)
    pageButtons.push(
      <button 
        key="next" 
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="mx-1 px-4 py-2 bg-transparent border-none cursor-pointer text-base focus:outline-none text-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        &gt;
      </button>
    )
    
    // 마지막 페이지 버튼 (>>)
    pageButtons.push(
      <button 
        key="last" 
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
        className="mx-1 px-4 py-2 bg-transparent border-none cursor-pointer text-base focus:outline-none text-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        &gt;&gt;
      </button>
    )
    
    return pageButtons
  }

  return (
    <div className="flex justify-center items-center absolute bottom-16 left-0 right-0 h-12">
      {renderPaginationButtons()}
    </div>
  )
}

export default Pagination