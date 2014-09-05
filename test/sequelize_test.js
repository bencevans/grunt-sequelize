'use strict';

var assert    = require('assert');
var childProcessExec      = require('child_process').exec;
var randomString = require('random-string');
var Sequelize = require('sequelize');
var fs = require('fs');
var _ = require('lodash');

var options = {
  dialect: 'sqlite',
  storage: 'test/tmp.sqlite',
  logging: false,
  migrationsPath: __dirname + '/test/migrations'
};

var sequelize       = new Sequelize(null, null, null, options);
var migratorOptions = { path: __dirname + '/migrations' };
var migrator        = sequelize.getMigrator(migratorOptions);


function exec(command, options, callback) {
  if(typeof options === 'function') {
    callback = options;
    options = {};
  }

  if(process.env.running_under_istanbul) {
    command = './node_modules/.bin/istanbul cover --dir ./coverage/' + randomString() + ' ' + command;
  }
  childProcessExec(command, options, callback);
}

/**
 * Get the current migration id state of database
 * @param  {Function} callback (err, migrationId)
 * @return {VOID}
 */
function getCurrentMigrationId(callback) {
  var migrationVersionEmitter = migrator.getLastMigrationIdFromDatabase();
  migrationVersionEmitter.on('success', function(serverMigrationId) {
    callback(null, serverMigrationId);
  });
  migrationVersionEmitter.on('error', function(error) {
    callback(error);
  });
}

describe('grunt-sequelize', function() {

  // Larger timeout to allow for child_process instanbul instances when running coverage
  this.timeout(4000);

  describe('sequelize:migrate', function() {
    describe('without any arguments', function() {
      it('should migrate to the top migration', function(done) {
        exec('grunt sequelize:migrate', { cwd: __dirname + '/../' }, function(error) {
          assert.equal(error, null);
          getCurrentMigrationId(function(err, serverMigrationId) {
            if(err) {
              return done(err);
            }
            assert.equal(serverMigrationId, '20131121163655');
            done();
          });
        });

      });
    });

    describe('with a migration argument', function() {
      describe('where the migration is lower than the current state of the database', function(){
        it('should migrate to the specified migration', function(done) {

          exec('grunt sequelize:migrate:20131121163607', { cwd: __dirname + '/../' }, function(error) {
            assert.equal(error, null);
            getCurrentMigrationId(function(err, serverMigrationId) {
              if(err) {
                return done(err);
              }
              assert.equal(serverMigrationId, '20131121163607');
              done();
            });
          });

        });
      });
      describe('where the migration is the same as the current state of the database', function() {
        it('should just inform the user', function(done) {

          exec('grunt sequelize:migrate:20131121163607', { cwd: __dirname + '/../' }, function(error, stdout) {
            assert.equal(error, null);
            assert.ok(stdout.match(/There are no pending migrations/));
            done();
          });

        });
      });
      describe('where the migration is higher than the current state of the database', function(){
        it('should migrate to the specified migration', function(done) {

          exec('grunt sequelize:migrate:20131121163655', { cwd: __dirname + '/../' }, function(error) {
            assert.equal(error, null);
            getCurrentMigrationId(function(err, serverMigrationId) {
              if(err) {
                return done(err);
              }
              assert.equal(serverMigrationId, '20131121163655');
              done();
            });
          });

        });
      });
    });
  });

  describe('sequelize:current', function() {
    it('should inform the user of the current migration', function(done) {

      exec('grunt sequelize:current', {cwd: __dirname + '/../'}, function(error, stdout) {
        assert.equal(error, null);
        getCurrentMigrationId(function(err, serverMigrationId) {
          if(err) {
            return done(err);
          }
          assert.notEqual(stdout.indexOf(serverMigrationId), -1);
          done();
        });
      });

    });
  });

  describe('sequelize:migration', function() {
    describe('without any arguments', function() {
      it('should give a warning', function(done) {
        exec('grunt sequelize:migration', {cwd: __dirname + '/../'}, function(error) {
          assert.notEqual(error, null);
          done();
        });
      });
    });

    describe('with a name argument', function() {
      var filesBefore = fs.readdirSync(__dirname + '/migrations');

      it('should create an empty migration with a proper filename', function(done){
        exec('grunt sequelize:migration --name testMigration', {cwd: __dirname + '/../'}, function(error) {
          assert.equal(error, null, 'There was an error running the command.');

          var filesAfter = fs.readdirSync(__dirname + '/migrations');
          var newMigrationFilename = _.first(_.xor(filesBefore, filesAfter));
          var newMigrationContents = fs.readFileSync(__dirname + '/migrations/' + newMigrationFilename, {encoding: 'utf-8'});
          var skeleton = fs.readFileSync(__dirname + '/../data/migration.js', {encoding: 'utf-8'});

          assert.equal(newMigrationContents, skeleton, 'The new migration does not contain an empty skeleton migration.');

          var pattern = /^[0-9]{14}-testMigration.js$/;
          var match = newMigrationFilename.match(pattern);
          assert.notEqual(match, null, 'The migration filename does not match the format.');

          fs.unlinkSync(__dirname + '/migrations/' + newMigrationFilename);

          done();
        });
      });
    });
  });


  describe('sequelize:undo', function() {
    describe('without any arguments', function() {
      it('should undo the last migration', function(done) {

        exec('grunt sequelize:undo', {cwd: __dirname + '/../'}, function(error) {
          assert.equal(error, null);
          getCurrentMigrationId(function(err, serverMigrationId) {
            if(err) {
              return done(err);
            }
            assert.equal(serverMigrationId, '20131121163607');
            done();
          });
        });

      });
    });

  /*
    describe('with a set number to undo', function() {

      before(function(done) {
        exec('grunt sequelize:migrate', {cwd: __dirname + '/../'}, done);
      });

      it('should migrate downwards by the given number of migrations', function(done) {

        exec('grunt sequelize:undo:1', {cwd: __dirname + '/../'}, function(error) {
          assert.equal(error, null);
          getCurrentMigrationId(function(err, serverMigrationId) {
            if(err) {
              return done(err);
            }
            assert.equal(serverMigrationId, '20131121163607');
            done();
          });
        });

      });
    });
  });
  */

  });
});