// TimeLapseList/components/VideoModal.tsx
import React from 'react'
import { TimeLapseVideo } from '@/types/TimeLapse'

interface VideoModalProps {
  video: TimeLapseVideo
  onClose: () => void
}

const VideoModal: React.FC<VideoModalProps> = ({ video, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-3xl">
        <div className="p-4 flex justify-between items-center border-b">
          <h2 className="text-xl font-semibold">{video.title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        <div className="p-4">
          <div className="bg-gray-200 h-64 flex items-center justify-center mb-4">
            <p className="text-gray-500">비디오 플레이어</p>
          </div>
          <p className="text-sm text-gray-500 mb-2">
            {video.date} {video.time}
          </p>
          <p>{video.description}</p>
        </div>
      </div>
    </div>
  )
}

export default VideoModal