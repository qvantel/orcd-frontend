var isparta = require('isparta');
var istanbul = require('browserify-istanbul');

module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['browserify', 'chai', 'mocha'],

    files: [
      'https://www.gstatic.com/charts/loader.js',
      'src/map.js',
      'src/utilities.js',
      'test/*.js'
    ],

    preprocessors: {
      'src/map.js': ['browserify'],
      'src/utilities.js': ['browserify'],
      'test/*.js': ['browserify']
    },

    reporters: ['progress', 'coverage'],

    logLevel: config.LOG_DEBUG,

    coverageReporter: {
      type: 'lcov',
      dir: 'test/coverage',
      instrumenters: { isparta: isparta },
      instrumenter: { '**/*.js': 'isparta' }
    },

    browserify: {
      debug: true,

      transform: [
        [istanbul({
          instrumenter: isparta,
          instrumenterConfig: {
            babel: {
              presets: ['es2015']
            }
          }
        })],
        ['babelify', {
          presets: ['es2015']
        }]
      ]
    },

    browsers: ['Firefox'],

    crossOriginAttribute: false
  });
};
