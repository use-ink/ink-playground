const path = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const { EnvironmentPlugin } = require('webpack');
const { merge } = require('webpack-merge');
const inkEditorConfig = require('../ink-editor/webpack.config.js');

const webpackConfig = {
  mode: 'development',
  entry: {
    app: './src/index.tsx',
  },
  output: {
    filename: 'bundle.[fullhash].js',
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.wasm', '.css'],
    alias: {
      '~': path.resolve(__dirname, 'src/'),
      '@paritytech/components': path.resolve(__dirname, '../components/src'),
      '@paritytech/ink-editor': path.resolve(__dirname, '../ink-editor/src'),
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
    ],
  },
  plugins: [
    new htmlWebpackPlugin({
      title: 'Parity ink! Playground',
      template: './src/index.html',
    }),
    new MiniCssExtractPlugin({
      filename: 'styles.css',
      chunkFilename: 'styles.css',
    }),
    new BundleAnalyzerPlugin({
      analyzerMode: 'disabled',
      generateStatsFile: false,
      statsFilename: '../bundle-size-stats.json',
    }),
    new EnvironmentPlugin({
      COMPILE_URL: '',
      GIST_CREATE_URL: '',
      GIST_LOAD_URL: '',
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

const mergedConfig = merge(inkEditorConfig, webpackConfig);

module.exports = mergedConfig;
