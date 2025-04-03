import React from 'react'
import { TimeLapseVideo } from '@/types/TimeLapse'
import '@/styles/TimeLapseVideos.css'

interface TimeLapseVideosProps {
  timelapseVideos: TimeLapseVideo[]
  playVideo: (video: TimeLapseVideo) => void
}

const TimeLapseVideos: React.FC<TimeLapseVideosProps> = ({
  timelapseVideos,
  playVideo,
}) => {
  return (
    <div className="timelapse-videos-container">
      {timelapseVideos.length === 0 ? (
        <div className="timelapse-empty-message">타임랩스 영상이 없습니다.</div>
      ) : (
        timelapseVideos.map((video) => (
          <div
            key={video.timelapseId}
            className="timelapse-video-item"
            onClick={() => playVideo(video)}
          >
            <div className="timelapse-thumbnail">
              <img
                src="/api/placeholder/320/180" // 실제 썸네일이 없으므로 placeholder 사용
                alt={video.timelapseTitle}
              />
            </div>
            <div className="timelapse-content">
              <div className="timelapse-header">
                <h3 className="timelapse-title">{video.timelapseTitle}</h3>
                <div className="timelapse-meta">
                  <p className="timelapse-date">{video.timelapseDate}</p>
                  <button className="timelapse-menu-button">•••</button>
                </div>
              </div>
              <p className="timelapse-description">{video.timelapseTitle}</p>
            </div>
          </div>
        ))
      )}
    </div>
  )
}

export default TimeLapseVideos
