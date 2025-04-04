/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          blue: {
            400: '#80b1ff', // WizBee 파란색 색상
          },
          red: {
            300: '#F08080', // 바 그래프 색상
          },
          green: {
            400: '#7ED57E', // 폰 색상
          },
          purple: {
            400: '#B19CD9', // 졸음 색상
          }
        },
      },
    },
    plugins: [],
  }