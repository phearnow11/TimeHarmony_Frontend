/** @type {import('tailwindcss').Config} */
export default {
  content: [
    // Example content paths...
    './public/**/*.html',
    './src/**/*.{js,jsx,ts,tsx,vue}',
    'node_modules/flowbite-vue/**/*.{js,jsx,ts,tsx,vue}',
    'node_modules/flowbite/**/*.{js,jsx,ts,tsx}'
  ],
  
  theme: {
    extend: {
      colors: {
        'primary': '#FFBD59',
        'secondary': '#E6C591',
        'black-99': '#1E1E1E',
        'gray-99': '#979b9b',
      },
    },
  },
  plugins: [
    function({ addBase }) {
      addBase({
        'html': {
          'scrollbar-width': 'none', /* Firefox */
          '-ms-overflow-style': 'none', /* Internet Explorer 10+ */
        },
        'html::-webkit-scrollbar': {
          'display': 'none', /* Safari and Chrome */
        },
      });
    },
  ],
  plugins: [
    require('flowbite/plugin')
]
}
