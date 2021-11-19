module.exports = {
  purge: [],
  darkMode: 'class', // or 'media' or 'class'
  monacoTheme: {
    backgroundEditor: '#1A1D1F',
    backgroundMinimap: '#1e2124',
  },
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
      elevation: '#242A2E',
      'elevation-1': '#282F33',
      'elevation-2': '#2C3338',
      'elevation-3': '#2E353B',
      scrollbar: 'rgba(121, 121, 121, 0.4)',
      'scrollbar-light': 'rgba(121, 121, 121, 0.4)',
      success: '#0AC974',
      info: '#00AABD',
      error: '#C9240A',
      warn: '#D6BE15',
      'in-progress': '#D6BE15',
    }),
    textColor: theme => ({
      ...theme('colors'),
      primary: '#D3D4DB',
      secondary: '#D8B6FF',
      danger: '#e3342f',
      light: '#2e2e2e',
      success: '#0AC974',
      info: '#00AABD',
      error: '#C9240A',
      warn: '#D6BE15',
      'in-progress': '#D6BE15',
    }),
    borderColor: theme => ({
      ...theme('colors'),
      dark: '#3C3D47',
      light: '#cecece',
    }),
    extend: {
      spacing: {
        px2: '2px',
        px3: '3px',
      },
    },
  },
  variants: {
    extend: {
      borderRadius: ['last'],
    },
  },
  plugins: [],
};
