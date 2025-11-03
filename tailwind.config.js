/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FF385C',
        secondary: '#00A699',
        accent: '#FFB400',
        surface: '#FFFFFF',
        background: '#F7F7F7',
        success: '#00A699',
        warning: '#FFB400',
        error: '#FF385C',
        info: '#008489',
      },
      fontFamily: {
        display: ['Inter', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 2px 8px rgba(0,0,0,0.1)',
        'card-hover': '0 8px 25px rgba(0,0,0,0.15)',
        'subtle': '0 1px 3px rgba(0,0,0,0.1)',
      },
      borderRadius: {
        'card': '12px',
      },
    },
  },
  plugins: [],
}