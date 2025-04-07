import { useState } from 'react'
import { timeLapseAPI } from '@/api/timeLapseAPI'
import { useUserStore, selectUserId } from '@/store/userStore'
import { TimeLapseVideo } from '@/types/TimeLapse'

export const useTimeLapse = () => {
  const userId = useUserStore(selectUserId)
  const [timelapseVideos, setTimelapseVideos] = useState<TimeLapseVideo[]>([])
  const [pagination, setPagination] = useState({
    totalPages: 0,
    currentPage: 1,
    totalVideos: 0
  })
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const fetchTimeLapseList = async (page: number = 1) => {
    console.log(page)

    if (!userId) {
      setError('로그인이 필요합니다')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await timeLapseAPI.timeLapseList(userId)
      const timeLapseVideos: TimeLapseVideo[] = response.data
      console.log('타임랩스 목록 응답:', timeLapseVideos)

      setTimelapseVideos(timeLapseVideos)
      setPagination({
        totalPages: Math.ceil(timeLapseVideos.length / 10), // 페이지당 10개 항목 가정
        currentPage: page,
        totalVideos: timeLapseVideos.length
      })
    } catch (err) {
      console.error('타임랩스 목록 조회 실패:', err)
      setError('타임랩스 목록을 불러오는데 실패했습니다')
      setTimelapseVideos([])
      setPagination({
        totalPages: 0,
        currentPage: 1,
        totalVideos: 0
      })
    } finally {
      setIsLoading(false)
    }
  }

  return {
    timelapseVideos,
    pagination,
    isLoading,
    error,
    fetchTimeLapseList
  }
}