/*
 * grunt-sequelize
 * https://github.com/webcast-io/grunt-sequelize
 *
 * Copyright (c) 2013 Ben Evans
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {

      options: {
        jshintrc: '.jshintrc',
        ignores: [
          '*.min.js',
          'node_modules/**/*',
          'public/bower_components/**/*',
          'dist/**/*',
          'coverage/**/*'
        ]
      },
      all: [
        '*.js',
        '**/*.js'
      ]

    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp'],
    },

    // Configuration to be run (and then tested).
    sequelize: {
      options:{
        dialect: 'sqlite',
        storage: 'test/tmp.sqlite',
        migrationsPath: __dirname + '/test/migrations'
      }
    },

    mochaTest: {
      test: {
        options: {
          reporter: 'dot',
        },
        src: ['test/**.js']
      }
    },

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-mocha-test');


  grunt.registerTask('mocha', ['mochaTest']);
  grunt.registerTask('test', ['clean', 'mocha']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};
