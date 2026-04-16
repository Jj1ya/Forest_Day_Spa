/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        forest: {
          50: '#F0F5F1',
          100: '#E0EBE3',
          200: '#B3D1BB',
          300: '#7A9E7E',
          400: '#4A7C5C',
          500: '#2D5A3D',
          600: '#1A3A28',
          700: '#0B1A12',
        },
        gold: {
          50: '#FBF7F0',
          100: '#F5EBD9',
          200: '#E8D5B0',
          300: '#E2CFA3',
          400: '#C9A96E',
          500: '#A8874E',
          600: '#8B6D3A',
        },
        cream: '#F5F0EB',
        warm: '#EDE7E0',
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'Georgia', 'serif'],
        display: ['Quicksand', 'sans-serif'],
        sans: ['Nunito', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      animation: {
        'scroll-line': 'scrollLine 2s ease-in-out infinite',
        'fade-up': 'fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'spin-slow': 'spin 20s linear infinite',
      },
      keyframes: {
        scrollLine: {
          '0%': { top: '-100%' },
          '100%': { top: '100%' },
        },
        fadeUp: {
          from: { opacity: 0, transform: 'translateY(30px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
