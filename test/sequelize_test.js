'use strict';

var assert    = require('assert');
var grunt     = require('grunt');

grunt.task.init = function() {};

// Init config
grunt.initConfig({
  sequelize: {
    options: {
      dialect: 'sqlite',
      storage: 'test/tmp.sqlite',
      migrationsPath: __dirname + '/migrations'
    }
  }
});

grunt.loadTasks('tasks');

describe('grunt-sequelize', function() {

  describe('sequelize:migrate', function() {
    describe('without any arguments', function() {
      it('should migrate to the top migration', function(done) {

        grunt.util.spawn({ grunt: true, args: ['sequelize:migrate'] }, function(error, result) {
          console.log(result);
          assert.equal(result.code, 0);
          done();
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
          console.log(result);
          assert.equal(result.code, 0);
          // TODO assert migration ID === last ID
          done();
        });
      });
    });
    describe('with a set number to undo', function() {
      it('should migrate downwards by the given number of migrations');
    })
  });

});
