import React, { useState, useRef, TouchEvent } from 'react'
import MainPageImage from '@/assets/images/Tutorial_MainPage.png'
import StatisticsImage from '@/assets/images/Tutorial_Statistics.png'
import TimeLapseListImage from '@/assets/images/Tutorial_TimeLapseList.png'

// 실제 이미지 배열
const carouselImages = [
  {
    id: 1,
    src: MainPageImage,
    alt: "메인 페이지 튜토리얼"
  },
  {
    id: 2,
    src: StatisticsImage,
    alt: "통계 페이지 튜토리얼"
  },
  {
    id: 3,
    src: TimeLapseListImage,
    alt: "타임랩스 목록 튜토리얼"
  }
]

const Carousel: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const touchStartX = useRef(0)
  const touchEndX = useRef(0)
  const sliderRef = useRef<HTMLDivElement>(null)

  const goToPrevSlide = () => {
    setCurrentSlide((prev) => 
      prev === 0 ? carouselImages.length - 1 : prev - 1
    )
  }

  const goToNextSlide = () => {
    setCurrentSlide((prev) => 
      (prev + 1) % carouselImages.length
    )
  }

  // 터치 이벤트 핸들러
  const handleTouchStart = (e: TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchMove = (e: TouchEvent) => {
    touchEndX.current = e.touches[0].clientX
  }

  const handleTouchEnd = () => {
    // 스와이프 거리가 50px 이상일 때만 슬라이드 변경
    const swipeDistance = touchStartX.current - touchEndX.current
    if (Math.abs(swipeDistance) > 50) {
      if (swipeDistance > 0) {
        // 왼쪽으로 스와이프
        goToNextSlide()
      } else {
        // 오른쪽으로 스와이프
        goToPrevSlide()
      }
    }
  }

  return (
    <div className="w-full max-w-md mx-auto relative">
      <div 
        className="w-full overflow-hidden relative p-2 mb-2"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* 이미지 슬라이더 컨테이너 */}
        <div 
          ref={sliderRef}
          className="w-full flex transition-transform duration-300 ease-in-out"
          style={{ 
            transform: `translateX(-${currentSlide * 100}%)`,
          }}
        >
          {carouselImages.map((image, index) => (
            <div key={image.id} className="w-full flex-shrink-0">
              <img 
                src={image.src} 
                alt={image.alt}
                className="w-full h-auto object-contain"
                style={{ 
                  aspectRatio: '750/1220',
                  maxHeight: '400px' // 이미지 최대 높이 제한
                }}
              />
            </div>
          ))}
        </div>

      </div>
      
      {/* 하단 인디케이터 */}
      <div className="flex justify-center gap-2 mt-1">
        {carouselImages.map((_, index) => (
          <button
            key={index}
            className={`w-6 h-1 rounded-sm ${
              currentSlide === index ? 'bg-blue-500' : 'bg-gray-300'
            }`}
            onClick={() => setCurrentSlide(index)}
            aria-label={`슬라이드 ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

export default Carousel