module.exports = {
  purge: [],
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    fontFamily: {
      body: ['SF Pro Display Regular'],
      medium: ['SF Pro Display Medium'],
      bold: ['SF Pro Display Bold'],
      italic: ['SF Pro Display Italic'],
    },
    backgroundColor: theme => ({
      ...theme('colors'),
      primary: '#1A1D1F',
      secondary: '#D8B6FF',
      danger: '#e3342f',
      elevation: 'rgba(36, 42, 46, 2)',
      scrollbar: 'rgba(121, 121, 121, 0.4)',
      'scrollbar-light': 'rgba(121, 121, 121, 0.4)',
    }),
    textColor: theme => ({
      ...theme('colors'),
      primary: '#D3D4DB',
      secondary: '#D8B6FF',
      danger: '#e3342f',
      light: '#2e2e2e',
    }),
    borderColor: theme => ({
      ...theme('colors'),
      dark: '#3C3D47',
      light: '#cecece',
    }),
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
