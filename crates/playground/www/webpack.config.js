const path = require("path");
const htmlWebpackPlugin = require("html-webpack-plugin");
const WasmPackPlugin = require("@wasm-tool/wasm-pack-plugin");
module.exports = {
  mode: "development",
  entry: {
    app: "./src/index.tsx",
  },
  output: {
    filename: "bundle.[hash].js",
    path: path.resolve(__dirname, "dist"),
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx", ".wasm"],
  },
  module: {
    rules: [
      {
        test: /.tsx?$/,
        use: "ts-loader",
        exclude: ["/node_modules/"],
      },
    ],
  },
  plugins: [
    new htmlWebpackPlugin({
      title: "Minimal Typescript Starter",
      template: "./src/index.html",
    }),
    new WasmPackPlugin({
      crateDirectory: path.resolve(__dirname, "../pkg"),
    }),
  ],
  experiments: {
    asyncWebAssembly: true,
  },
};
