/** @format */

const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  entry: "./frontend/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
  },
  devtool: "eval-source-map",
  mode: process.env.NODE_ENV,
  module: {
    rules: [
      {
        test: /.(css|scss)$/,
        // include: [path.resolve(__dirname, '/node_modules/react-datepicker/'), path.resolve(__dirname, '/node_modules/bootstrap/')],
        // exclude: /node_modules/,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
      {
        test: /.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
          },
        },
      },
    ],
  },
  devServer: {
    port: 8080,
    // contentBase: path.resolve(__dirname, "/dist"),
    // publicPath: "/dist/",
    proxy: {
      "/": {
        target: "http://localhost:3000",
        secure: false,
      },
    },
    hot: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./frontend/index.html",
    }),
    new MiniCssExtractPlugin(),
  ],
  node: {
    fs: "empty",
    http2: "empty",
  },
};
