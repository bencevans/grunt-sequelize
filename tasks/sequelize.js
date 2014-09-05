/*
 * grunt-sequelize
 * https://github.com/webcast-io/grunt-sequelize
 *
 * Copyright (c) 2013 Ben Evans
 * Licensed under the MIT license.
 */

'use strict';

var fs        = require('fs');
var path      = require('path');
var Sequelize = require('sequelize');
var _         = Sequelize.Utils._;
var fs        = require('fs');

module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerTask('sequelize', 'Sequelize migrations from Grunt', function(cmd, arg1) {
    var done;

    var options = this.options({
      environment: process.env.NODE_ENV || 'development',
      // As a default value, assume __dirname is `/<some path>/node_modules/grunt-sequelize/tasks`
      migrationsPath: __dirname + '/../../../migrations',
      logging: false,
      modelsDir: __dirname + '/../../../models'
    });

    var sequelize       = new Sequelize(options.database, options.username, options.password, options);
    var migratorOptions = { path: options.migrationsPath };
    var migrator        = sequelize.getMigrator(migratorOptions);

    function getCurrentMigrationId(callback) {
      var migrationVersionEmitter = sequelize.migrator.getLastMigrationIdFromDatabase();
      migrationVersionEmitter.on('success', function(serverMigrationId) {
        callback(null, serverMigrationId);
      });
      migrationVersionEmitter.on('error', function(error) {
        callback(error);
      });
    }

    if(cmd === 'migrate') {
      done = this.async();
      
      console.log('Migrating database ' + options.database + '...');

      getCurrentMigrationId(function(err, serverMigrationId) {

		if (err) {
		  console.log('Error:');
		  console.log(err);
		  return done();
		}    	  
		
        if(serverMigrationId === arg1) {
          console.log('There are no pending migrations.');
          return done();
        }

        if(arg1) {
          migratorOptions.to = arg1;
          migratorOptions.from = serverMigrationId;
          migratorOptions.method = (parseInt(migratorOptions.to, 10) >= parseInt(migratorOptions.from, 10)) ? 'up' : 'down';
          migrator        = sequelize.getMigrator(migratorOptions);
        }

        sequelize.migrate(migratorOptions).success(done).error(function(err) {
          grunt.log.error(err);
          done(false);
        });

      });

    } else if(cmd === 'undo') {
      done = this.async();

      migrator.findOrCreateSequelizeMetaDAO().success(function(Meta) {
        Meta.find({ order: 'id DESC' }).success(function(meta) {
          if (meta) {
            migrator = sequelize.getMigrator(_.extend(migratorOptions, meta.values), true);
            migrator.migrate({ method: 'down' }).success(done).error(function(err) {
              grunt.log.error(err);
              done(false);
            });
          } else {
            grunt.log.writeln('There are no pending migrations.');
            done();
          }
        });
      });

    } else if(cmd === 'current') {
      done = this.async();

      getCurrentMigrationId(function(err, serverMigrationId) {
        if(err) {
          return done(err);
        }
        grunt.log.write('Current Migration: ', serverMigrationId);
        done();
      });
      
    } else if(cmd === 'sync') {
        done = this.async();

        console.log('Syncing database ' + options.database + '...');
        
        var models = [];
        var fileArray = fs
	          .readdirSync(options.modelsDir)
	          .filter(function(file) {
		             return (file.indexOf('.') !== 0) && (file !== 'index.js');				        	  
	          })
	          .forEach(function(file) {
	              console.log('Importing... '+path.join(options.modelsDir, file));
	              
	              var model = sequelize.import(path.join(options.modelsDir, file));
	              models[model.name] = model;
	          });
        
        
        var allModels = Object.keys(models);
        
        var count = 0;
        allModels.forEach(function(modelName) {
           console.log('Cheking associate for '+modelName+'...');
   	       if (models[modelName].options.hasOwnProperty('associate')) {
   	           models[modelName].options.associate(models);
   	       }
   	       
	   	    count++;
	        if(count == allModels.length) { // check if all callbacks have been called
	        	console.log('Now, syncing...');
	        	sequelize
	        	  .sync()
	        	  .complete(function(err) {
	        	    if (err) {
	        	    	console.log('Error:');
	        	    	console.log(err);
	        	    } else {
	        	    	console.log('Done!');
	        	    }
		            done();
	        	  });
	        }      
        });

    } else if (cmd === 'migration') {
      done = this.async();

      if ( ! grunt.option('name')) {
        grunt.log.error('No migration name specified!');
        done(false);
      } else {
        var pad = function (n) {
          return n < 10 ? '0' + n : n;
        };

        var date = new Date();
        var migrationTimestamp = date.getFullYear().toString() + (pad(date.getMonth()+1)).toString() + pad(date.getDate()).toString() + pad(date.getHours()).toString() + pad(date.getMinutes()).toString() + pad(date.getSeconds()).toString();
        var migrationFileName = migrationTimestamp + '-' + grunt.option('name') + '.js';

        var skeleton = fs.readFileSync(__dirname + '/../data/migration.js').toString();

        fs.writeFileSync(options.migrationsPath + '/' + migrationFileName, skeleton);

        grunt.log.writeln('Migration created: ' + migrationFileName);
      }
    } else {
      throw new Error('Unknown grunt-sequelize command: ' + cmd);
    }

  });

};
