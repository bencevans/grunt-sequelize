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
      tests: ['tmp', 'test/tmp.sqlite', 'test/tmp.sqlite-journal'],
    },

    // Configuration to be run (and then tested).
    sequelize: {
      options:{
        dialect: 'sqlite',
        storage: 'test/tmp.sqlite',
        logging: false,
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
  grunt.registerTask('lint', ['jshint']);

  if(process.env.TEST_CMD) {
    grunt.registerTask('travis', process.env.TEST_CMD);
  }

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};
