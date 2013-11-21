'use strict';

var assert = require('assert');
var grunt  = require('grunt');
var exec   = require('child_process').exec


grunt.task.init = function() {};

// Init config
grunt.initConfig({
  sequelize: {
    options: {
      dialect: 'sqlite',
      storage: 'path/to/database.sqlite'
    }
  }
});


describe('grunt-sequelize', function() {

  describe('sequelize:migrate', function() {
    describe('without any arguments', function() {
      it('should migrate to the top migration');
      // grunt.util.spawn({ grunt: true, args: ['sequelize:migrate'] }, function() {}) 
    });
    describe('with a migration argument', function() {

    });
  });

  describe('sequelize:undo', function() {
    it('should undo the last migration');
    // grunt.util.spawn({ grunt: true, args: ['sequelize:undo'] }, function() {}) 
  });

});
