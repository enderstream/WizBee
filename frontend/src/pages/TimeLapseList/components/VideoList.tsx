// TimeLapseList/components/VideoList.tsx
import React from 'react'
import VideoItem from '@/pages/TimeLapseList/components/VideoItem'
import { TimeLapseVideo } from '@/types/TimeLapse'

interface VideoListProps {
  videos: TimeLapseVideo[]
  onVideoSelect: (video: TimeLapseVideo) => void
}

const VideoList: React.FC<VideoListProps> = ({ videos, onVideoSelect }) => {
  return (
    <div className="grid gap-6">
      {videos.map((video) => (
        <VideoItem 
          key={video.id} 
          video={video} 
          onSelect={() => onVideoSelect(video)} 
        />
      ))}
    </div>
  )
}

export default VideoList