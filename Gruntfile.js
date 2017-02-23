// Generated on 2016-06-20 using generator-angular 0.15.1
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Automatically load required Grunt tasks
  require('jit-grunt')(grunt, {
    ngtemplates: 'grunt-angular-templates'
  });
  var serveStatic = require('serve-static');

  // Configurable paths for the application
  var appConfig = {
    app: require('./bower.json').appPath || 'app',
    dist: 'dist'
  };

  // Define the configuration for all the tasks
  grunt.initConfig({

    // Project settings
    yeoman: appConfig,
    // The actual grunt server settings
    connect: {
      test: {
        options: {
          port: 9001,
          open: true,
          hostname: 'localhost',
          livereload: 35729,
          middleware: function (connect) {
            return [
              serveStatic('.tmp'),
              serveStatic('test'),
              connect().use(
                '/bower_components',
                serveStatic('./bower_components')
              ),
              serveStatic(appConfig.app)
            ];
          }
        }
      }
    },
    // Make sure there are no obvious mistakes
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: {
        src: [
          'Gruntfile.js',
          '<%= yeoman.app %>/**/*.js'
        ]
      },
      test: {
        options: {
          jshintrc: 'test/.jshintrc'
        },
        src: ['test/spec/{,*/}*.js']
      }
    },

    jsinspect: {
        options: {
            configFile: '.jsinspectrc',
            threshold: 50
        },
        src: [
          '<%= yeoman.app %>/{,*/}*.js'
        ]
    },

    // Make sure code styles are up to par
    jscs: {
      options: {
        config: '.jscsrc'
      },
      all: {
        src: [
          'Gruntfile.js',
          '<%= yeoman.app %>/{,*/}*.js'
        ]
      },
      test: {
        src: ['test/spec/{,*/}*.js']
      }
    },

    // Empties folders to start fresh
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= yeoman.dist %>/{,*/}*',
            '!<%= yeoman.dist %>/.git{,*/}*'
          ]
        }]
      },
      server: '.tmp'
    },

    uglify: {
      dist: {
        files: {
          '<%= yeoman.dist %>/d20-engine.js': [ '.tmp/concat/d20-engine.js' ]
        }
      }
    },
    concat: {
      dist: {
        src: [ '<%= yeoman.app %>/d20-engine.js', '<%= yeoman.app %>/**/*.js', '.tmp/templateCache.js' ],
        dest: '.tmp/concat/d20-engine.js'
      }
    },

    ngtemplates: {
      dist: {
        options: {
          module: 'd20-engine'
        },
        cwd: '<%= yeoman.app %>',
        src: '**/*.html',
        dest: '.tmp/templateCache.js'
      }
    },

    // ng-annotate tries to make the code safe for minification automatically
    // by using the Angular long form for dependency injection.
    ngAnnotate: {
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/concat',
          src: '*.js',
          dest: '.tmp/concat'
        }]
      }
    },

    // Test settings
    karma: {
      unit: {
        configFile: 'test/karma.conf.js',
        singleRun: true
      }
    }
  });

  grunt.registerTask('test', [
    'clean:server',
    'connect:test',
    'karma'
  ]);

  grunt.registerTask('build', [
    'clean:dist',
    'ngtemplates',
    'concat',
    'ngAnnotate',
    'uglify'
  ]);

  grunt.registerTask('default', [
    'newer:jshint',
    'newer:jscs',
    'test',
    'build'
  ]);
};
