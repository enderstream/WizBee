import React from 'react'
import { getYear, getMonth } from 'date-fns'
import { DatePickerHeaderProps } from '@/types/Setting'

// helper 함수
const range = (start: number, end: number, step = 1) => {
  const result = []
  for (let i = start; i <= end; i += step) {
    result.push(i)
  }
  return result
}

const CustomDatePickerHeader: React.FC<DatePickerHeaderProps> = ({
  date,
  changeYear,
  changeMonth,
  decreaseMonth,
  increaseMonth,
  prevMonthButtonDisabled,
  nextMonthButtonDisabled,
}) => {
  // 한국어 월 이름 배열
  const months = [
    '1월',
    '2월',
    '3월',
    '4월',
    '5월',
    '6월',
    '7월',
    '8월',
    '9월',
    '10월',
    '11월',
    '12월',
  ]

  // 연도 범위 (1900년부터 현재 연도까지)
  const years = range(1900, getYear(new Date()), 1)

  return (
    <div className="datepicker-header">
      <button
        type="button"
        onClick={decreaseMonth}
        disabled={prevMonthButtonDisabled}
        className="month-nav-button"
      >
        {'<'}
      </button>

      <div className="year-month-selects">
        <select
          value={getYear(date)}
          onChange={({ target: { value } }) => changeYear(parseInt(value))}
          className="year-select"
        >
          {years.map((option) => (
            <option key={option} value={option}>
              {option}년
            </option>
          ))}
        </select>

        <select
          value={months[getMonth(date)]}
          onChange={({ target: { value } }) =>
            changeMonth(months.indexOf(value))
          }
          className="month-select"
        >
          {months.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <button
        type="button"
        onClick={increaseMonth}
        disabled={nextMonthButtonDisabled}
        className="month-nav-button"
      >
        {'>'}
      </button>
    </div>
  )
}

export default CustomDatePickerHeader
