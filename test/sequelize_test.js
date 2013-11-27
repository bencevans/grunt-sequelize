'use strict';

var assert    = require('assert');
var grunt     = require('grunt');
var Sequelize = require('sequelize');

grunt.task.init = function() {};

var options = {
  dialect: 'sqlite',
  storage: 'test/tmp.sqlite',
  migrationsPath: __dirname + '/migrations',
  logging: false
};

// Init config
grunt.initConfig({
  sequelize: {
    options: options
  }
});

var sequelize       = new Sequelize(options.database, options.username, options.password, options);
var migratorOptions = { path: __dirname + '/migrations' };
var migrator        = sequelize.getMigrator(migratorOptions);

grunt.loadTasks('tasks');

describe('grunt-sequelize', function() {

  describe('sequelize:migrate', function() {
    describe('without any arguments', function() {
      it('should migrate to the top migration', function(done) {

        grunt.util.spawn({ grunt: true, args: ['sequelize:migrate'] }, function(error, result) {
          assert.equal(result.code, 0);
          var migrationVersionEmitter = sequelize.migrator.getLastMigrationIdFromDatabase();
          migrationVersionEmitter.on('success', function(serverMigrationId) {
            assert.equal(serverMigrationId, '20131121163655');
            done();
          });
          migrationVersionEmitter.on('error', done);
        });

      });
    });
    describe('with a migration argument', function() {
      describe('where the migration is the same as the current state of the database', function() {
        it('should just inform the user');
      });
      describe('where the migration is higher than the current state of the database', function(){
        it('should migrate to the specified migration');
      });
      describe('where the migration is lower than the current state of the database', function(){
        it('should migrate to the specified migration');
      });
    });
  });


  describe('sequelize:undo', function() {
    describe('without any arguments', function() {
      it('should undo the last migration', function(done) {
        grunt.util.spawn({ grunt: true, args: ['sequelize:undo'] }, function(error, result) {
          assert.equal(result.code, 0);
          var migrationVersionEmitter = sequelize.migrator.getLastMigrationIdFromDatabase();
          migrationVersionEmitter.on('success', function(serverMigrationId) {
            assert.equal(serverMigrationId, '20131121163607');
            done();
          });
          migrationVersionEmitter.on('error', done);
        });
      });
    });
    describe('with a set number to undo', function() {
      it('should migrate downwards by the given number of migrations');
    })
  });

});
