import { useState } from 'react'

const TimeLapseList = () => {
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


    </div>
  )
}

export default TimeLapseList
