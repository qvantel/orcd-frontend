
var isparta = require('isparta');
var istanbul = require('browserify-istanbul');

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['browserify', 'chai', 'mocha'],

    files: [
      'https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js',
      'src/TargetParser.js',
      'test/*.js'
    ],

    preprocessors: {
      'src/TargetParser.js': ['browserify'],
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
