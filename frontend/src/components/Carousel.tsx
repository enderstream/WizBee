import React, { useState, useEffect } from 'react'
import '@/styles/Carousel.css'

// These would be your actual images in the real app
const carouselImages = [
  {
    id: 1,
    content: (
      <div className="carousel-item">
        <div className="chart-container">
          <div className="chart-info">
            <div className="chart-icon"></div>
            <div className="chart-details"></div>
          </div>
          <div className="chart-graph"></div>
        </div>
      </div>
    ),
  },
  {
    id: 2,
    content: (
      <div className="carousel-item">
        <div className="donut-chart"></div>
        <div className="line-graph">
          <div className="graph-axis-y"></div>
          <div className="graph-line"></div>
          <div className="graph-axis-x"></div>
        </div>
      </div>
    ),
  },
  {
    id: 3,
    content: (
      <div className="carousel-item">
        <div className="video-container">
          <div className="video-player"></div>
          <div className="video-thumbnails"></div>
        </div>
      </div>
    ),
  },
]

const Carousel: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    // Auto rotate slides
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="carousel">
      <div className="carousel-container">
        {carouselImages[currentSlide].content}
      </div>
      <div className="carousel-dots">
        {carouselImages.map((_, index) => (
          <button
            key={index}
            className={`carousel-dot ${currentSlide === index ? 'active' : ''}`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
    </div>
  )
}

export default Carousel