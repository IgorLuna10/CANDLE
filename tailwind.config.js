/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      screens: {
        'xs': '400px',
      },
      colors: {
        primary: '#dc2626',
        'primary-hover': '#b91c1c',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Noto Serif TC', 'serif'],
      },
    },
  },
  plugins: [],
}
