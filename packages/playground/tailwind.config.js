module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
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
    }),
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
