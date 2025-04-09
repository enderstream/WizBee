import React, { useState, useEffect } from 'react'
import MainPageImage from '@/assets/images/Tutorial_MainPage.png'
import StatisticsImage from '@/assets/images/Tutorial_Statistics.png'
import TimeLapseListImage from '@/assets/images/Tutorial_TimeLapseList.png'

// 실제 이미지 배열
const carouselImages = [
  {
    id: 1,
    header: "",
    src: MainPageImage,
    alt: "메인 페이지 튜토리얼"
  },
  {
    id: 2,
    header: "",
    src: TimeLapseListImage,
    alt: "타임랩스 목록 튜토리얼"
  },
  {
    id: 3,
    header: "",
    src: StatisticsImage,
    alt: "통계 페이지 튜토리얼"
  }
]

const Carousel: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('left')
  const [isAnimating, setIsAnimating] = useState(false)
  const autoSlideDelay = 2000 // 1초 간격

  // 슬라이드 변경 함수
  const changeSlide = () => {
    if (isAnimating) return

    setIsAnimating(true)
    setSlideDirection('left') // 항상 왼쪽 방향으로 슬라이드

    // 다음 인덱스 계산
    const nextIndex = (currentSlide + 1) % carouselImages.length

    // 현재 슬라이드 변경
    setCurrentSlide(nextIndex)

    // 애니메이션 완료 후 상태 리셋
    setTimeout(() => {
      setIsAnimating(false)
    }, 400)
  }

  // 자동 슬라이드 설정
  useEffect(() => {
    const interval = setInterval(() => {
      changeSlide()
    }, autoSlideDelay)

    // 컴포넌트 언마운트 시 인터벌 제거
    return () => clearInterval(interval)
  }, [currentSlide, isAnimating]) // currentSlide, isAnimating이 변경될 때마다 인터벌 재설정

  return (
    <div className="w-full max-w-md mx-auto relative">
      <div className="w-full overflow-hidden relative p-2 mb-2">
        <div className="relative w-full" style={{ height: '400px' }}>
          {carouselImages.map((image, index) => {
            // 현재 활성 슬라이드인지 확인
            const isActive = index === currentSlide

            // 슬라이드 위치 계산 (애니메이션 전/후 위치)
            let translateX = '0'

            if (!isActive) {
              // 비활성 슬라이드의 초기 위치
              translateX = slideDirection === 'left' ? '100%' : '-100%'
            }

            return (
              <div
                key={image.id}
                className="absolute top-0 left-0 w-full h-full transition-transform duration-300 ease-in-out"
                style={{
                  opacity: isActive ? 1 : 0,
                  transform: `translateX(${translateX})`,
                  zIndex: isActive ? 10 : 0,
                  visibility: isActive ? 'visible' : 'hidden'
                }}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-contain"
                />
              </div>
            )
          })}
        </div>
      </div>

      {/* 하단 인디케이터 */}
      <div className="flex justify-center gap-2 mt-1">
        {carouselImages.map((_, index) => (
          <button
            key={index}
            className={`w-6 h-1 rounded-sm ${currentSlide === index ? 'bg-blue-500' : 'bg-gray-300'
              }`}
            aria-label={`슬라이드 ${index + 1}`}
            disabled={isAnimating}
          />
        ))}
      </div>
    </div>
  )
}

export default Carousel