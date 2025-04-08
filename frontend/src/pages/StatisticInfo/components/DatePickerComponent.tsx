import React, { useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { ko } from 'date-fns/locale'

interface DatePickerComponentProps {
  className?: string // 추가 클래스명을 받을 수 있게 함
  onDateChange?: (date: Date | null) => void // 날짜 변경 이벤트 핸들러
}

const DatePickerComponent: React.FC<DatePickerComponentProps> = ({ 
  className = '',
  onDateChange
}) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [flashingButton, setFlashingButton] = useState<string | null>(null)

  // 날짜 변경 처리 함수
  const handleDateChange = (date: Date | null) => {
    if (date) {
      setSelectedDate(date)
      if (onDateChange) {
        onDateChange(date)
      }
    }
  }

  // 전날로 이동
  const handlePrevDay = () => {
    const newDate = new Date(selectedDate)
    newDate.setDate(selectedDate.getDate() - 1)
    handleDateChange(newDate)
  }

  // 다음날로 이동
  const handleNextDay = () => {
    const newDate = new Date(selectedDate)
    newDate.setDate(selectedDate.getDate() + 1)
    handleDateChange(newDate)
  }

  // 네비게이션 버튼 플래시 효과 처리 함수
  const handleNavButtonTouch = (buttonName: string, action: () => void) => {
    setFlashingButton(buttonName)
    
    // 깜박임 효과를 0.15초 동안 표시한 후 제거
    setTimeout(() => {
      setFlashingButton(null)
      action()
    }, 150)
  }
  
  // 네비게이션 버튼 스타일 클래스
  const getNavBtnClass = (buttonName: string) => {
    return `flex items-center justify-center text-gray-600 relative rounded-md px-2
      ${flashingButton === buttonName ? 'bg-blue-200' : ''} 
      cursor-pointer`
  }

  // 날짜 포맷팅 함수 (YYYY-MM-DD 형식)
  const formatDate = (date: Date): string => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  return (
    <div className={`fixed bottom-[56px] left-0 right-0 flex justify-center items-center py-2 bg-white ${className}`}>
      <div className="flex justify-center items-center">
        {/* 이전 날짜 버튼 (<-) */}
        <button
          onTouchStart={() => handleNavButtonTouch('prev', handlePrevDay)}
          onClick={handlePrevDay}
          className={getNavBtnClass('prev')}
          aria-label="이전 날짜로 이동"
        >
          &lt;
        </button>

        {/* 날짜 표시 */}
        <div className="flex items-center mx-4">
          <DatePicker
            selected={selectedDate}
            onChange={handleDateChange}
            locale={ko}
            dateFormat="yyyy-MM-dd"
            className="text-center border-none focus:outline-none cursor-pointer"
            customInput={
              <div className="flex items-center">
                <span>{formatDate(selectedDate)}</span>
                <button className="ml-2">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M8 2V5M16 2V5M3.5 9.09H20.5M21 8.5V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V8.5C3 5.5 4.5 3.5 8 3.5H16C19.5 3.5 21 5.5 21 8.5Z"
                      stroke="#292D32"
                      strokeWidth="1.5"
                      strokeMiterlimit="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            }
          />
        </div>

        {/* 다음 날짜 버튼 (->) */}
        <button
          onTouchStart={() => handleNavButtonTouch('next', handleNextDay)}
          onClick={handleNextDay}
          className={getNavBtnClass('next')}
          aria-label="다음 날짜로 이동"
        >
          &gt;
        </button>
      </div>
    </div>
  )
}

export default DatePickerComponent