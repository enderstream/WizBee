import React, { useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { ko } from 'date-fns/locale'
import '@/styles/DatePickerComponent.css'

interface DatePickerComponentProps {
  className?: string
  onDateChange?: (date: Date | null) => void
}

const DatePickerComponent: React.FC<DatePickerComponentProps> = ({
  className = '',
  onDateChange,
}) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [flashingButton, setFlashingButton] = useState<string | null>(null)

  const handleDateChange = (date: Date | null): void => {
    if (date) {
      setSelectedDate(date)
      if (onDateChange) {
        onDateChange(date)
      }
    }
  }

  const handlePrevDay = (): void => {
    const newDate = new Date(selectedDate)
    newDate.setDate(selectedDate.getDate() - 1)
    handleDateChange(newDate)
  }

  const handleNextDay = (): void => {
    const newDate = new Date(selectedDate)
    newDate.setDate(selectedDate.getDate() + 1)
    handleDateChange(newDate)
  }

  const handleNavButtonTouch = (
    buttonName: string,
    action: () => void,
  ): void => {
    setFlashingButton(buttonName)

    setTimeout(() => {
      setFlashingButton(null)
      action()
    }, 150)
  }

  const getNavBtnClass = (buttonName: string): string => {
    return `flex items-center justify-center w-8 h-8 text-gray-600 relative rounded-full
      ${flashingButton === buttonName ? 'bg-blue-200' : 'hover:bg-gray-100'} 
      transition-colors duration-150 cursor-pointer`
  }

  const formatDate = (date: Date): string => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const renderCustomHeader = ({
    date,
    decreaseMonth,
    increaseMonth,
    prevMonthButtonDisabled,
    nextMonthButtonDisabled,
  }: any) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')

    return (
      <div className="flex items-center justify-between px-2 pt-2">
        <button
          onClick={decreaseMonth}
          disabled={prevMonthButtonDisabled}
          type="button"
          className="p-1 text-gray-500 hover:text-gray-700"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15 19L8 12L15 5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <div className="text-lg font-normal text-gray-800">
          {year} . {month}
        </div>

        <button
          onClick={increaseMonth}
          disabled={nextMonthButtonDisabled}
          type="button"
          className="p-1 text-gray-500 hover:text-gray-700"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9 5L16 12L9 19"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    )
  }

  return (
    <div
      className={`fixed bottom-[56px] left-0 right-0 flex justify-center items-center py-3 bg-white border-t border-gray-200 shadow-sm ${className}`}
    >
      <div className="flex justify-center items-center">
        {/* 이전 날짜 버튼 (<-) */}
        <button
          onTouchStart={() => handleNavButtonTouch('prev', handlePrevDay)}
          onClick={handlePrevDay}
          className={getNavBtnClass('prev')}
          aria-label="이전 날짜로 이동"
          style={{ WebkitTapHighlightColor: 'transparent' }}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15 19L8 12L15 5"
              stroke="#4B5563"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {/* 날짜 표시 */}
        <div className="flex items-center mx-4">
          <DatePicker
            selected={selectedDate}
            onChange={handleDateChange}
            locale={ko}
            dateFormat="yyyy-MM-dd"
            className="text-center text-gray-800 font-medium border-none focus:outline-none cursor-pointer"
            renderCustomHeader={renderCustomHeader}
            popperClassName="datepicker-popper"
            popperPlacement="top"
            showPopperArrow={false}
            calendarClassName="shadow-lg border-none"
            customInput={
              <div className="flex items-center bg-white px-2 py-1 rounded-md">
                <button className="mr-2 text-blue-500">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M8 2V5M16 2V5M3.5 9.09H20.5M21 8.5V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V8.5C3 5.5 4.5 3.5 8 3.5H16C19.5 3.5 21 5.5 21 8.5Z"
                      stroke="#3B82F6"
                      strokeWidth="1.5"
                      strokeMiterlimit="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                <span>{formatDate(selectedDate)}</span>
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
          style={{ WebkitTapHighlightColor: 'transparent' }}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9 5L16 12L9 19"
              stroke="#4B5563"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  )
}

export default DatePickerComponent
