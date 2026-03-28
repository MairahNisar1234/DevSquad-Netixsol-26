/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Manrope', 'sans-serif'],
      },
      colors: {
        'ott-red': '#E50914',
        'ott-bg': '#0F0F0F',
        'ott-border': '#262626',
      },
    },
  },
  plugins: [],
}