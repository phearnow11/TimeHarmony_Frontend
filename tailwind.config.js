/** @type {import('tailwindcss').Config} */
export default {
  content: [
    // Example content paths...
    './public/**/*.html',
    './src/**/*.{js,jsx,ts,tsx,vue}',
    './src/components/*.{js,jsx,ts,tsx,vue}',
    './src/views/*.{js,jsx,ts,tsx,vue}',
    'node_modules/preline/dist/*.js',

  ],
  
  theme: {
    extend: {},
  },
  plugins: [
    require('preline/plugin'),
  ],
  
}

