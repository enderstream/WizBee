// import React from 'react';
// import ReactPlayer from 'react-player/lazy';
// import { TimeLapseVideo } from '@/types/TimeLapse';

// interface VideoProps {
//   video: TimeLapseVideo;
//   isPlaying: boolean;
// }

// const Video: React.FC<VideoProps> = ({ video, isPlaying }) => {
//   return (
//     <div className="mb-5 border p-4 rounded shadow-sm">
//       <ReactPlayer
//         url={video.timelapseUrl}
//         muted
//         controls
//         playing={isPlaying}
//         width={"100%"}
//         height={"300px"}
//       />
//       <h3 className="mt-2 text-lg font-medium">{video.timelapseTitle}</h3>
//       <p className="text-sm text-gray-500">{video.timelapseDate}</p>
//     </div>
//   );
// };

// export default Video;


import React, { useRef } from 'react';
import ReactPlayer from 'react-player/lazy';
import { TimeLapseVideo } from '@/types/TimeLapse';

interface VideoProps {
  video: TimeLapseVideo;
  isPlaying: boolean;
}

const Video: React.FC<VideoProps> = ({ video, isPlaying }) => {
  const playerWrapperRef = useRef<HTMLDivElement>(null);
  
  const handlePlay = () => {
    // 전체화면으로 전환
    if (playerWrapperRef.current && document.fullscreenEnabled) {
      playerWrapperRef.current.requestFullscreen()
        .catch(err => {
          console.error(`전체화면 전환 오류: ${err.message}`);
        });
    }
  };

  return (
    <div className="mb-5 border p-4 rounded shadow-sm">
      <div 
        ref={playerWrapperRef} 
        className="relative"
      >
        <ReactPlayer
          url={video.timelapseUrl}
          muted
          controls
          playing={isPlaying}
          width={"100%"}
          height={"300px"}
          onPlay={handlePlay}
        />
      </div>
      <h3 className="mt-2 text-lg font-medium">{video.timelapseTitle}</h3>
      <p className="text-sm text-gray-500">{video.timelapseDate}</p>
    </div>
  );
};

export default Video;