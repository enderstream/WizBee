import React, { useState, useRef, TouchEvent, useEffect } from 'react'
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
  const [slideDirection, setSlideDirection] = useState('')
  const [animating, setAnimating] = useState(false)
  const touchStartX = useRef(0)
  const touchEndX = useRef(0)
  const slideContainerRef = useRef<HTMLDivElement>(null)

  console.log(slideDirection)
  

  // 슬라이드 초기화 함수 - 애니메이션 완료 후 호출
  const resetSlides = () => {
    if (slideContainerRef.current) {
      slideContainerRef.current.style.transition = 'none'
      slideContainerRef.current.style.transform = `translateX(-100%)`
      setAnimating(false)
    }
  }

  // 슬라이드 변경 함수
  const changeSlide = (direction: 'next' | 'prev') => {
    if (animating || !slideContainerRef.current) return

    setAnimating(true)
    setSlideDirection(direction)

    slideContainerRef.current.style.transition = 'transform 300ms ease-in-out'
    
    if (direction === 'next') {
      slideContainerRef.current.style.transform = 'translateX(-200%)'
      
      setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % carouselImages.length)
        resetSlides()
      }, 300)
    } else {
      slideContainerRef.current.style.transform = 'translateX(0%)'
      
      setTimeout(() => {
        setCurrentSlide((prev) => prev === 0 ? carouselImages.length - 1 : prev - 1)
        resetSlides()
      }, 300)
    }
  }

  // 이전 슬라이드로 이동
  const goToPrevSlide = () => changeSlide('prev')

  // 다음 슬라이드로 이동
  const goToNextSlide = () => changeSlide('next')

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
        // 왼쪽으로 스와이프 (다음 슬라이드)
        goToNextSlide()
      } else {
        // 오른쪽으로 스와이프 (이전 슬라이드)
        goToPrevSlide()
      }
    }
  }

  // 인디케이터로 특정 슬라이드로 이동
  const goToSlide = (index: number) => {
    if (animating || index === currentSlide) return
    
    // 방향 판단 (현재 이미지보다 인덱스가 크면 next, 작으면 prev)
    // 단, 첫 슬라이드에서 마지막으로 가는 경우와 마지막에서 첫 슬라이드로 가는 경우 처리
    let direction: 'next' | 'prev'
    
    if (currentSlide === 0 && index === carouselImages.length - 1) {
      direction = 'prev'
    } else if (currentSlide === carouselImages.length - 1 && index === 0) {
      direction = 'next'
    } else {
      direction = index > currentSlide ? 'next' : 'prev'
    }
    
    // 한 번에 한 슬라이드씩 이동
    changeSlide(direction)
    
    // 여러 슬라이드를 이동해야 하는 경우 타이머 설정
    if (Math.abs(index - currentSlide) > 1 && 
        !(currentSlide === 0 && index === carouselImages.length - 1) && 
        !(currentSlide === carouselImages.length - 1 && index === 0)) {
      
      const interval = setInterval(() => {
        setCurrentSlide((prev) => {
          if (prev === index) {
            clearInterval(interval)
            return prev
          }
          return direction === 'next' ? 
            (prev + 1) % carouselImages.length : 
            (prev - 1 + carouselImages.length) % carouselImages.length
        })
      }, 350)
    }
  }

  // 현재 표시할 이미지들 계산 (현재, 이전, 다음)
  const getPrevIndex = () => (currentSlide - 1 + carouselImages.length) % carouselImages.length
  const getNextIndex = () => (currentSlide + 1) % carouselImages.length

  // 컴포넌트 마운트 시 초기 위치 설정
  useEffect(() => {
    if (slideContainerRef.current) {
      slideContainerRef.current.style.transform = 'translateX(-100%)'
    }
  }, [])

  return (
    <div className="w-full max-w-md mx-auto relative">
      <div 
        className="w-full overflow-hidden relative p-2 mb-2"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* 슬라이드 컨테이너 - 항상 3개의 슬라이드 표시 (이전, 현재, 다음) */}
        <div 
          ref={slideContainerRef}
          className="flex w-full"
          style={{ transform: 'translateX(-100%)' }}
        >
          {/* 이전 슬라이드 */}
          <div className="w-full flex-shrink-0">
            <img 
              src={carouselImages[getPrevIndex()].src}
              alt={carouselImages[getPrevIndex()].alt}
              className="w-full h-auto object-contain"
              style={{ 
                aspectRatio: '750/1220',
                maxHeight: '400px'
              }}
            />
          </div>
          
          {/* 현재 슬라이드 */}
          <div className="w-full flex-shrink-0">
            <img 
              src={carouselImages[currentSlide].src}
              alt={carouselImages[currentSlide].alt}
              className="w-full h-auto object-contain"
              style={{ 
                aspectRatio: '750/1220',
                maxHeight: '400px'
              }}
            />
          </div>
          
          {/* 다음 슬라이드 */}
          <div className="w-full flex-shrink-0">
            <img 
              src={carouselImages[getNextIndex()].src}
              alt={carouselImages[getNextIndex()].alt}
              className="w-full h-auto object-contain"
              style={{ 
                aspectRatio: '750/1220',
                maxHeight: '400px'
              }}
            />
          </div>
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
            onClick={() => goToSlide(index)}
            aria-label={`슬라이드 ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

export default Carousel