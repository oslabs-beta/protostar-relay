/** @format */

const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const ExtensionReloader = require('webpack-extension-reloader');

module.exports = {
  entry: {
    background: './extension/backend/background.js',
    bundle: './extension/frontend/view/index.js',
    hook: './extension/backend/hook.ts',
  },
  output: {
    path: path.resolve(__dirname, 'build/extension'),
    filename: '[name].js',
  },
  devtool: 'cheap-module-source-map',
  module: {
    rules: [
      {
        test: /.(css|scss)$/,
        // include: [path.resolve(__dirname, '/node_modules/react-datepicker/'), path.resolve(__dirname, '/node_modules/bootstrap/')],
        // exclude: /node_modules/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
      },
      {
        rules: [
          {
            test: /\.tsx?$/,
            use: 'ts-loader',
            exclude: /node_modules/,
          },
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin(),
    new CopyPlugin({
      patterns: [
        {
          from: 'extension/manifest.json',
          to: '../extension/manifest.json',
        },
        {
          from: 'extension/backend/background.js',
          to: '../extension/background.js',
        },
        {
          from: 'extension/frontend/devtool.html',
          to: '../extension/devtool.html',
        },
        {
          from: 'extension/frontend/devtool.js',
          to: '../extension/devtool.js',
        },
        {
          from: 'extension/frontend/view/index.html',
          to: '../extension/index.html',
        },
        {
          from: 'extension/backend/content_script.js',
          to: '../extension/content_script.js',
        },
        {
          from: 'extension/frontend/view/styles.scss',
          to: '../extension/styles.scss',
        },
        {
          from: 'extension/frontend/assets/cut-scissor.png',
          to: '../extension/assets/cut-scissor.png',
        },
        {
          from: 'extension/frontend/assets/search.png',
          to: '../extension/assets/search.png',
        },
        // {
        //   from: "extension/16.png",
        //   to: "../extension/16.png",
        // },
        // {
        //   from: "extension/48.png",
        //   to: "../extension/48.png",
        // },
      ],
    }),
    // Enables hot reloading - use npm run dev command
    new ExtensionReloader({
      manifest: path.resolve(__dirname, './extension/manifest.json'),
      entries: {
        bundle: 'bundle',
        background: 'background',
      },
    }),
  ],
};
