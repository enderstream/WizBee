// TimeLapseList/index.tsx
import { useState } from 'react'
import VideoList from '@/pages/TimeLapseList/components/VideoList'
import VideoModal from '@/pages/TimeLapseList/components/VideoModal'
import Pagination from '@/pages/TimeLapseList/components/Pagination'
import { TimeLapseVideo } from '@/types/TimeLapse'

const TimeLapseList = () => {
  const [selectedVideo, setSelectedVideo] = useState<TimeLapseVideo | null>(null)

  // Sample video data - you can replace with your actual data
  const timelapseVideos = [
    {
      id: 1,
      title: '아침 공부',
      date: '2025-03-12',
      time: '16:37:13',
      thumbnail: '/api/placeholder/320/180',
      description: 'Study with me',
    },
    {
      id: 2,
      title: '오후 공부 시간',
      date: '2025-03-12',
      time: '16:37:13',
      thumbnail: '/api/placeholder/320/180',
      description: '책상에서 공부하기',
    },
  ]

  const handleVideoSelect = (video: TimeLapseVideo) => {
    setSelectedVideo(video)
  }

  const closeVideo = () => {
    setSelectedVideo(null)
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">타임랩스 모음</h1>

      {selectedVideo && (
        <VideoModal video={selectedVideo} onClose={closeVideo} />
      )}

      <VideoList videos={timelapseVideos} onVideoSelect={handleVideoSelect} />

      <Pagination totalPages={99} currentPage={1} />
    </div>
  )
}

export default TimeLapseList