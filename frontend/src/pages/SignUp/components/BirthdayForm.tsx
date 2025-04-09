// src/pages/SignUp/components/BirthdayForm.tsx
import React from 'react'
import DatePicker from 'react-datepicker'
import { getYear, getMonth } from 'date-fns'
import { ko } from 'date-fns/locale'
import 'react-datepicker/dist/react-datepicker.css'

interface BirthdayFormProps {
  birthDate: Date | null
  setBirthDate: (date: Date | null) => void
  isLoading: boolean
}

// range 함수 helper
const range = (start: number, end: number, step = 1) => {
  const result = []
  for (let i = start; i <= end; i += step) {
    result.push(i)
  }
  return result
}

const BirthdayForm: React.FC<BirthdayFormProps> = ({
  birthDate,
  setBirthDate,
  isLoading,
}) => {
  // 연도 범위 (1950년부터 현재 연도까지)
  const years = range(1950, getYear(new Date()), 1)

  const renderCustomHeader = ({
    date,
    changeYear,
    changeMonth,
    decreaseMonth,
    increaseMonth,
    prevMonthButtonDisabled,
    nextMonthButtonDisabled,
  }: any) => {
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

        <div className="flex items-center space-x-2">
          <select
            value={getYear(date)}
            onChange={({ target: { value } }) => changeYear(parseInt(value))}
            className="bg-white text-gray-800 border-0 rounded-md text-md font-medium focus:outline-none"
          >
            {years.map((option) => (
              <option key={option} value={option}>
                {option}년
              </option>
            ))}
          </select>

          <select
            value={getMonth(date)}
            onChange={({ target: { value } }) => changeMonth(parseInt(value))}
            className="bg-white text-gray-800 border-0 rounded-md text-md font-medium focus:outline-none"
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i} value={i}>
                {i + 1}월
              </option>
            ))}
          </select>
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
    <div className="space-y-2">
      <label htmlFor="name" className="block text-sm font-medium text-gray-700">
        생년월일
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg
            className="h-5 w-5 text-blue-500"
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
        </div>
        <DatePicker
          renderCustomHeader={renderCustomHeader}
          selected={birthDate}
          onChange={(date) => setBirthDate(date)}
          locale={ko}
          dateFormat="yyyy-MM-dd"
          placeholderText="생년월일을 선택하세요"
          disabled={isLoading}
          required
          maxDate={new Date()} // 오늘 이후 날짜 선택 불가
          showYearDropdown
          yearDropdownItemNumber={70}
          className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg bg-transparent shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-base disabled:bg-gray-100 disabled:text-gray-500 transition"
          popperClassName="datepicker-popper"
          popperPlacement="bottom"
          formatWeekDay={(nameOfDay) => nameOfDay.substring(0, 1)}
          wrapperClassName="w-full"
        />
      </div>
    </div>
  )
}

export default BirthdayForm