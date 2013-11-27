/*
 * grunt-sequelize
 * https://github.com/webcast-io/grunt-sequelize
 *
 * Copyright (c) 2013 Ben Evans
 * Licensed under the MIT license.
 */

'use strict';

var Sequelize = require('sequelize');
var _         = Sequelize.Utils._;

module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerTask('sequelize', 'Sequelize migrations from Grunt', function(cmd, done) {


    var options = this.options({
      environment: process.env.NODE_ENV || 'development',
      // As a default value, assume __dirname is `/<some path>/node_modules/grunt-sequelize/tasks`
      migrationsPath: __dirname + '/../../../' + 'migrations',
      logging: false
    });
  
    var sequelize       = new Sequelize(options.database, options.username, options.password, options);
    var migratorOptions = { path: options.migrationsPath };
    var migrator        = sequelize.getMigrator(migratorOptions);

    if(cmd === 'migrate') {
      done = this.async();

      sequelize.migrate().done(done);

    } else if(cmd === 'undo') {

      sequelize.migrator.findOrCreateSequelizeMetaDAO().success(function(Meta) {
        Meta.find({ order: 'id DESC' }).success(function(meta) {
          if (meta) {
            migrator = sequelize.getMigrator(_.extend(migratorOptions, meta), true);
          }

          migrator.migrate({ method: 'down' }).success(function() {
            done();
          });
        });
      });

    } else {
      throw new Error('Unknown grunt-sequelize command: ' + cmd);
    }

  });

};
