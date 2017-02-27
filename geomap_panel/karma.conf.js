module.exports = (config) => {
  config.set({

    basePath: '',

    frameworks: ['systemjs', 'mocha', 'expect'],

    files: [
      'https://www.gstatic.com/charts/loader.js',
      'src/map.js',
      'src/utilities.js',
      'test/*.js'
    ],

    exclude: [
    ],

    plugins: ['karma-systemjs', 'karma-babel-preprocessor', 'karma-mocha',
      'karma-expect', 'karma-firefox-launcher'],

    preprocessors: {
      'src/**/*.js': ['babel'],
      'test/**/*.js': ['babel']
    },

    // Babel preprocessor specific configuration
    babelPreprocessor: {
      options: {
        presets: ['es2015'], // use the es2015 preset
        plugins: ['transform-es2015-modules-systemjs', 'transform-es2015-for-of'],
        sourceMap: 'inline' // inline source maps inside compiled files
      },
      // filename: function (file) {
      //   return file.originalPath.replace(/\.js$/, '.es5.js');
      // },
      sourceFileName: (file) => {
        return file.originalPath;
      }
    },

    systemjs: {
        // File patterns for application code, dependencies, and test suites
      files: [
        'src/map.js',
        'src/dataGenerator.js',
        'test/**/*.js'
      ],

      // SystemJS configuration specifically for tests, added after your config file.
      // Good for adding test libraries and mock modules
      config: {
        defaultJSExtensions: true,
        baseURL: '.',

        // Set path for third-party libraries as modules
        paths: {
          'babel': 'node_modules/babel-core/lib/api/browser.js',
          'systemjs': 'node_modules/systemjs/dist/system.js',
          'system-polyfills': 'node_modules/systemjs/dist/system-polyfills.js',
          'es6-module-loader': 'node_modules/es6-module-loader/dist/es6-module-loader.js'
        },

        transpiler: 'babel'
      }
    },

    reporters: ['dots'],

    crossOriginAttribute: false,

    port: 9876,

    colors: true,

    logLevel: config.LOG_INFO,

    autoWatch: true,

    browsers: ['Firefox'],

    singleRun: false,

    concurrency: Infinity
  });
};
