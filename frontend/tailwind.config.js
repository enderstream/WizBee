/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
      extend: {
        height: {
          'safe-area': 'env(safe-area-inset-bottom, 0px)'
        },
        textDecoration: {
          'no-underline': 'none',
        },
      }
    },
    plugins: [
      function({ addUtilities }) {
        const newUtilities = {
        }
        addUtilities(newUtilities)
      }
    ]
  }