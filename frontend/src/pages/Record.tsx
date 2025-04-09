import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useUserStore, selectMachineId } from '@/store/userStore'
import { ROUTES } from '@/routes/routes'
import { timeLapseAPI } from '@/api/timeLapseAPI'

type DialogActionType = 'start' | 'stop' | null

const Record: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const machineId = useUserStore(selectMachineId)
  const [isRecording, setIsRecording] = useState<boolean>(false)
  const [timeLapseId, setTimeLapseId] = useState<string>("0")
  const [isCompleted, setIsCompleted] = useState<boolean>(false)
  const streamingURL = location.state?.streamingUrl
  
  // 다이얼로그 상태 관리
  const [showDialog, setShowDialog] = useState<boolean>(false)
  const [dialogAction, setDialogAction] = useState<DialogActionType>(null)
  const [dialogMessage, setDialogMessage] = useState<string>('')

  const openDialog = (action: DialogActionType) => {
    if (!action) return
    
    setDialogAction(action)
    
    if (action === 'start') {
      setDialogMessage('타임랩스 촬영을 시작하시겠습니까?')
    } else if (action === 'stop') {
      setDialogMessage('타임랩스 촬영을 종료하시겠습니까?')
    }
    
    setShowDialog(true)
  }

  const handleDialogConfirm = async () => {
    setShowDialog(false)
    
    if (dialogAction === 'start') {
      await startRecording()
    } else if (dialogAction === 'stop') {
      await stopRecording()
    }
  }

  const handleDialogCancel = () => {
    setShowDialog(false)
    setDialogAction(null)
  }

  const handleGoToHome = () => {
    // 촬영 중에는 아무 동작 하지 않음
    if (!isRecording) {
      navigate(ROUTES.HOME)
    }
  }

  const handleStartRecordingClick = () => {
    openDialog('start')
  }

  const handleStopRecordingClick = () => {
    openDialog('stop')
  }

  const startRecording = async () => {
    try {
      setIsRecording(true)
      console.log('타임랩스 촬영 시작')
      const response = await timeLapseAPI.startRecordingTimeLapse(machineId)
      setTimeLapseId(response.data.id)
      console.log(response.data.id)
    } catch (error) {
      console.error('촬영 시작 중 오류 발생:', error)
      setIsRecording(false)
    }
  }

  const stopRecording = async () => {
    try {
      setIsRecording(false)
      setIsCompleted(true)
      console.log('타임랩스 촬영 종료')
      console.log(timeLapseId)
      
      const response = await timeLapseAPI.finishRecordingTimeLapse(
        timeLapseId,
        '나의 타임랩스', // 임시로 하드코딩 된 값
      )
      console.log(response.status)
      console.log(response.data)
    } catch (error) {
      console.error('촬영 종료 중 오류 발생:', error)
      setIsCompleted(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* 헤더 */}
      <header className="pt-3 pb-2 mb-1 border-b border-blue-200">
        <div className="flex items-center">
          <div className="w-1 h-6 bg-blue-500 rounded-full mr-3"></div>
          <h1 className="text-xl font-bold text-gray-800">
          타임랩스 촬영
          </h1>
        </div>
      </header>

      {/* 카메라 컨테이너 */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
        {/* 스트리밍 화면 */}
        <div className="relative w-full h-64 md:h-80 bg-gray-100">
          {streamingURL ? (
            <img 
              src={streamingURL}
              alt="카메라 스트림"
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center p-4">
                <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                </svg>
                <p className="text-gray-500 font-medium">스트림을 불러올 수 없습니다</p>
              </div>
            </div>
          )}
          
          {/* 녹화 중 표시 */}
          {isRecording && (
            <div className="absolute top-4 right-4 flex items-center bg-black/70 text-white px-3 py-1.5 rounded-full animate-pulse">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 mr-2"></span>
              <span className="text-sm font-medium">녹화중</span>
            </div>
          )}
        </div>
        
        {/* 컨트롤 버튼 */}
        <div className="p-4 flex flex-col space-y-3">
          {!isRecording ? (
            <button 
              className="w-full py-3 bg-blue-500 text-white font-semibold rounded-lg active:bg-blue-600 disabled:bg-gray-300 disabled:text-gray-500 flex items-center justify-center"
              onClick={handleStartRecordingClick}
              disabled={!streamingURL || isCompleted}
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              촬영 시작
            </button>
          ) : (
            <button 
              className="w-full py-3 bg-red-500 text-white font-semibold rounded-lg active:bg-red-600 disabled:bg-gray-300 disabled:text-gray-500 flex items-center justify-center"
              onClick={handleStopRecordingClick}
              disabled={isCompleted}
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"></path>
              </svg>
              촬영 종료
            </button>
          )}
          
          <button 
            className={`w-full py-3 font-semibold rounded-lg border flex items-center justify-center
              ${isRecording 
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed opacity-50' 
                : 'border-gray-300 text-gray-700 bg-white active:bg-gray-100'}`}
            onClick={handleGoToHome}
            disabled={isRecording}
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            돌아가기
          </button>
        </div>
      </div>

      {/* 안내 메시지 */}
      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-center">
        {isCompleted ? (
          <p className="text-blue-700">타임랩스 촬영이 완료되었습니다.</p>
        ) : !isRecording ? (
          <p className="text-blue-700">타임랩스 촬영을 시작하려면 촬영 버튼을 누르세요.</p>
        ) : (
          <p className="text-blue-700">타임랩스 촬영 중... 종료하려면 종료 버튼을 누르세요.</p>
        )}
      </div>

      {/* 확인 다이얼로그 - 촬영 시작/종료만 확인 */}
      {showDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-sm overflow-hidden">
            <div className="p-5">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">확인</h3>
              <p className="text-gray-700">{dialogMessage}</p>
            </div>
            <div className="flex border-t border-gray-200">
              <button 
                className="flex-1 py-3 px-4 text-gray-700 font-medium border-r border-gray-200 active:bg-gray-100"
                onClick={handleDialogCancel}
              >
                취소
              </button>
              <button 
                className={`flex-1 py-3 px-4 font-medium ${
                  dialogAction === 'stop' ? 'text-red-600 active:bg-red-50' : 'text-blue-600 active:bg-blue-50'
                }`}
                onClick={handleDialogConfirm}
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default Record