'use strict';

var assert = require('assert');
var grunt  = require('grunt');
var exec   = require('child_process').exec

describe('grunt-sequelize', function() {

  describe('sequelize:migrate', function() {
    describe('without any arguments', function() {
      it('should migrate to the top migration');
    });
    describe('with a migration argument', function() {

    });
  });

  describe('sequelize:undo', function() {
    it('should undo the last migration');
  });

});
