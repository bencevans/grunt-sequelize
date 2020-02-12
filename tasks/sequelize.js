/*
 * grunt-sequelize
 * https://github.com/webcast-io/grunt-sequelize
 *
 * Copyright (c) 2013 Ben Evans
 * Licensed under the MIT license.
 */

'use strict';

var path = require('path');
var _ = require('lodash');
var utils = require('../lib/util');
var createMigrateTask = require('../lib/migrate_task');

module.exports = function(grunt) {

  function options() {
    // node_modules/grunt-sequelize/tasks
    var dbPath = path.normalize(path.join(__dirname, '../../../db'));
    var env = process.env.NODE_ENV || 'development';

    var taskOpts = _.defaults(grunt.config.get('sequelize.options'), {
      config: path.join(dbPath, 'config.json'),
      migrationsPath: path.join(dbPath, 'migrations')
    });

    var dbConfig = grunt.file.readJSON(taskOpts.config)[env];
    if (!dbConfig) {
      var err = new Error('No configuration for NODE_ENV="' + env + '" found in the ' + taskOpts.config);
      grunt.log.error(err);
      throw err;
    }

    delete taskOpts.config;
    taskOpts.log = console.log;
    return _.extend(taskOpts, dbConfig);
  }

  grunt.registerTask('sequelize:migrate', function(arg) {
    var task = createMigrateTask(options());
    var done = this.async();

    arg = arg || 'up';

    task.init()

      .then(function() {
        switch (arg) {
        case 'up':
          grunt.log.writeln('Running pending migrations...');
          return task.up();
        case 'down':
          /* falls through */
        case 'undo':
          grunt.log.writeln('Undoing last migration...');
          return task.down();
        case 'redo':
          grunt.log.writeln('Redoing last migration...');
          return task.redo();
        default:
          var err = new Error('Unknown task: sequelize:migrate:' + arg);
          grunt.log.error(err);
          throw err;
        }
      })

      .then(function() {
        grunt.log.writeln('Done!');
      })

      .complete(done);
  });

  // TODO: maybe we should leave this kind of functionality to scaffold generators (ex. yeoman)?
  grunt.registerTask('sequelize:migration:create', function(name) {
    var opts = options();
    var dst = path.join(opts.migrations, utils.ts() + '-' + name + '.js');
    grunt.file.mkdir(path.dirname(dst));
    grunt.file.copy(path.normalize(path.join(__dirname, '../lib/assets', 'migration.js')), dst);
    grunt.log.writeln('Migration created: ' + path.basename(dst));
  });

};
