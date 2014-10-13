/*
 * grunt-sequelize
 * https://github.com/webcast-io/grunt-sequelize
 *
 * Copyright (c) 2013 Ben Evans
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);
  require('time-grunt')(grunt);

  var files = {
    lib: ['lib/**/*.js', 'tasks/**/*.js'],
    test: ['test/**/*.js'],
    specs: ['test/**/.spec.js']
  };

  grunt.initConfig({
    jshint: {
      options: { jshintrc: true },
      lib: files.lib,
      test: files.test
    },

    jscs: {
      options: {
        config: '.jscsrc'
      },
      lib: files.lib,
      test: files.test
    },

    clean: {
      test: ['test/.tmp']
    },

    mochaTest: {
      options: {
        reporter: 'spec',
        ui: 'bdd',
        require: ['./test']
      },

      specs: files.specs
    },

    sequelize: {
      options:{
        dialect: 'sqlite',
        storage: 'test/.tmp/db-test.sqlite',
        logging: false,
        migrationsPath: __dirname + '/test/migrations'
      }
    }

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  grunt.registerTask('test', ['clean', 'mochaTest']);
  grunt.registerTask('validate', ['jshint', 'jscs']);

  if(process.env.TEST_CMD) {
    grunt.registerTask('travis', process.env.TEST_CMD);
  }

  // By default, lint and run all tests.
  grunt.registerTask('default', ['validate', 'test']);

};
