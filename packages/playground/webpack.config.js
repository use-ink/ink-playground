const path = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin');
// const WasmPackPlugin = require('@wasm-tool/wasm-pack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
const tailwindcss = require('tailwindcss');
const { EnvironmentPlugin } = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
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
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [tailwindcss('./tailwind.config.js'), require('autoprefixer')],
              },
            },
          },
        ],
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: '@svgr/webpack',
            options: {
              typescript: true,
              ext: 'tsx',
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
    // new WasmPackPlugin({
    //   crateDirectory: path.resolve(__dirname, '../../crates/rust_analyzer_wasm'),
    //   extraArgs: '--target web -- -Z build-std=panic_abort,std',
    //   outDir: path.resolve(__dirname, './pkg'),
    // }),
    new MiniCssExtractPlugin({
      filename: 'styles.css',
      chunkFilename: 'styles.css',
    }),
    new BundleAnalyzerPlugin({
      analyzerMode: 'disabled',
      generateStatsFile: false,
      statsFilename: '../bundle-size-stats.json',
    }),
    new MonacoWebpackPlugin({
      // available options are documented at https://github.com/Microsoft/monaco-editor-webpack-plugin#options
      languages: ['rust'],
    }),
    new CopyWebpackPlugin({
      patterns: [{ from: '../_generated/change/src' }],
    }),
    new EnvironmentPlugin({
      COMPILE_URL: '',
    }),
  ],
  experiments: {
    asyncWebAssembly: true,
  },
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
