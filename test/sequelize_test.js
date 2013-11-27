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
    });
  });


  describe('sequelize:undo', function() {
    it('should undo the last migration', function(done) {
      grunt.util.spawn({ grunt: true, args: ['sequelize:undo'] }, function(error, result) {
        console.log(result);
        assert.equal(result.code, 0);
        done();
      });
    });
  });

});
