const path = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin');
const WasmPackPlugin = require('@wasm-tool/wasm-pack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
const tailwindcss = require('tailwindcss');

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
        // It does not work on the fly in '@svgr/webpack' version 5.5.0 due to a bug
        // Is fixed in 6.0.0, but not yet released, will be released soon
        // Until then we can use the component exported with '@svgr/webpack'
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
    new WasmPackPlugin({
      crateDirectory: path.resolve(__dirname, '../../crates/playground'),
      extraArgs: '--target web -- -Z build-std=panic_abort,std',
      outDir: path.resolve(__dirname, './pkg'),
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
    new MonacoWebpackPlugin({
      // available options are documented at https://github.com/Microsoft/monaco-editor-webpack-plugin#options
      languages: ['rust'],
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
