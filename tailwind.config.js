/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0a0a0a',
        surface: '#1a1a1a',
        primary: '#ff4d4d',
        secondary: '#4d94ff',
        accent: '#00e676',
      },
    },
  },
  plugins: [],
}
