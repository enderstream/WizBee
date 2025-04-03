// import { useState, useEffect } from 'react'
// import { useTimeLapse } from '@/hooks/useTimeLapse'
// import { TimeLapseVideo } from '@/types/TimeLapse'
// import TimeLapseVideos from '@/pages/TimeLapseList/components/TimeLapseVideos'
// import TimeLapsePagination from '@/pages/TimeLapseList/components/TimeLapsePagination'
// import ReactPlayer from 'react-player/lazy'
// import '@/styles/TimeLapseList.css'

// const TimeLapseList = () => {
//   const [selectedVideo, setSelectedVideo] = useState<TimeLapseVideo | null>(
//     null,
//   )
//   const { timelapseVideos, pagination, isLoading, error, fetchTimeLapseList } =
//     useTimeLapse()

//   // 컴포넌트가 마운트될 때 타임랩스 목록 가져오기
//   useEffect(() => {
//     fetchTimeLapseList(1) // 첫 번째 페이지 데이터 가져오기
//   }, []) // 빈 의존성 배열로 컴포넌트 마운트 시 한 번만 실행

//   const closeVideo = () => {
//     setSelectedVideo(null)
//   }

//   const playVideo = (video: TimeLapseVideo) => {
//     setSelectedVideo(video)
//   }

//   const handlePageChange = (page: number) => {
//     fetchTimeLapseList(page)
//   }

//   if (isLoading) {
//     return <div className="timelapse-loading">로딩 중...</div>
//   }

//   if (error) {
//     return <div className="timelapse-error">{error}</div>
//   }

//   return (
//     <div className="timelapse-container">
//       <h1 className="timelapse-title">타임랩스 모음</h1>

//       <ReactPlayer url={"https://www.youtube.com/shorts/p0pGZqC-wUU"}/> 
//       <ReactPlayer url={"https://www.youtube.com/shorts/mgdCHjJjR4M"}/> 
//       <ReactPlayer url={"https://www.youtube.com/shorts/agDCUsgudzw"}/> 

//       {/* {selectedVideo && (
//         <div className="video-modal">
//           <div className="video-modal-content">
//             <div className="video-modal-header">
//               <h2 className="video-modal-title">
//                 {selectedVideo.timelapseTitle}
//               </h2>
//               <button onClick={closeVideo} className="video-modal-close-button">
//                 ✕
//               </button>
//             </div>
//             <div className="video-modal-body">
//               <div className="video-container">
//                 <video
//                   src={selectedVideo.timelapseUrl}
//                   controls
//                   className="video-player"
//                 >
//                   해당 브라우저는 비디오 태그를 지원하지 않습니다.
//                 </video>
//               </div>
//               <p className="video-date">{selectedVideo.timelapseDate}</p>
//             </div>
//           </div>
//         </div>
//       )}

//       <TimeLapseVideos
//         timelapseVideos={timelapseVideos}
//         playVideo={playVideo}
//       />

//       {timelapseVideos.length > 0 && pagination.totalPages > 1 && (
//         <TimeLapsePagination
//           currentPage={pagination.currentPage}
//           totalPages={pagination.totalPages}
//           onPageChange={handlePageChange}
//         />
//       )} */}
//     </div>
//   )
// }

// export default TimeLapseList



import { useState, useEffect } from 'react'
import { useTimeLapse } from '@/hooks/useTimeLapse'
import { TimeLapseVideo } from '@/types/TimeLapse'
import ReactPlayer from 'react-player/lazy'
import '@/styles/TimeLapseList.css'

const TimeLapseList = () => {
  const [selectedVideo, setSelectedVideo] = useState(null)
  const { timelapseVideos, pagination, isLoading, error, fetchTimeLapseList } = useTimeLapse()

  // 컴포넌트가 마운트될 때 타임랩스 목록 가져오기
  useEffect(() => {
    fetchTimeLapseList(1) // 첫 번째 페이지 데이터 가져오기
  }, []) // 빈 의존성 배열로 컴포넌트 마운트 시 한 번만 실행

  const handleVideoSelect = (video) => {
    setSelectedVideo(video)
  }

  const closeVideo = () => {
    setSelectedVideo(null)
  }

  const handlePageChange = (page) => {
    fetchTimeLapseList(page)
  }

  if (isLoading) {
    return <div className="timelapse-loading">로딩 중...</div>
  }

  if (error) {
    return <div className="timelapse-error">{error}</div>
  }

  // 샘플 비디오 데이터 (실제로는 useTimeLapse 훅으로부터 받은 데이터 사용)
  const dummyVideos = [
    {
      id: 1,
      timelapseUrl: "https://www.youtube.com/shorts/p0pGZqC-wUU",
      timelapseTitle: "타임랩스 샘플 1",
      timelapseDate: "2023-04-01"
    },
    {
      id: 2,
      timelapseUrl: "https://www.youtube.com/shorts/mgdCHjJjR4M",
      timelapseTitle: "타임랩스 샘플 2",
      timelapseDate: "2023-04-02"
    },
    {
      id: 3,
      timelapseUrl: "https://www.youtube.com/shorts/agDCUsgudzw",
      timelapseTitle: "타임랩스 샘플 3",
      timelapseDate: "2023-04-03"
    }
  ]

  // 실제 비디오 데이터 또는 더미 데이터 사용
  const videos = timelapseVideos.length > 0 ? timelapseVideos : dummyVideos

  return (
    <div className="timelapse-container">
      <h1 className="timelapse-title">타임랩스 모음</h1>

      {/* 썸네일 갤러리 목록 */}
      <div className="timelapse-grid">
        {videos.map((video) => (
          <div 
            key={video.id} 
            className="timelapse-item"
            onClick={() => handleVideoSelect(video)}
          >
            <div className="thumbnail-container">
              <ReactPlayer
                url={video.timelapseUrl}
                light={true} // 썸네일 모드 활성화
                width="100%"
                height="100%"
                className="timelapse-thumbnail"
                playIcon={<div className="play-icon"></div>}
              />
            </div>
            <div className="timelapse-info">
              <h3 className="timelapse-item-title">{video.timelapseTitle}</h3>
              <p className="timelapse-date">{video.timelapseDate}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 페이지네이션 */}
      {videos.length > 0 && pagination && pagination.totalPages > 1 && (
        <div className="pagination">
          <button
            className="pagination-button"
            disabled={pagination.currentPage === 1}
            onClick={() => handlePageChange(pagination.currentPage - 1)}
          >
            이전
          </button>
          
          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              className={`pagination-button ${pagination.currentPage === page ? 'active' : ''}`}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </button>
          ))}
          
          <button
            className="pagination-button"
            disabled={pagination.currentPage === pagination.totalPages}
            onClick={() => handlePageChange(pagination.currentPage + 1)}
          >
            다음
          </button>
        </div>
      )}

      {/* 비디오 모달 */}
      {selectedVideo && (
        <div className="video-modal" onClick={closeVideo}>
          <div className="video-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="video-modal-header">
              <h2 className="video-modal-title">{selectedVideo.timelapseTitle}</h2>
              <button onClick={closeVideo} className="video-modal-close-button">
                ✕
              </button>
            </div>
            <div className="video-modal-body">
              <ReactPlayer
                url={selectedVideo.timelapseUrl}
                controls={true}
                playing={true}
                width="100%"
                height="100%"
                className="video-player"
                config={{
                  youtube: {
                    playerVars: { 
                      showinfo: 1,
                      origin: window.location.origin
                    }
                  }
                }}
              />
              <p className="video-date">{selectedVideo.timelapseDate}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TimeLapseList