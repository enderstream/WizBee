import React, { useRef, useState, TouchEvent } from 'react'
import ReactPlayer from 'react-player/lazy'
import { TimeLapseVideo } from '@/types/TimeLapse'
import '@/styles/Video.css'

interface VideoProps {
  video: TimeLapseVideo
  isPlaying: boolean
}

const Video: React.FC<VideoProps> = ({ video }) => {
  const playerWrapperRef = useRef<HTMLDivElement>(null)
  const videoInfoRef = useRef<HTMLDivElement>(null)
  const [showPlayer, setShowPlayer] = useState(false)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const [isSliding, setIsSliding] = useState(false)

  // 슬라이드 관련 함수들
  const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    setTouchStart(e.targetTouches[0].clientX)
    setTouchEnd(null)
  }

  const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    setTouchEnd(e.targetTouches[0].clientX)

    if (touchStart && touchEnd && videoInfoRef.current) {
      const distance = touchStart - touchEnd

      // 왼쪽으로 스와이프 (최대 140px, 액션 버튼 너비와 동일)
      if (distance > 0 && distance <= 140) {
        videoInfoRef.current.style.transform = `translateX(-${distance}px)`
        setIsSliding(true)
      }
    }
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return

    const distance = touchStart - touchEnd

    if (videoInfoRef.current) {
      // 왼쪽으로 70px 이상 스와이프하면 완전히 열림
      if (distance > 70) {
        videoInfoRef.current.style.transform = 'translateX(-140px)'
        setIsSliding(true)
      } else {
        // 그렇지 않으면 원래 위치로 복귀
        videoInfoRef.current.style.transform = 'translateX(0)'
        setIsSliding(false)
      }
    }

    setTouchStart(null)
    setTouchEnd(null)
  }

  // 슬라이드 상태 초기화
  const resetSlide = () => {
    if (videoInfoRef.current) {
      videoInfoRef.current.style.transform = 'translateX(0)'
      setIsSliding(false)
    }
  }

  const handleEditClick = () => {
    console.log('수정 버튼 클릭!', video.timelapseTitle)
    resetSlide()
  }

  const handleDeleteClick = () => {
    console.log('삭제 버튼 클릭!', video.timelapseTitle)
    resetSlide()
  }

  const handlePlayButtonClick = (e: React.MouseEvent) => {
    // 이벤트 전파 중지 (부모 요소의 onClick이 발생하지 않도록)
    e.stopPropagation()

    // 슬라이드 중일 때는 비디오 재생 방지
    if (isSliding) {
      resetSlide()
      return
    }

    setShowPlayer(true)

    // 약간의 지연 후 전체화면 전환 (플레이어가 DOM에 마운트된 후)
    setTimeout(() => {
      if (playerWrapperRef.current && document.fullscreenEnabled) {
        playerWrapperRef.current.requestFullscreen().catch((err) => {
          console.error(`전체화면 전환 오류: ${err.message}`)
        })
      }
    }, 100)
  }

  const handleVideoItemClick = () => {
    // 슬라이드 중일 때는 슬라이드 초기화만 수행
    if (isSliding) {
      resetSlide()
    }
  }

  const handleCloseVideo = () => {
    // 전체화면 상태인 경우 빠져나오기
    if (document.fullscreenElement) {
      document.exitFullscreen().catch((err) => {
        console.error(`전체화면 종료 오류: ${err.message}`)
      })
    }

    // 플레이어 숨기기
    setShowPlayer(false)
  }

  // 동영상 재생 종료 시 호출되는 이벤트 핸들러
  const handleVideoEnded = () => {
    handleCloseVideo()
  }

  return (
    <div className="video-item">
      {!showPlayer ? (
        // 영상 정보만 표시 (클릭 가능한 영역)
        <div
          ref={videoInfoRef}
          className="video-info"
          onClick={handleVideoItemClick}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="video-content">
            <div className="play-button" onClick={handlePlayButtonClick}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="play-icon"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
            <div className="video-details-wrapper">
              <h3 className="video-title">{video.timelapseTitle}</h3>
              <p className="video-date">{video.timelapseDate}</p>
            </div>
          </div>

          {/* 슬라이드 시 나타나는 작업 버튼들 */}
          <div className="slide-actions">
            <button
              className="action-button edit-button"
              onClick={(e) => {
                e.stopPropagation()
                handleEditClick()
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
            </button>
            <button
              className="action-button delete-button"
              onClick={(e) => {
                e.stopPropagation()
                handleDeleteClick()
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                <line x1="10" y1="11" x2="10" y2="17"></line>
                <line x1="14" y1="11" x2="14" y2="17"></line>
              </svg>
            </button>
          </div>
        </div>
      ) : (
        // 플레이어 표시
        <div>
          <div ref={playerWrapperRef} className="player-container">
            <button
              className="close-button"
              onClick={handleCloseVideo}
              title="닫기"
            >
              ✕
            </button>
            <ReactPlayer
              url={video.timelapseUrl}
              controls
              playing={true}
              width={'100%'}
              height={'300px'}
              onEnded={handleVideoEnded}
            />
          </div>
          <div className="video-details">
            <h3 className="video-title">{video.timelapseTitle}</h3>
            <p className="video-date">{video.timelapseDate}</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default Video
