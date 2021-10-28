const path = require('path');

module.exports = {
  stories: ['../stories/**/*.stories.mdx', '../stories/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-links', '@storybook/addon-essentials'],
  webpackFinal: async config => {
    const updatedConfig = {
      ...config,
      resolve: {
        ...config?.resolve,
        alias: {
          ...config.resolve?.alias,
          '~': path.resolve(__dirname, '../stories/'),
          '@paritytech/components': path.resolve(__dirname, '../../components/src'),
        },
      },
      module: {
        ...config.module,
        rules: [...config.module?.rules],
      },
    };
    updatedConfig.module.rules.push({
      test: /\.(tsx|ts)$/,
      use: 'ts-loader',
      exclude: /node_modules\/(?!(@paritytech\/tailwindcss-classnames)\/).*/,
    });
    return updatedConfig;
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
