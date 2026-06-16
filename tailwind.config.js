/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        tedx: {
          red: '#E62B1F',
          'dark-red': '#C41E17',
          black: '#000000',
          white: '#FFFFFF',
          gray: {
            50: '#F9F9F9',
            100: '#F3F3F3',
            200: '#E8E8E8',
            300: '#D1D1D1',
            400: '#A6A6A6',
            500: '#808080',
            600: '#595959',
            700: '#333333',
          }
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
      },
      typography: {
        DEFAULT: {
          css: {
            color: '#333333',
            a: {
              color: '#E62B1F',
              '&:hover': {
                color: '#C41E17',
              },
            },
          },
        },
      },
      boxShadow: {
        'tedx-sm': '0 2px 8px rgba(230, 43, 31, 0.1)',
        'tedx-md': '0 4px 12px rgba(230, 43, 31, 0.15)',
        'tedx-lg': '0 8px 24px rgba(230, 43, 31, 0.2)',
      },
    },
  },
  plugins: [],
}
