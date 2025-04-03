import { useState, useEffect } from 'react'
import { useTimeLapse } from '@/hooks/useTimeLapse'
import { TimeLapseVideo } from '@/types/TimeLapse'
import TimeLapseVideos from '@/pages/TimeLapseList/components/TimeLapseVideos'
import TimeLapsePagination from '@/pages/TimeLapseList/components/TimeLapsePagination'
import ReactPlayer from 'react-player'
import '@/styles/TimeLapseList.css'

const TimeLapseList = () => {
  const [selectedVideo, setSelectedVideo] = useState<TimeLapseVideo | null>(
    null,
  )
  const { timelapseVideos, pagination, isLoading, error, fetchTimeLapseList } =
    useTimeLapse()

  // 컴포넌트가 마운트될 때 타임랩스 목록 가져오기
  useEffect(() => {
    fetchTimeLapseList(1) // 첫 번째 페이지 데이터 가져오기
  }, []) // 빈 의존성 배열로 컴포넌트 마운트 시 한 번만 실행

  const closeVideo = () => {
    setSelectedVideo(null)
  }

  const playVideo = (video: TimeLapseVideo) => {
    setSelectedVideo(video)
  }

  const handlePageChange = (page: number) => {
    fetchTimeLapseList(page)
  }

  if (isLoading) {
    return <div className="timelapse-loading">로딩 중...</div>
  }

  if (error) {
    return <div className="timelapse-error">{error}</div>
  }

  return (
    <div className="timelapse-container">
      <h1 className="timelapse-title">타임랩스 모음</h1>

      <ReactPlayer url={"https://www.youtube.com/shorts/p0pGZqC-wUU"}/> 
      <ReactPlayer url={"https://www.youtube.com/shorts/mgdCHjJjR4M"}/> 
      <ReactPlayer url={"https://www.youtube.com/shorts/agDCUsgudzw"}/> 

      {/* {selectedVideo && (
        <div className="video-modal">
          <div className="video-modal-content">
            <div className="video-modal-header">
              <h2 className="video-modal-title">
                {selectedVideo.timelapseTitle}
              </h2>
              <button onClick={closeVideo} className="video-modal-close-button">
                ✕
              </button>
            </div>
            <div className="video-modal-body">
              <div className="video-container">
                <video
                  src={selectedVideo.timelapseUrl}
                  controls
                  className="video-player"
                >
                  해당 브라우저는 비디오 태그를 지원하지 않습니다.
                </video>
              </div>
              <p className="video-date">{selectedVideo.timelapseDate}</p>
            </div>
          </div>
        </div>
      )}

      <TimeLapseVideos
        timelapseVideos={timelapseVideos}
        playVideo={playVideo}
      />

      {timelapseVideos.length > 0 && pagination.totalPages > 1 && (
        <TimeLapsePagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={handlePageChange}
        />
      )} */}
    </div>
  )
}

export default TimeLapseList
