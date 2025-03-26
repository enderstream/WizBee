import React, { useState } from 'react'

interface DateSelectorProps {
  initialYear?: string
  initialMonth?: string
  initialDay?: string
  onDateChange?: (year: string, month: string, day: string) => void
  className?: string
}

const DateSelector: React.FC<DateSelectorProps> = ({
  initialYear = '',
  initialMonth = '',
  initialDay = '',
  onDateChange,
  className
}) => {
  // 초기 날짜 설정 (YYYY-MM-DD 형식)
  const getInitialDateString = () => {
    if (initialYear && initialMonth && initialDay) {
      return `${initialYear}-${initialMonth}-${initialDay}`
    }
    return ''
  }

  const [dateValue, setDateValue] = useState(getInitialDateString())

  // 날짜 변경 핸들러
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setDateValue(newValue)
    
    if (newValue && onDateChange) {
      const [year, month, day] = newValue.split('-')
      onDateChange(year, month, day)
    }
  }

  return (
    <div className={className}>
      <input
        type="date"
        value={dateValue}
        onChange={handleDateChange}
        className="native-date-input"
      />
      
      {/* 한국어 라벨링을 위한 현재 선택된 값 표시 (선택 사항) */}
      {dateValue && (
        <div className="selected-date-display">
          {dateValue.replace(/-/g, '.')}
        </div>
      )}
    </div>
  )
}

export default DateSelector