const path = require('path')
const globals = require('./globals')
const webpack = require('webpack')

let isProduction

module.exports = (env = {}) => {
  isProduction = env.production === true

  return {
    entry: {
      vendor: ['lodash.throttle', 'lodash.debounce', 'dompurify', 'picturefill', 'jquery', 'haversine-geolocation', 'firebase/app', 'firebase/database', 'firebase/auth'],
      app: ['./src/js/index.js'],

      latlonDistance: ['./src/js/latlonDistance.js'],
      latlonToAddress: ['./src/js/latlonToAddress.js'],
      latlonToDMS: ['./src/js/latlonToDMS.js'],
      addressDistance: ['./src/js/addressDistance.js'],
      DMSlatlon: ['./src/js/DMSlatlon.js'],
      travel: ['./src/js/travel.js'],
      weather: ['./src/js/weather.js'],
      login: ['./src/js/login.js'],
      newConverter: ['./src/js/newConverter.js']
    },
    output: {
      filename: isProduction ? '[name].[chunkhash].js' : '[name].js',
      chunkFilename: isProduction ? '[name].[chunkhash].js' : '[name].js',
      path: path.resolve(__dirname, 'dist', 'js'),
      publicPath: `${globals.PP}/js/`,
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                presets: [
                  [
                    '@babel/env',
                    {
                      modules: false,
                    },
                  ],
                ],
              },
            },
          ],
          parser: {
            system: true,
          },
        },
      ],
    },
    plugins: [
      new webpack.DefinePlugin({
        PP: JSON.stringify(''),
        SITE_TITLE: JSON.stringify(globals.SITE_TITLE),
        DESCRIPTION: JSON.stringify(globals.DESCRIPTION),
        SITE_URL: JSON.stringify(globals.SITE_URL),
        DEVELOPER_NAME: JSON.stringify(globals.DEVELOPER_NAME),
        DEVELOPER_URL: JSON.stringify(globals.DEVELOPER_URL),
        GOOGLE_ANALYTICS_ID: JSON.stringify(globals.GOOGLE_ANALYTICS_ID),


      }),
    ],
    optimization: {
      splitChunks: {
        cacheGroups: {
          commons: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendor',
            chunks: 'all',
          },
        },
      },
    },
    resolve: {
      alias: {
        dist: globals.Dir.dist,
        src: globals.Dir.src,
        css: globals.Dir.css,
        js: globals.Dir.js,
        utils: globals.Dir.utils,

        leafletlocate: globals.Dir.leafletlocate,
        static: globals.Dir.static,
        images: globals.Dir.images,
        videos: globals.Dir.images,
        vendor: globals.Dir.vendor,
        views: globals.Dir.views,
        pages: globals.Dir.pages,
        partials: globals.Dir.partials,
      },
      symlinks: false,
    },
    devtool: isProduction ? '' : 'eval',
  }
}
