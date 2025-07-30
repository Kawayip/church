/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Noto Sans', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        'serif': ['Noto Serif', 'Georgia', 'Cambria', 'Times New Roman', 'Times', 'serif'],
        'advent': ['Advent Sans', 'Noto Sans', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#f0f7f9',
          100: '#e1eff3',
          200: '#c3dfe7',
          300: '#a5cfdb',
          400: '#87bfcf',
          500: '#3f7f8c',
          600: '#2d5a65',
          700: '#1b353e',
          800: '#091017',
          900: '#000000',
        },
        accent: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        }
      }
    },
  },
  plugins: [],
};
