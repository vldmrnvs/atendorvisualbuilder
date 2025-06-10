/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    fontFamily: {
      sans: ['Geist', 'ui-sans-serif', 'system-ui', 'sans-serif'],
    },
    extend: {},
  },
  plugins: [require('tailwindcss-animate')],
};
