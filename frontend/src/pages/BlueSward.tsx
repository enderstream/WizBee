import React, { useState, useEffect } from 'react'
import BubbleGraph from '../components/BubbleGraph'
import '@/styles/BlueSward.css'

interface ContributionDay {
  date: Date
  level: number // 0-4, where 0 is no contribution, 4 is highest
}

const BlueSward: React.FC = () => {
  const [contributionData, setContributionData] = useState<ContributionDay[]>(
    [],
  )
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate fetching contribution data
    const generateMockData = () => {
      const data: ContributionDay[] = []
      const today = new Date()

      // Generate 90 days of mock data (approximately 3 months)
      for (let i = 0; i < 90; i++) {
        const date = new Date()
        date.setDate(today.getDate() - i) // Go back i days

        // Random contribution level
        const level = Math.floor(Math.random() * 5) // 0-4

        data.push({
          date,
          level,
        })
      }

      return data
    }

    // Simulate loading delay
    setTimeout(() => {
      setContributionData(generateMockData())
      setIsLoading(false)
    }, 800)
  }, [])

  const handleDayClick = (day: ContributionDay) => {
    alert(`${day.date.toLocaleDateString('ko-KR')}: 기여 레벨 ${day.level}`)
    // You can implement showing details or navigating to a details page here
  }

  return (
    <div className="blue-sward-page">
      <div className="blue-sward-header">
        <h1>파란 잔디밭</h1>
        <p className="subtitle">당신의 활동 기록</p>
      </div>

      {isLoading ? (
        <div className="loading-indicator">
          <p>로딩 중...</p>
        </div>
      ) : (
        <>
          <div className="contribution-legend">
            <span className="legend-label">적음</span>
            {[0, 1, 2, 3, 4].map((level) => (
              <div
                key={`legend-${level}`}
                className={`legend-item level-${level}`}
              ></div>
            ))}
            <span className="legend-label">많음</span>
          </div>

          <BubbleGraph
            data={contributionData}
            year={new Date().getFullYear()} // weeks={12} 대신 year 속성 사용
            onDayClick={handleDayClick}
          />
        </>
      )}
    </div>
  )
}

export default BlueSward
