import React from 'react'
import '../styles/Calendar.css'

interface CalendarProps {
  month: number
}

const Calendar: React.FC<CalendarProps> = ({ month }) => {
  // Generate days for February 2025 (or current year)
  const year = 2025
  const daysInMonth = new Date(year, month, 0).getDate()
  const firstDayOfMonth = new Date(year, month - 1, 1).getDay()
  
  // Get day names
  const dayNames = ['일', '월', '화', '수', '목', '금', '토']
  
  // Generate calendar cells
  const generateCalendarCells = () => {
    const cells = []
    
    // Add day names header
    for (let i = 0; i < 7; i++) {
      cells.push(
        <div key={`header-${i}`} className="calendar-header-cell">
          {dayNames[i]}
        </div>
      )
    }
    
    // Add empty cells for days before the first of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      cells.push(<div key={`empty-${i}`} className="calendar-cell empty"></div>)
    }
    
    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      cells.push(
        <div key={`day-${day}`} className="calendar-cell">
          {day}
        </div>
      )
    }
    
    return cells
  }
  
  return (
    <div className="calendar">
      <div className="calendar-header">
        <h3>{month}월</h3>
      </div>
      <div className="calendar-grid">
        {generateCalendarCells()}
      </div>
    </div>
  )
}

export default Calendar