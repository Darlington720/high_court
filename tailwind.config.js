/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        elegantBlue1: '#1e3a8a',
        elegantBlue2: '#2563eb',
        elegantBlue3: '#3b82f6',
      },
    },
  },
  plugins: [],
};