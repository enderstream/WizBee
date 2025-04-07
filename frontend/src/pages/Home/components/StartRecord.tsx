import React from 'react'
import TimeLapseIcon from '@/assets/icons/TimeLapse.svg?react'

interface StartRecordProps {
  onStartClick: () => void
}

const StartRecord: React.FC<StartRecordProps> = ({ onStartClick }) => {
  return (
    <>
      <button
        className="w-full bg-blue-500 text-white rounded-xl mb-6 py-6 font-bold relative shadow-md transition-colors active:bg-blue-700 touch-manipulation"
        onClick={onStartClick}
      >
        <div className="flex items-center justify-center gap-2">
          <TimeLapseIcon width={28} height={28} className="fill-white" />
          <span className="text-xl">촬영 시작!</span>
        </div>
      </button>
    </>
  )
}

export default StartRecord