/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        clarity: {
          50:  '#eef7ff',
          100: '#d9edff',
          200: '#bbdfff',
          300: '#8ccbff',
          400: '#56adff',
          500: '#2d8eff',
          600: '#1570f5',
          700: '#0d59e1',
          800: '#1148b6',
          900: '#14408f',
          950: '#0f2857',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Sora', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
