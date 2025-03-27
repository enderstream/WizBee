// TimeLapseList/components/VideoItem.tsx
import React from 'react'
import { TimeLapseVideo } from '@/types/TimeLapse'

interface VideoItemProps {
  video: TimeLapseVideo
  onSelect: () => void
}

const VideoItem: React.FC<VideoItemProps> = ({ video, onSelect }) => {
  return (
    <div
      className="border-b pb-4 flex space-x-4 cursor-pointer hover:bg-gray-50"
      onClick={onSelect}
    >
      <div className="w-32 h-24 bg-gray-200 flex-shrink-0 overflow-hidden rounded">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-1">
        <div className="flex justify-between">
          <h3 className="font-medium">{video.title}</h3>
          <div className="flex">
            <p className="text-sm text-gray-500">{video.date}</p>
            <button className="ml-2 text-gray-400">•••</button>
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-1">{video.time}</p>
        <p className="text-sm mt-2">{video.description}</p>
      </div>
    </div>
  )
}

export default VideoItem
