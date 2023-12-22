/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      
      },
    },
    extend: {
      colors: {
        'primary-500': '#FE621D',
        'primary-600': '#FD5200',
        'secondary-500': '#007777',
        'off-white': '#F9F2F0',
        'red': '#FF5A5A',
        'dark-1': '#101010',
        'dark-2': '#202020',
        'dark-3': '#343434',
        'dark-4': '#7C7C7C',
        'light-1': '#F1F1F1',
        'light-2': '#E2E2E2',
        'light-3': '#D3D3D3',
        'light-4': '#AFAFAF',
      },
      screens: {
        'xs': '480px',
      
      },
      width: {
        '420': '420px',
        '465': '465px',
      },
      fontFamily: {
        josefin: ['Josefin', 'sans-serif'],

      },
      keyframes: {
        'accordion-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 0 },
        },
        zIndex: {
          '100': '100',
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};