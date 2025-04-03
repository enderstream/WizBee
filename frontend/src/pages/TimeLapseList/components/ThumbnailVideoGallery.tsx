

// import { useState } from 'react'
// import ReactPlayer from 'react-player/lazy'
// import '@/styles/ThumbnailVideoGallery.css'

// const ThumbnailVideoGallery = () => {
//   const [selectedVideo, setSelectedVideo] = useState(null)
  
//   // 비디오 목록 데이터
//   const videos = [
//     {
//       id: 1,
//       url: "https://www.youtube.com/shorts/p0pGZqC-wUU",
//       title: "타임랩스 영상 1"
//     },
//     {
//       id: 2,
//       url: "https://www.youtube.com/shorts/mgdCHjJjR4M",
//       title: "타임랩스 영상 2"
//     },
//     {
//       id: 3,
//       url: "https://www.youtube.com/shorts/agDCUsgudzw",
//       title: "타임랩스 영상 3"
//     },
//     {
//       id: 4,
//       url: "https://www.youtube.com/watch?v=LXb3EKWsInQ",
//       title: "타임랩스 영상 4"
//     }
//   ]

//   const handleVideoSelect = (video) => {
//     setSelectedVideo(video)
//   }

//   const closeVideo = () => {
//     setSelectedVideo(null)
//   }

//   return (
//     <div className="thumbnail-gallery-container">
//       <h1 className="gallery-title">타임랩스 모음</h1>
      
//       {/* 썸네일 목록 */}
//       <div className="video-thumbnails">
//         {videos.map((video) => (
//           <div key={video.id} className="thumbnail-item" onClick={() => handleVideoSelect(video)}>
//             <ReactPlayer 
//               url={video.url}
//               light={true}  // 썸네일 모드 활성화
//               width="100%"
//               height="100%"
//               className="thumbnail-player"
//             />
//             <div className="thumbnail-title">{video.title}</div>
//           </div>
//         ))}
//       </div>

//       {/* 선택된 비디오 모달 */}
//       {selectedVideo && (
//         <div className="video-modal">
//           <div className="video-modal-content">
//             <div className="video-modal-header">
//               <h2 className="video-modal-title">{selectedVideo.title}</h2>
//               <button onClick={closeVideo} className="video-modal-close-button">✕</button>
//             </div>
//             <div className="video-modal-body">
//               <ReactPlayer 
//                 url={selectedVideo.url}
//                 controls={true}
//                 playing={true}
//                 width="100%"
//                 height="100%"
//                 className="modal-player"
//               />
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }

// export default ThumbnailVideoGallery