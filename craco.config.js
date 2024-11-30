const webpack = require('webpack');

module.exports = {
  webpack: {
    configure: {
      resolve: {
        fallback: {
          assert: require.resolve('assert/'),
          buffer: require.resolve('buffer/'),
          crypto: require.resolve('crypto-browserify'),
          stream: require.resolve('stream-browserify'),
          util: require.resolve('util/'),
          url: require.resolve('url/'),
          querystring: require.resolve('querystring-es3'),
          http: require.resolve('stream-http'),
          https: require.resolve('https-browserify'),
          os: require.resolve('os-browserify/browser'),
          zlib: require.resolve('browserify-zlib'),
          path: require.resolve('path-browserify'),
          fs: false,
          net: false,
          tls: false,
          child_process: false,
          http2: false,
          process: require.resolve('process/browser')
        },
      },
      module: {
        rules: [
          {
            test: /\.m?js/,
            resolve: {
              fullySpecified: false
            }
          }
        ]
      }
    },
    plugins: {
      add: [
        new webpack.ProvidePlugin({
          Buffer: ['buffer', 'Buffer'],
          process: 'process/browser',
        }),
      ],
    },
  },
};