var isparta = require('isparta');
var istanbul = require('browserify-istanbul');

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['browserify', 'chai', 'mocha'],

    files: [
      'https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.18.1/moment.js',
      'src/utilities.js',
      'src/dataFormatter.js',
      'src/dataGenerator.js',
      'src/panelDataHandler.js',
      'src/selectedCountriesHandler.js',
      'src/templateHandler.js',
      'src/timelapseHandler.js',
      'src/trendCalculator.js',
      'test/*.js'
    ],

    preprocessors: {
      'src/utilities.js': ['browserify'],
      'src/dataFormatter.js': ['browserify'],
      'src/dataGenerator.js': ['browserify'],
      'src/panelDataHandler.js': ['browserify'],
      'src/selectedCountriesHandler.js': ['browserify'],
      'src/templateHandler.js': ['browserify'],
      'src/timelapseHandler.js': ['browserify'],
      'src/trendCalculator.js': ['browserify'],
      'test/*.js': ['browserify']
    },

    reporters: ['dots', 'coverage'],

    coverageReporter: {
        reporters: [
          { type: 'html', subdir: 'html' },
          { type: 'cobertura', subdir: 'cobertura' }
      ],
      dir: 'test/coverage/',
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
