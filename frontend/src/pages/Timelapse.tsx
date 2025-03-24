import { useState } from 'react'

const Timelapse = () => {
  const [selectedVideo, setSelectedVideo] = useState(null)

  // Sample video data - you can replace with your actual data
  const timelapseVideos = [
    {
      id: 1,
      title: '유튜브에 업로드',
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
    {
      id: 3,
      title: '아침 루틴',
      date: '2025-03-12',
      time: '16:37:13',
      thumbnail: '/api/placeholder/320/180',
      description: 'Morning routine',
    },
    {
      id: 4,
      title: '저녁 독서 시간',
      date: '2025-03-12',
      time: '16:37:13',
      thumbnail: '/api/placeholder/320/180',
      description: '독서 타임랩스',
    },
    {
      id: 5,
      title: '주말 공부',
      date: '2025-03-12',
      time: '16:37:13',
      thumbnail: '/api/placeholder/320/180',
      description: 'Weekend study session',
    },
  ]

  //   const playVideo = (id) => {
  //     setSelectedVideo(timelapseVideos.find(video => video.id === id));
  //   };

  const closeVideo = () => {
    setSelectedVideo(null)
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">타임랩스 모음</h1>

      {selectedVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-3xl">
            <div className="p-4 flex justify-between items-center border-b">
              {/* <h2 className="text-xl font-semibold">{selectedVideo.title}</h2> */}
              <button
                onClick={closeVideo}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="p-4">
              <div className="bg-gray-200 h-64 flex items-center justify-center mb-4">
                <p className="text-gray-500">비디오 플레이어</p>
              </div>
              {/* <p className="text-sm text-gray-500 mb-2">{selectedVideo.date} {selectedVideo.time}</p> */}
              {/* <p>{selectedVideo.description}</p> */}
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-6">
        {timelapseVideos.map((video) => (
          <div
            key={video.id}
            className="border-b pb-4 flex space-x-4 cursor-pointer hover:bg-gray-50"
            // onClick={() => playVideo(video.id)}
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
        ))}
      </div>

      <div className="flex justify-center items-center mt-6 space-x-4">
        <button className="px-2 py-1">&lt;</button>
        <button className="px-2 py-1 font-bold">1</button>
        <button className="px-2 py-1">2</button>
        <span>.....</span>
        <button className="px-2 py-1">99</button>
        <button className="px-2 py-1">&gt;</button>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t">
        <div className="flex justify-around py-3 max-w-md mx-auto">
          <button className="p-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
          </button>
          <button className="p-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </button>
          <button className="p-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </button>
          <button className="p-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </button>
          <button className="p-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Timelapse
