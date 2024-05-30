/** @type {import('tailwindcss').Config} */
export default {
  content: [
    // Example content paths...
    './public/**/*.html',
    './src/**/*.{js,jsx,ts,tsx,vue}',
  ],
  
  theme: {
    extend: {
      colors:{
        'primary': '#FFBD59',
        'secondary': '#E6C591',
        'black-99' : '#1E1E1E',
        'gray-99': '#979b9b'
      }
    },
  },
  plugins: [
  ],
  
}

