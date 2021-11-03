module.exports = {
  purge: [],
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    backgroundColor: theme => ({
      ...theme('colors'),
      primary: '#1A1D1F',
      secondary: '#ffed4a',
      danger: '#e3342f',
      elevation: 'rgba(36, 42, 46, 2)',
    }),
    textColor: theme => ({
      ...theme('colors'),
      primary: '#D3D4DB',
      secondary: '#ffed4a',
      danger: '#e3342f',
      light: '#2e2e2e',
    }),
    borderColor: theme => ({
      ...theme('colors'),
      dark: '#3C3D47',
      light: '#cecece',
    }),
    height: {
      '5v': '5vh',
      '10v': '10vh',
      '20v': '20vh',
      '30v': '30vh',
      '40v': '40vh',
      '50v': '50vh',
      '60v': '60vh',
      '70v': '70vh',
      '80v': '80vh',
      '90v': '90vh',
      '100v': '100vh',
    },
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
