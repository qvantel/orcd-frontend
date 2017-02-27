var isparta = require('isparta');
var istanbul = require('browserify-istanbul');

module.exports = function(config) {
  config.set({
    basePath: '.',
    frameworks: ['browserify', 'mocha'],

    files: [
      'src/map.js',
      { pattern: 'test/*.js', watched: false },
    ],

    preprocessors: {
      'src/map.js': ['browserify'],
      'test/*.js': ['browserify'],
    },

    reporters: ['progress', 'coverage'],

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

    browsers: [
      'Firefox'
    ]
  });
};
