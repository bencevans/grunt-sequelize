/*
 * grunt-sequelize
 * https://github.com/webcast-io/grunt-sequelize
 *
 * Copyright (c) 2013 Ben Evans
 * Licensed under the MIT license.
 */

'use strict';

var Sequelize  = require('sequelize');
var requireDir = require('require-dir');

module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerTask('sequelize', 'Sequelize migrations from Grunt', function(cmd, arg1, arg2, arg3) {

    var options = this.options({
      environment: process.env.NODE_ENV || 'development',
      // As a default value, assume __dirname is `/<some path>/node_modules/grunt-sequelize/tasks`
      migrationsPath: __dirname + '/../../../migrations',
      logging: console.log
    });

    var sequelize       = new Sequelize(options.database, options.username, options.password, options);
    var migratorOptions = { path: options.migrationsPath, logging: console.log };
    var migrator        = sequelize.getMigrator(migratorOptions);

    //
    // Helpers
    //

    function getCurrentMigrationId(callback) {
      var migrationVersionEmitter = sequelize.migrator.getLastMigrationIdFromDatabase();
      migrationVersionEmitter.on('success', function(serverMigrationId) {
        callback(null, serverMigrationId);
      });
      migrationVersionEmitter.on('error', function(error) {
        callback(error);
      });
    }

    //
    // Require and setup Commands
    //

    var Commands = requireDir(__dirname + '/commands');
    var commands = {};

    var task = this;
    Object.keys(Commands).forEach(function(commandName) {
      commands[commandName] = new Commands[commandName]();
      commands[commandName].sequelize = sequelize;
      commands[commandName].migratorOptions = migratorOptions;
      commands[commandName].migrator = migrator;
      commands[commandName].getCurrentMigrationId = getCurrentMigrationId;
      commands[commandName].task = task;
      commands[commandName].grunt = grunt;
    });

    //
    // Execute Commands
    //

    if(Object.keys(commands).indexOf(cmd) === -1) {
      throw new Error('Unknown grunt-sequelize command: ' + cmd);
    }

    if(Object.getPrototypeOf(commands[cmd])[arg1]) {
      return Object.getPrototypeOf(commands[cmd])[arg1](arg2, arg3);
    } else {
      return commands[cmd].default(arg1, arg2, arg3);
    }

  });

};
