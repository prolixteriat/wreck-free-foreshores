/** @type {import('tailwindcss').Config} */

export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {maxHeight: {
      'screen-150': 'calc(100vh - 150px)',
      'screen-200': 'calc(100vh - 200px)',
    }
  },
  }, 
  plugins: [
    // eslint-disable-next-line no-undef
    require('daisyui'),
  ],
  daisyui: {
    themes: ['light'],
  },
};
