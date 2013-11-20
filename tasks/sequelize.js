/*
 * grunt-sequelize
 * https://github.com/webcast-io/grunt-sequelize
 *
 * Copyright (c) 2013 Ben Evans
 * Licensed under the MIT license.
 */

'use strict';

var Sequelize = require('sequelize');

module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerTask('sequelize', 'Sequelize migrations from Grunt', function(cmd) {

    var options = this.options({
      environment: process.env.NODE_ENV || 'development',
      migrationsPath: process.cwd() + '/migrations',
      logging: false
    });

    if(cmd === 'migrate') {
      var done = this.async();

      var sequelize       = new Sequelize(options.database, options.username, options.password, options);
      var migratorOptions = { path: options.migrationsPath }
      var migrator        = sequelize.getMigrator(migratorOptions);

      sequelize.migrate().done(done);

    } else {
      throw new Error('Unknown grunt-sequelize command: ' + cmd);
    }

  });

};
