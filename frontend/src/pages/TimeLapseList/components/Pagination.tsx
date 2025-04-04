import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (pageNumber: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  // 페이지네이션 버튼 생성 함수
  const renderPaginationButtons = () => {
    const pageButtons = [];
    const maxDisplayedPages = 5; // 최대 표시할 페이지 수
    
    // 첫 페이지와 이전 페이지 버튼
    pageButtons.push(
      <button 
        key="first" 
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
        className="px-3 py-1 mx-1 border rounded"
      >
        &lt;&lt;
      </button>
    );
    
    pageButtons.push(
      <button 
        key="prev" 
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1 mx-1 border rounded"
      >
        &lt;
      </button>
    );
    
    // 페이지 번호 버튼
    if (totalPages <= maxDisplayedPages) {
      // 총 페이지 수가 적은 경우 모든 페이지 버튼 표시
      for (let i = 1; i <= totalPages; i++) {
        pageButtons.push(
          <button
            key={i}
            onClick={() => onPageChange(i)}
            className={`px-3 py-1 mx-1 border rounded ${currentPage === i ? 'bg-blue-500 text-white' : ''}`}
          >
            {i}
          </button>
        );
      }
    } else {
      // 페이지 수가 많은 경우 일부만 표시하고 나머지는 ... 으로 생략
      let startPage = Math.max(1, currentPage - 1);
      let endPage = Math.min(totalPages, startPage + 2);
      
      // 시작과 끝 페이지 조정
      if (currentPage <= 2) {
        // 현재 페이지가 앞쪽인 경우
        startPage = 1;
        endPage = 3;
      } else if (currentPage >= totalPages - 1) {
        // 현재 페이지가 뒤쪽인 경우
        startPage = totalPages - 2;
        endPage = totalPages;
      }
      
      // 첫 페이지
      if (startPage > 1) {
        pageButtons.push(
          <button
            key={1}
            onClick={() => onPageChange(1)}
            className={`px-3 py-1 mx-1 border rounded ${currentPage === 1 ? 'bg-blue-500 text-white' : ''}`}
          >
            1
          </button>
        );
        
        // 생략 표시 (...)
        if (startPage > 2) {
          pageButtons.push(
            <span key="ellipsis1" className="px-2 py-1">...</span>
          );
        }
      }
      
      // 중간 페이지 버튼
      for (let i = startPage; i <= endPage; i++) {
        pageButtons.push(
          <button
            key={i}
            onClick={() => onPageChange(i)}
            className={`px-3 py-1 mx-1 border rounded ${currentPage === i ? 'bg-blue-500 text-white' : ''}`}
          >
            {i}
          </button>
        );
      }
      
      // 마지막 페이지
      if (endPage < totalPages) {
        // 생략 표시 (...)
        if (endPage < totalPages - 1) {
          pageButtons.push(
            <span key="ellipsis2" className="px-2 py-1">...</span>
          );
        }
        
        pageButtons.push(
          <button
            key={totalPages}
            onClick={() => onPageChange(totalPages)}
            className={`px-3 py-1 mx-1 border rounded ${currentPage === totalPages ? 'bg-blue-500 text-white' : ''}`}
          >
            {totalPages}
          </button>
        );
      }
    }
    
    // 다음 페이지와 마지막 페이지 버튼
    pageButtons.push(
      <button 
        key="next" 
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1 mx-1 border rounded"
      >
        &gt;
      </button>
    );
    
    pageButtons.push(
      <button 
        key="last" 
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
        className="px-3 py-1 mx-1 border rounded"
      >
        &gt;&gt;
      </button>
    );
    
    return pageButtons;
  };

  return (
    <div className="flex justify-center mt-6 mb-8">
      {renderPaginationButtons()}
    </div>
  );
};

export default Pagination;