/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1e40af',
        secondary: '#3b82f6',
        danger: '#ef4444',
        warning: '#f59e0b',
        success: '#10b981',
      },
      animation: {
        'slideIn': 'slideIn 0.3s ease-out forwards',
        'slideOut': 'slideOut 0.3s ease-in forwards',
      },
      keyframes: {
        slideIn: {
          '0%': { transform: 'translateX(100%)', opacity: 0 },
          '100%': { transform: 'translateX(0)', opacity: 1 },
        },
        slideOut: {
          '0%': { transform: 'translateX(0)', opacity: 1 },
          '100%': { transform: 'translateX(100%)', opacity: 0 },
        },
      },
      zIndex: {
        '60': 60,
        '70': 70,
      }
    },
  },
  plugins: [],
} 