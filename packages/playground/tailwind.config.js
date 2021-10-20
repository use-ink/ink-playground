module.exports = {
  purge: [],
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    backgroundColor: theme => ({
      ...theme('colors'),
      primary: '#1A1D1F',
      secondary: '#ffed4a',
      danger: '#e3342f',
    }),
    textColor: theme => ({
      ...theme('colors'),
      primary: '#D3D4DB',
      secondary: '#ffed4a',
      danger: '#e3342f',
      light: '#2e2e2e',
    }),
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
