import { useState, useEffect } from 'react'
import { useTimeLapse } from '@/hooks/useTimeLapse'
import { TimeLapseVideo } from '@/types/TimeLapse'

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
    return (
      <div className="flex justify-center items-center h-screen">
        로딩 중...
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        {error}
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">타임랩스 모음</h1>

      {selectedVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-3xl">
            <div className="p-4 flex justify-between items-center border-b">
              <h2 className="text-xl font-semibold">
                {selectedVideo.timelapseTitle}
              </h2>
              <button
                onClick={closeVideo}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="p-4">
              <div className="bg-gray-200 h-64 flex items-center justify-center mb-4">
                <video
                  src={selectedVideo.timelapseUrl}
                  controls
                  className="w-full h-full object-contain"
                >
                  해당 브라우저는 비디오 태그를 지원하지 않습니다.
                </video>
              </div>
              <p className="text-sm text-gray-500 mb-2">
                {selectedVideo.timelapseDate}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-6">
        {timelapseVideos.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            타임랩스 영상이 없습니다.
          </div>
        ) : (
          timelapseVideos.map((video) => (
            <div
              key={video.timelapseId}
              className="border-b pb-4 flex space-x-4 cursor-pointer hover:bg-gray-50"
              onClick={() => playVideo(video)}
            >
              <div className="w-32 h-24 bg-gray-200 flex-shrink-0 overflow-hidden rounded">
                <img
                  src="/api/placeholder/320/180" // 실제 썸네일이 없으므로 placeholder 사용
                  alt={video.timelapseTitle}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <h3 className="font-medium">{video.timelapseTitle}</h3>
                  <div className="flex">
                    <p className="text-sm text-gray-500">
                      {video.timelapseDate}
                    </p>
                    <button className="ml-2 text-gray-400">•••</button>
                  </div>
                </div>
                <p className="text-sm mt-2">{video.timelapseTitle}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {timelapseVideos.length > 0 && pagination.totalPages > 1 && (
        <div className="flex justify-center items-center mt-6 space-x-4">
          <button
            className="px-2 py-1"
            onClick={() =>
              handlePageChange(Math.max(1, pagination.currentPage - 1))
            }
            disabled={pagination.currentPage === 1}
          >
            &lt;
          </button>

          {/* 페이지 번호 동적 생성 */}
          {Array.from(
            { length: Math.min(5, pagination.totalPages) },
            (_, i) => {
              // 현재 페이지를 중심으로 표시할 페이지 번호 계산
              const pageNum = i + 1
              return (
                <button
                  key={pageNum}
                  className={`px-2 py-1 ${pagination.currentPage === pageNum ? 'font-bold' : ''}`}
                  onClick={() => handlePageChange(pageNum)}
                >
                  {pageNum}
                </button>
              )
            },
          )}

          {pagination.totalPages > 5 && <span>.....</span>}

          {pagination.totalPages > 5 && (
            <button
              className="px-2 py-1"
              onClick={() => handlePageChange(pagination.totalPages)}
            >
              {pagination.totalPages}
            </button>
          )}

          <button
            className="px-2 py-1"
            onClick={() =>
              handlePageChange(
                Math.min(pagination.totalPages, pagination.currentPage + 1),
              )
            }
            disabled={pagination.currentPage === pagination.totalPages}
          >
            &gt;
          </button>
        </div>
      )}
    </div>
  )
}

export default TimeLapseList
