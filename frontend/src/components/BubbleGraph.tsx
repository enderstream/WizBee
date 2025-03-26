import React, { useEffect, useRef } from 'react'
import '@/styles/BubbleGraph.css'

interface ContributionDay {
  date: Date
  level: number // 0-4, where 0 is no contribution, 4 is highest
}

interface BubbleGraphProps {
  data: ContributionDay[]
  year?: number // Year to display
  onDayClick?: (day: ContributionDay) => void
}

// 추가된 인터페이스: monthStartRow의 타입 정의
interface MonthStartRow {
  rowIndex: number
  month: number
}

// 추가된 인터페이스: 연도 데이터의 각 날짜 타입 정의
interface DayData {
  date: Date
  day: number
  month: number
  level: number
}

const BubbleGraph: React.FC<BubbleGraphProps> = ({
  data,
  year = new Date().getFullYear(),
  onDayClick,
}) => {
  // Days of the week in Korean
  const daysOfWeek = ['월', '화', '수', '목', '금', '토', '일']

  // Month names in Korean
  const monthNames = [
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

  // Reference to the container for scrolling
  const containerRef = useRef<HTMLDivElement>(null)

  // Generate one full year of days
  const generateYearData = () => {
    // Start from January 1st of the year
    const startDate = new Date(year, 0, 1)
    // End on December 31st
    const endDate = new Date(year, 11, 31)

    // Calculate total days in the year
    const totalDays =
      Math.round(
        (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
      ) + 1

    // Get day of week for January 1st (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
    let firstDayOfWeek = startDate.getDay()
    // Adjust to our week format (0 = Monday, ..., 6 = Sunday)
    firstDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1

    // Create an array of all days in the year
    const allDays: (DayData | null)[] = []

    // Add empty cells for days before January 1st
    for (let i = 0; i < firstDayOfWeek; i++) {
      allDays.push(null)
    }

    // Add all days of the year
    for (let i = 0; i < totalDays; i++) {
      const currentDate = new Date(year, 0, i + 1)

      // Find contribution level from data
      const matchingDay = data.find((item) => isSameDay(item.date, currentDate))
      const level = matchingDay ? matchingDay.level : 0

      allDays.push({
        date: currentDate,
        day: currentDate.getDate(),
        month: currentDate.getMonth(),
        level,
      })
    }

    // Calculate rows needed (each row has 7 days)
    const totalCells = allDays.length
    const rows = Math.ceil(totalCells / 7)

    // Distribute days into rows
    const result: (DayData | null)[][] = []
    for (let row = 0; row < rows; row++) {
      const weekRow: (DayData | null)[] = []
      for (let col = 0; col < 7; col++) {
        const index = row * 7 + col
        if (index < totalCells) {
          weekRow.push(allDays[index])
        } else {
          weekRow.push(null)
        }
      }
      result.push(weekRow)
    }

    return result
  }

  // Helper function to check if two dates are the same day
  const isSameDay = (date1: Date, date2: Date): boolean => {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    )
  }

  // Handle day click
  const handleDayClick = (day: DayData) => {
    if (onDayClick && day) {
      onDayClick({
        date: day.date,
        level: day.level,
      })
    }
  }

  // Get all days for the entire year
  const yearData = generateYearData()

  // Find rows where a new month starts
  const monthStartRows: MonthStartRow[] = []
  for (let i = 0; i < yearData.length; i++) {
    const row = yearData[i]
    // Check if this row contains a day that's the first day of a month
    for (let j = 0; j < row.length; j++) {
      const day = row[j]
      if (day && day.day === 1) {
        monthStartRows.push({
          rowIndex: i,
          month: day.month,
        })
        break
      }
    }
  }

  // Scroll to current month on initial render
  useEffect(() => {
    if (containerRef.current) {
      const currentMonth = new Date().getMonth()

      // Find the row for the current month
      const currentMonthRow = monthStartRows.find(
        (m) => m.month === currentMonth,
      )

      if (currentMonthRow) {
        // Calculate position to scroll to
        const rowHeight = 38 // Approximate height of a row in pixels
        const scrollPosition = currentMonthRow.rowIndex * rowHeight

        // Scroll with a slight offset for better positioning
        containerRef.current.scrollTop = scrollPosition - 50
      }
    }
  }, [monthStartRows])

  return (
    <div className="bubble-graph-wrapper">
      <div className="days-header">
        {daysOfWeek.map((day, index) => (
          <div key={`day-${index}`} className="day-label">
            {day}
          </div>
        ))}
      </div>

      <div className="bubble-graph-container" ref={containerRef}>
        <div className="bubble-graph">
          <div className="year-grid">
            {yearData.map((week, weekIndex) => (
              <div key={`week-${weekIndex}`} className="week-row">
                {/* Check if this row starts a new month */}
                <div className="month-labels">
                  {monthStartRows
                    .filter((m) => m.rowIndex === weekIndex)
                    .map((m) => (
                      <div key={`month-${m.month}`} className="month-label">
                        {monthNames[m.month]}
                      </div>
                    ))}
                </div>

                <div className="days-container">
                  {week.map((day, dayIndex) => (
                    <div
                      key={`day-${weekIndex}-${dayIndex}`}
                      className={`contribution-day ${day ? `level-${day.level}` : 'empty'}`}
                      onClick={() => day && handleDayClick(day)}
                      aria-label={
                        day
                          ? `Contribution level ${day.level} on ${day.date.toLocaleDateString()}`
                          : 'Empty day'
                      }
                    >
                      {day && (
                        <span className="contribution-tooltip">
                          {day.date.toLocaleDateString('ko-KR')}
                          <br />
                          {day.level === 0
                            ? '기여 없음'
                            : `기여 레벨: ${day.level}`}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default BubbleGraph
