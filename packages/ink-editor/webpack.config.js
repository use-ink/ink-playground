const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const webpackConfig = {
  output: {
    filename: 'bundle.[fullhash].js',
    path: 'dist',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.wasm', '.css'],
    alias: {
      '@paritytech/commontypes': '../commontypes/src',
    },
  },
  stats: 'errors-only',
  module: {
    rules: [
      {
        test: /.tsx?$/,
        use: 'ts-loader',
        exclude: ['/node_modules/'],
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: '@svgr/webpack',
            options: {
              typescript: true,
              ext: 'tsx',
              replaceAttrValues: {
                '#D3D4DB': '{props.color}',
              },
            },
          },
        ],
      },
      {
        test: /\.txt$/,
        type: 'asset/source',
      }
    ],
  },
  plugins: [
    new MonacoWebpackPlugin({
      languages: ['rust'],
    }),
    // needed for monaco:
    new MiniCssExtractPlugin({
      filename: 'styles.css',
      chunkFilename: 'styles.css',
    }),
    new CopyWebpackPlugin({
      patterns: [{ from: '../_generated/change/src' }],
    }),
  ],
  devServer: {
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
    },
    client: {
      overlay: {
        errors: true,
        warnings: false,
      },
    },
  },
};

//const webpackConfig = {};

module.exports = webpackConfig;
