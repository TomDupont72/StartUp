const { override, addWebpackAlias, addWebpackModuleRule } = require('customize-cra');
const path = require('path');
const webpack = require('webpack');

module.exports = override(
  addWebpackAlias({
    "stream": require.resolve("stream-browserify"),
  }),
  addWebpackModuleRule({
    test: /\.m?js$/,
    include: /node_modules/,
    type: 'javascript/auto',
    resolve: {
      fullySpecified: false,
    },
  }),
  (config, env) => {
    config.plugins.push(
      new webpack.ProvidePlugin({
        Buffer: ['buffer', 'Buffer'],
      })
    );

    if (!config.resolve.fallback) {
      config.resolve.fallback = {};
    }
    config.resolve.fallback["stream"] = require.resolve("stream-browserify");

    return config;
  }
);
