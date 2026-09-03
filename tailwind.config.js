/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        lato: ['Lato', 'system-ui', 'sans-serif'],
      },
      colors: {
        bk: {
          black:       '#1D1C1D',
          'dark-gray': '#616061',
          primary:     '#007A5A',
          'primary-hover': '#006047',
          danger:      '#E01E5A',
          link:        '#1264A3',
          'frosty-blue': 'rgba(29,155,209,0.10)',
          'low-contrast': 'rgba(29,28,29,0.13)',
          gray:        'rgba(29,28,29,0.70)',
          bg:          '#FFFFFF',
          surface:     '#F8F8F8',
          'solid-dark': '#323538',
        },
      },
      boxShadow: {
        modal: '0px 18px 48px 0px rgba(0,0,0,0.10)',
        card:  '0px 4px 16px 0px rgba(0,0,0,0.06)',
      },
      fontSize: {
        'bk-headline':  ['28px', { lineHeight: '34px', fontWeight: '900' }],
        'bk-title':     ['22px', { lineHeight: '30px', fontWeight: '900' }],
        'bk-subtitle':  ['18px', { lineHeight: '24px' }],
        'bk-body':      ['15px', { lineHeight: '22px' }],
        'bk-caption':   ['13px', { lineHeight: '18px' }],
      },
      width: {
        modal: '520px',
      },
      maxWidth: {
        modal:   '520px',
        'chat':  '600px',
      },
      borderRadius: {
        bk: '4px',
      },
    },
  },
  plugins: [],
}
