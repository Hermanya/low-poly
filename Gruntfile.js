module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);

  require('time-grunt')(grunt);

  var base = 'app';

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    bowercopy: grunt.file.readJSON('bowercopy.json'),
    connect: {
      options: {
        port: 9000,
        livereload: 35729,
        hostname: 'localhost'
      },
      livereload: {
        options: {
          open: true,
          base: [ base ]
        }
      }
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: [ base + '/js/*.js']
    },
    jsonlint: {
      pkg: [ 'package.json' ],
      bower: [ '{bower,bowercopy}.json' ]
    },
    browserify: {
      dist: {
        files: {
          'app/dist/module.js': base +'/js/*.js'
        },
        options: {
          debug: true
        }
      }
    },
    watch: {
      js: {
        files: [
        '<%= jshint.all %>'
        ],
        tasks: ['jshint', 'browserify']
      },
      json: {
        files: [
        '{package,bower}.json'
        ],
        tasks: ['jsonlint']
      },
      reload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
        '<%= watch.js.files %>',
        '<%= watch.json.files %>',
        base + '/css/**/*.css',
        '**/*.html'
        ]
      }
    }
  });

grunt.registerTask('serve', function () {
  grunt.task.run([
    'connect:livereload',
    'watch'
    ]);
});

grunt.registerTask('default', ['newer:jsonlint', 'newer:jshint', 'newer:browserify', 'serve']);
};