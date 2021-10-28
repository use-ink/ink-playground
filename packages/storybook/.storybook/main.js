const { config } = require('react-transition-group');
const path = require('path');

module.exports = {
  stories: ['../stories/**/*.stories.mdx', '../stories/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-links', '@storybook/addon-essentials'],
  webpackFinal: async config => {
    return {
      ...config,
      resolve: {
        ...config?.resolve,
        alias: {
          ...config.resolve?.alias,
          '~': path.resolve(__dirname, '../stories/'),
          '@paritytech/components': path.resolve(__dirname, '../../components/src'),
        },
      },
    };
    // config.module.rules.push({
    //   test: /\.css$/,
    //   use: [
    //     {
    //       loader: 'postcss-loader',
    //       options: {
    //         ident: 'postcss',
    //         plugins: [require('tailwindcss'), require('autoprefixer')],
    //       },
    //     },
    //   ],
    //   include: path.resolve(__dirname, '../'),
    // });
  },
};
