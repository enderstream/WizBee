import React, { useState, useEffect, useRef } from 'react';

interface PoseImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrls: string[];
  isLoading: boolean;
}

const PoseImageModal: React.FC<PoseImageModalProps> = ({
  isOpen,
  onClose,
  imageUrls,
  isLoading,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // 모달 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // ESC 키 누를 시 모달 닫기
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen, onClose]);

  // 터치 이벤트 핸들러
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;
    
    if (isLeftSwipe && currentIndex < imageUrls.length - 1) {
      // 왼쪽으로 스와이프 (다음 이미지)
      setCurrentIndex(currentIndex + 1);
    } else if (isRightSwipe && currentIndex > 0) {
      // 오른쪽으로 스와이프 (이전 이미지)
      setCurrentIndex(currentIndex - 1);
    }
    
    // 터치 상태 초기화
    setTouchStart(null);
    setTouchEnd(null);
  };

  // 이전 이미지로 이동
  const goToPrevious = () => {
    const isFirstImage = currentIndex === 0;
    const newIndex = isFirstImage ? imageUrls.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  // 다음 이미지로 이동
  const goToNext = () => {
    const isLastImage = currentIndex === imageUrls.length - 1;
    const newIndex = isLastImage ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 backdrop-blur-[2px] bg-black/20 flex items-center justify-center z-50 p-4">
      <div 
        ref={modalRef}
        className="bg-white rounded-lg w-full max-w-md overflow-hidden shadow-xl"
      >
        <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">잘못된 자세 이미지</h2>
          <button
            onClick={onClose}
            className="text-2xl text-gray-500 hover:text-gray-700 focus:outline-none"
            aria-label="닫기"
          >
            &times;
          </button>
        </div>

        <div className="p-4">
          {isLoading ? (
            // 로딩 중 표시
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              <p className="ml-3 text-gray-600">이미지 로딩 중...</p>
            </div>
          ) : imageUrls.length === 0 ? (
            // 이미지가 없는 경우 (204 응답이나 빈 배열)
            <div className="flex flex-col justify-center items-center h-64">
              <svg className="w-12 h-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-gray-600 text-center">촬영된 잘못된 자세가 없습니다</p>
            </div>
          ) : (
            // 이미지 슬라이더
            <div 
              className="relative overflow-hidden h-64"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <div 
                className="flex transition-transform duration-300 ease-in-out h-full"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
              >
                {imageUrls.map((url, index) => (
                  <div key={index} className="min-w-full px-2">
                    <img 
                      src={url} 
                      alt={`잘못된 자세 ${index + 1}`} 
                      className="w-full h-full object-contain rounded"
                    />
                  </div>
                ))}
              </div>
              
              {/* 좌우 화살표 네비게이션 */}
              <button
                onClick={goToPrevious}
                className="absolute left-0 top-1/2 -translate-y-1/2 bg-white bg-opacity-50 rounded-full p-1 shadow"
                aria-label="이전 이미지"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <button
                onClick={goToNext}
                className="absolute right-0 top-1/2 -translate-y-1/2 bg-white bg-opacity-50 rounded-full p-1 shadow"
                aria-label="다음 이미지"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              
              {/* 페이지네이션 인디케이터 */}
              <div className="absolute bottom-2 left-0 right-0 flex justify-center">
                {imageUrls.map((_, index) => (
                  <span
                    key={index}
                    className={`inline-block w-2 h-2 rounded-full mx-1 ${
                      index === currentIndex ? 'bg-blue-500' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* 푸터 영역 - 현재 이미지 표시 (이미지가 있을 경우만) */}
        {/* {!isLoading && imageUrls.length > 0 && (
          <div className="px-4 py-3 border-t border-gray-200 text-center text-sm text-gray-600">
            {currentIndex + 1} / {imageUrls.length}
          </div>
        )} */}
      </div>
    </div>
  );
};

export default PoseImageModal;