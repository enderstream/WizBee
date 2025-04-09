import { useEffect, useState, useRef } from 'react'
import { selectUserId, useUserStore } from '@/store/userStore'
import { timeLapseAPI } from '@/api/timeLapseAPI'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { TimeLapseVideo } from '@/types/TimeLapse'
import Pagination from '@/pages/TimeLapseList/components/Pagination'
import Video from '@/pages/TimeLapseList/components/Video'
import '@/styles/TimeLapseList.css'

const TimeLapseList = () => {
  const userId = useUserStore(selectUserId)
  const queryClient = useQueryClient()

  const {
    data: timelapseVideos,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['timeLapseList', userId],
    queryFn: () => timeLapseAPI.timeLapseList(userId),
    staleTime: 30,
    enabled: !!userId,
    select: (data) => {
      // API 응답 데이터를 가공
      return {
        ...data,
        data: [...data.data].sort((a, b) => {
          // timelapseDate 기준으로 내림차순 정렬 (최신순)
          return new Date(b.timelapseDate).getTime() - new Date(a.timelapseDate).getTime();
        })
      };
    }
  });

  const [isWindow, setIsWindow] = useState<boolean>(false)
  const [isPlaying] = useState<boolean>(false)

  // 페이지네이션 관련 상태
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(7) // 기본값

  // 컨테이너 높이를 측정하기 위한 ref
  const containerRef = useRef<HTMLDivElement>(null)

  // 비디오 아이템 하나의 높이 (정확한 값)
  const videoItemHeight = 84 // 비디오 높이
  const videoMarginBottom = 16 // 비디오 아이템 하단 마진
  const totalVideoItemHeight = videoItemHeight + videoMarginBottom // 비디오 아이템 전체 높이(마진 포함)

  // 하단 영역 높이 (하단바 + 페이지네이션)
  const bottomNavHeight = 56 // 하단바 높이
  const paginationHeight = 48 // 페이지네이션 높이

  // 새 헤더 높이 계산 (헤더 + 마진)
  const headerHeight = 56 // h1(28px) + 패딩(16px 위 + 12px 아래)

  useEffect(() => {
    setIsWindow(true)

    // 모바일 전용 뷰포트 설정
    document
      .querySelector('meta[name="viewport"]')
      ?.setAttribute(
        'content',
        'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no',
      )

    // 화면 크기에 따라 한 페이지에 표시할 아이템 수 계산
    const calculateItemsPerPage = () => {
      if (!containerRef.current) return

      const availableHeight =
        window.innerHeight - bottomNavHeight - paginationHeight - headerHeight

      // 화면에 표시할 수 있는 최대 아이템 수 계산
      let maxItems = Math.floor(availableHeight / totalVideoItemHeight)

      // 최소 1개 이상, 최대 전체 개수로 제한
      maxItems = Math.max(1, maxItems)

      // 전체 아이템 개수가 계산된 maxItems보다 작으면 전체 아이템 개수로 설정
      const totalItems = timelapseVideos?.data?.length || 0
      setItemsPerPage(totalItems <= maxItems ? totalItems : maxItems)
    }

    // 초기 계산
    calculateItemsPerPage()

    // 화면 크기 변경 시 재계산
    const handleResize = () => {
      calculateItemsPerPage()
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [timelapseVideos?.data?.length])

  // 현재 페이지 아이템 계산
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = timelapseVideos?.data
    ? timelapseVideos.data.slice(indexOfFirstItem, indexOfLastItem)
    : []

  // 총 페이지 수 계산
  const totalPages = Math.ceil(
    (timelapseVideos?.data?.length || 0) / itemsPerPage,
  )

  // 페이지네이션이 필요한지 확인 (모든 아이템이 한 페이지에 표시되는 경우)
  const needsPagination = (timelapseVideos?.data?.length || 0) > itemsPerPage

  // 페이지 변경 핸들러
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // 비디오 제목 업데이트 핸들러
  const handleVideoUpdate = (id: string, newTitle: string) => {
    if (!timelapseVideos?.data) return

    // React Query 캐시 업데이트
    queryClient.setQueryData(['timeLapseList', userId], {
      ...timelapseVideos,
      data: timelapseVideos.data.map((video: TimeLapseVideo) =>
        video.timelapseId === id
          ? { ...video, timelapseTitle: newTitle }
          : video,
      ),
    })
  }

  // 비디오 삭제 핸들러
  const handleVideoDelete = (id: string) => {
    if (!timelapseVideos?.data) return

    // React Query 캐시 업데이트
    const updatedData = timelapseVideos.data.filter(
      (video: TimeLapseVideo) => video.timelapseId !== id,
    )

    queryClient.setQueryData(['timeLapseList', userId], {
      ...timelapseVideos,
      data: updatedData,
    })

    // 현재 페이지가 비었고, 이전 페이지가 있으면 이전 페이지로 이동
    if (currentItems.length === 1 && currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-base text-gray-600">로딩 중...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-base text-red-500">에러가 발생했습니다.</div>
      </div>
    )
  }

  return (
    <div className="bg-white h-full" ref={containerRef}>
      <div className="px-4 pb-4">
        {/* 스타일링된 헤더 */}
        <header className="pt-4 pb-3 mb-3 border-b border-blue-200">
          <div className="flex items-center">
            <div className="w-1 h-6 bg-blue-500 rounded-full mr-3"></div>
            <h1 className="text-xl font-bold text-gray-800">타임랩스 목록</h1>
            <div className="ml-auto bg-blue-100 text-blue-600 text-xs font-medium rounded-full px-2 py-1">
              {timelapseVideos?.data?.length || 0}개
            </div>
          </div>
        </header>

        {isWindow &&
        timelapseVideos?.data &&
        timelapseVideos.data.length > 0 ? (
          <div>
            <div className={`${needsPagination ? 'mb-16' : 'mb-4'}`}>
              {currentItems.map((video: TimeLapseVideo) => (
                <Video
                  key={video.timelapseId}
                  video={video}
                  isPlaying={isPlaying}
                  onVideoUpdate={handleVideoUpdate}
                  onVideoDelete={handleVideoDelete}
                />
              ))}
            </div>

            {/* 페이지네이션 컴포넌트 (필요한 경우에만 표시) */}
            {needsPagination && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </div>
        ) : (
          <div className="flex justify-center items-center py-8">
            <div className="text-base text-gray-500">
              표시할 타임랩스 영상이 없습니다.
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default TimeLapseList
