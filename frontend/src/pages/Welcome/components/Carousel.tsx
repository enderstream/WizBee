import React, { useState, useRef, useEffect, TouchEvent } from 'react'
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
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('left')
  const [isAnimating, setIsAnimating] = useState(false)
  const touchStartX = useRef(0)
  const touchEndX = useRef(0)
  const autoSlideInterval = useRef<NodeJS.Timeout | null>(null)
  const autoSlideDelay = 3000 // 3초 간격

  // 자동 슬라이드 시작
  const startAutoSlide = () => {
    stopAutoSlide() // 기존 인터벌 정리

    autoSlideInterval.current = setInterval(() => {
      if (!isAnimating) { // 애니메이션 중이 아닐 때만 슬라이드 전환
        changeSlide('next')
      }
    }, autoSlideDelay)
  }

  // 자동 슬라이드 정지
  const stopAutoSlide = () => {
    if (autoSlideInterval.current) {
      clearInterval(autoSlideInterval.current)
      autoSlideInterval.current = null
    }
  }

  // 컴포넌트 마운트/언마운트 시 자동 슬라이드 처리
  useEffect(() => {
    startAutoSlide()

    // 사용자가 다른 탭으로 이동했을 때 자동 슬라이드 중지
    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopAutoSlide()
      } else {
        startAutoSlide()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    // 클린업
    return () => {
      stopAutoSlide()
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, []) // 컴포넌트 마운트 시 한 번만 실행

  // 슬라이드 변경 공통 로직
  const changeSlide = (direction: 'next' | 'prev') => {
    if (isAnimating) return

    setIsAnimating(true)
    setSlideDirection(direction === 'next' ? 'left' : 'right')

    // 다음/이전 인덱스 계산
    const nextIndex = direction === 'next'
      ? (currentSlide + 1) % carouselImages.length
      : (currentSlide - 1 + carouselImages.length) % carouselImages.length

    // 현재 슬라이드 변경
    setCurrentSlide(nextIndex)

    // 애니메이션 완료 후 상태 리셋
    setTimeout(() => {
      setIsAnimating(false)
    }, 400)
  }

  // 이전 슬라이드로 이동
  const goToPrevSlide = () => {
    stopAutoSlide() // 수동 제어 시 자동 슬라이드 중지
    changeSlide('prev')
    startAutoSlide() // 수동 제어 완료 후 자동 슬라이드 재시작
  }

  // 다음 슬라이드로 이동
  const goToNextSlide = () => {
    stopAutoSlide() // 수동 제어 시 자동 슬라이드 중지
    changeSlide('next')
    startAutoSlide() // 수동 제어 완료 후 자동 슬라이드 재시작
  }

  // 터치 이벤트 핸들러
  const handleTouchStart = (e: TouchEvent) => {
    stopAutoSlide() // 터치 시작 시 자동 슬라이드 중지
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
        // 왼쪽으로 스와이프 (다음 슬라이드)
        goToNextSlide()
      } else {
        // 오른쪽으로 스와이프 (이전 슬라이드)
        goToPrevSlide()
      }
    } else {
      // 스와이프가 발생하지 않았을 때도 자동 슬라이드 재시작
      startAutoSlide()
    }
  }

  // 인디케이터로 특정 슬라이드로 이동
  const goToSlide = (index: number) => {
    if (isAnimating || index === currentSlide) return

    stopAutoSlide() // 수동 제어 시 자동 슬라이드 중지

    // 방향 결정
    const direction = ((index > currentSlide && !(currentSlide === carouselImages.length - 1 && index === 0)) ||
      (currentSlide === carouselImages.length - 1 && index === 0)) ? 'left' : 'right'

    setIsAnimating(true)
    setSlideDirection(direction)
    setCurrentSlide(index)

    setTimeout(() => {
      setIsAnimating(false)
      startAutoSlide() // 수동 제어 완료 후 자동 슬라이드 재시작
    }, 400)
  }

  return (
    <div className="w-full max-w-md mx-auto relative">
      <div
        className="w-full overflow-hidden relative p-2 mb-2"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
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
            onClick={() => goToSlide(index)}
            aria-label={`슬라이드 ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

export default Carousel