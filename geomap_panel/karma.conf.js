var isparta = require('isparta');
var istanbul = require('browserify-istanbul');

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['browserify', 'chai', 'mocha'],

    files: [
      'https://www.gstatic.com/charts/loader.js',
      'src/map.js',
      'src/utilities.js',
      'src/dataFormatter.js',
      'src/zoomHandler.js',
      'src/dataGenerator.js',
      'test/*.js'
    ],

    preprocessors: {
      'src/map.js': ['browserify'],
      'src/utilities.js': ['browserify'],
      'src/dataFormatter.js': ['browserify'],
      'src/zoomHandler.js': ['browserify'],
      'src/dataGenerator.js': ['browserify'],
      'test/*.js': ['browserify']
    },

    reporters: ['dots', 'coverage'],

    coverageReporter: {
        reporters: [
          { type: 'lcov'}
      ],
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
