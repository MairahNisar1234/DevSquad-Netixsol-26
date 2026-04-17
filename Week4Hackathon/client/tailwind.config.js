/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'ott-red': '#E50914',
        'ott-black': '#0F0F0F',
      },
    },
  },
  plugins: [],
}