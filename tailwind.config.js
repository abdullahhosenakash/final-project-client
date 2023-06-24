/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {}
  },
  daisyui: {
    themes: [
      {
        light: {
          ...require('daisyui/src/theming/themes')['[data-theme=light]'],
          primary: '#1e293b',
          'primary-focus': '#334155',
          secondary: '#d1d5db'
        }
      }
    ]
  },
  plugins: [require('daisyui')]
};
