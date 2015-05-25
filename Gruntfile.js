/*
 * grunt-sequelize
 * https://github.com/webcast-io/grunt-sequelize
 *
 * Copyright (c) 2013 Ben Evans
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {
  var files = {
    lib: ['lib/**/*.js', 'tasks/**/*.js', '*.js'],
    test: ['test/**/*.js'],
    specs: ['test/**/*_spec.js']
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
    }

  });

  if (process.env.NODE_ENV === 'integration') {
    grunt.config.set('sequelize', {
      options: {
        config: __dirname + '/db/config.json',
        migrations: __dirname + '/db/migrations'
      }
    });
    grunt.loadTasks('tasks');
  }

  grunt.loadNpmTasks('grunt-jscs');
  grunt.loadNpmTasks('grunt-jshint');

  grunt.registerTask('test', ['clean', 'mochaTest']);
  grunt.registerTask('validate', ['jshint', 'jscs']);
  grunt.registerTask('default', ['validate', 'test']);
};
