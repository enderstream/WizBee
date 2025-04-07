import React, { useState } from 'react'

// 페이지네이션 컴포넌트
interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (pageNumber: number) => void
  className?: string // 추가 클래스명을 받을 수 있게 함
}

const Pagination: React.FC<PaginationProps> = ({ 
  currentPage, 
  totalPages, 
  onPageChange,
  className = '' 
}) => {
  // 네비게이션 버튼 깜박임 효과를 위한 상태
  const [flashingButton, setFlashingButton] = useState<string | null>(null);
  
  // 항상 5개의 버튼이 보이도록 범위 계산
  const getPageRange = () => {
    const displayCount = 5 // 5개 표시로 수정
    if (totalPages <= displayCount) {
      return { startPage: 1, endPage: totalPages }
    }
    let startPage = Math.max(1, currentPage - Math.floor(displayCount / 2))
    let endPage = startPage + displayCount - 1
    if (endPage > totalPages) {
      endPage = totalPages
      startPage = Math.max(1, endPage - displayCount + 1)
    }
    return { startPage, endPage }
  }

  const { startPage, endPage } = getPageRange()
  const pageNumbers = []
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i)
  }

  // 첫 페이지 여부 확인
  const isFirstPage = currentPage === 1;
  
  // 마지막 페이지 여부 확인
  const isLastPage = currentPage === totalPages;

  // 네비게이션 버튼 플래시 효과 처리 함수
  const handleNavButtonTouch = (buttonName: string, action: () => void) => {
    // 첫 페이지에서 이전 버튼, 마지막 페이지에서 다음 버튼은 작동하지 않음
    if ((buttonName === 'first' || buttonName === 'prev') && isFirstPage) return;
    if ((buttonName === 'last' || buttonName === 'next') && isLastPage) return;
    
    setFlashingButton(buttonName);
    
    // 깜박임 효과를 0.15초 동안 표시한 후 제거
    setTimeout(() => {
      setFlashingButton(null);
      action();
    }, 150);
  };
  
  // 네비게이션 버튼 스타일 클래스
  const getNavBtnClass = (buttonName: string) => {
    // 첫 페이지에서는 왼쪽 버튼들 비활성화, 마지막 페이지에서는 오른쪽 버튼들 비활성화
    const isDisabled = 
      ((buttonName === 'first' || buttonName === 'prev') && isFirstPage) || 
      ((buttonName === 'last' || buttonName === 'next') && isLastPage);
    
    return `w-8 h-8 flex items-center justify-center text-gray-600 relative rounded-md
      ${flashingButton === buttonName ? 'bg-blue-200' : ''} 
      ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`;
  };
  
  // 페이지 번호 버튼 스타일 클래스
  const getPageBtnClass = (isActive: boolean) => {
    return `w-8 h-8 flex items-center justify-center mx-1 cursor-pointer rounded-md ${
      isActive 
        ? 'bg-blue-500 text-white' 
        : 'text-gray-600'
    }`;
  };

  return (
    <div className={`fixed bottom-[56px] left-0 right-0 flex justify-center items-center py-2 bg-white ${className}`}>
      <div className="flex justify-center items-center">
        {/* 첫 페이지 버튼 (<<) */}
        <button
          onTouchStart={() => handleNavButtonTouch('first', () => onPageChange(1))}
          disabled={isFirstPage}
          className={getNavBtnClass('first')}
          aria-label="첫 페이지로 이동"
        >
          &lt;&lt;
        </button>

        {/* 이전 페이지 버튼 (<) */}
        <button
          onTouchStart={() => handleNavButtonTouch('prev', () => onPageChange(currentPage - 1))}
          disabled={isFirstPage}
          className={getNavBtnClass('prev')}
          aria-label="이전 페이지로 이동"
        >
          &lt;
        </button>

        {/* 페이지 번호 버튼 */}
        {pageNumbers.map(pageNumber => (
          <button
            key={pageNumber}
            onClick={() => onPageChange(pageNumber)}
            className={getPageBtnClass(pageNumber === currentPage)}
            aria-label={`${pageNumber} 페이지로 이동`}
            aria-current={pageNumber === currentPage ? 'page' : undefined}
          >
            {pageNumber}
          </button>
        ))}

        {/* 다음 페이지 버튼 (>) */}
        <button
          onTouchStart={() => handleNavButtonTouch('next', () => onPageChange(currentPage + 1))}
          disabled={isLastPage}
          className={getNavBtnClass('next')}
          aria-label="다음 페이지로 이동"
        >
          &gt;
        </button>

        {/* 마지막 페이지 버튼 (>>) */}
        <button
          onTouchStart={() => handleNavButtonTouch('last', () => onPageChange(totalPages))}
          disabled={isLastPage}
          className={getNavBtnClass('last')}
          aria-label="마지막 페이지로 이동"
        >
          &gt;&gt;
        </button>
      </div>
    </div>
  )
}

export default Pagination