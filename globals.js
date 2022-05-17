const { resolve } = require("path");
const fs = require( 'fs' )
const pageData = require("./page-data.json");
// Use the following variables in src/views and src/js. They are made available in
// build-tools/ejs-to-html.js in the 'transformer' function and in webpcak.config.js

module.exports.PP = "";
module.exports.DEV_PATH = __dirname;
module.exports.SITE_TITLE = "GeoTools";
module.exports.SITE_NAME = "ejs-sass-static-boilerplate";
module.exports.DESCRIPTION =
  "Boilerplate for a Static website using EJS and SASS";
module.exports.SITE_URL = "example.com";
module.exports.DEVELOPER_NAME = "Andrew Logan";
module.exports.DEVELOPER_URL = "https://brentoncozby.com";
module.exports.GOOGLE_ANALYTICS_ID = "";
module.exports.CLIENT_ID =
  "106157954659-7lbsq0rvthktblg442hoav3tjajnnebb.apps.googleusercontent.com";
module.exports.PAGE_DATA = pageData;
//dist: resolve(__dirname, "dist"),
module.exports.Dir = {
  dist: resolve(__dirname, "dist"),
  src: resolve(__dirname, "src"),
  css: resolve(__dirname, "src", "css"),
  js: resolve(__dirname, "src", "js"),
  utils: resolve(__dirname, "src", "js", "utils"),
  static: resolve(__dirname, "src", "static"),
  favicons: resolve(__dirname, "src", "favicons"),
  images: resolve(__dirname, "src", "static", "images"),
  videos: resolve(__dirname, "src", "static", "videos"),
  vendor: resolve(__dirname, "src", "vendor"),
  views: resolve(__dirname, "src", "views"),
  pages: resolve(__dirname, "src", "views", "pages"),
  partials: resolve(__dirname, "src", "views", "partials"),
};
