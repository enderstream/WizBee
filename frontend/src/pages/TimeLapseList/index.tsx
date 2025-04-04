import React, { useEffect, useState } from 'react'
import { selectUserId, useUserStore } from '@/store/userStore'
import { timeLapseAPI } from '@/api/timeLapseAPI'
import { useQuery } from '@tanstack/react-query'
import { TimeLapseVideo } from '@/types/TimeLapse'
import Pagination from './components/Pagination'
import Video from './components/Video'

const TimeLapseList = () => {
  const userId = useUserStore(selectUserId)
  const {
    data: timelapseVideos,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['timeLapseList', userId],
    queryFn: () => timeLapseAPI.timeLapseList(userId),
    staleTime: 30 * 60 * 1000,
    enabled: !!userId,
  })
  console.log(timelapseVideos?.data)

  const [isWindow, setIsWindow] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  
  // 페이지네이션 관련 상태 추가
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 3 // 페이지당 3개 영상 표시

  useEffect(() => {
    setIsWindow(true);
  }, []);

  const handleBtn = (): void => {
    setIsPlaying(!isPlaying);
  };

  // 페이지네이션 로직
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = timelapseVideos?.data ? timelapseVideos.data.slice(indexOfFirstItem, indexOfLastItem) : []
  const totalPages = Math.ceil((timelapseVideos?.data?.length || 0) / itemsPerPage)

  // 페이지 변경 핸들러
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber)
    // 페이지 상단으로 스크롤 (선택적)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (isLoading) {
    return <div>로딩 중...</div>
  }

  if (error) {
    return <div>에러가 발생했습니다.</div>
  }

  return (
    <>
      <section>
        <h2>React Player</h2>
        {isWindow && timelapseVideos?.data && timelapseVideos.data.length > 0 ? (
          <div>
            <div className="grid gap-6">
              {currentItems.map((video: TimeLapseVideo) => (
                <Video 
                  key={video.timelapseId} 
                  video={video} 
                  isPlaying={isPlaying} 
                />
              ))}
            </div>
            
            {/* 페이지네이션 컴포넌트 사용 */}
            {timelapseVideos.data.length > itemsPerPage && (
              <Pagination 
                currentPage={currentPage} 
                totalPages={totalPages} 
                onPageChange={handlePageChange} 
              />
            )}
          </div>
        ) : (
          <div>표시할 타임랩스 영상이 없습니다.</div>
        )}
      </section>
    </>
  );
}

export default TimeLapseList