/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#030014',
        surface: '#0c0c1e',
        primary: '#a855f7',
        secondary: '#ec4899',
        accent: '#8b5cf6',
      },
    },
  },
  plugins: [],
}
