'use strict';

var path = require('path');
var grunt = require('grunt');
var rewire = require('rewire');
var sinon = require('sinon');

var chai = require('chai');
var expect = chai.expect;

var mainModule = rewire('../../tasks/sequelize');

describe('Main module', function () {

  it('registers a migrate task', function() {
    var spyRegisterTask = sinon.spy(grunt, 'registerTask');
    mainModule(grunt);
    expect(spyRegisterTask.calledWith('sequelize:migrate')).to.be.true;
  });

  describe('loadConfig function', function () {

    var loadConfig;
    before(function() {
      loadConfig = mainModule.__get__('loadConfig');
    });

    it('loads a static JSON configuration', function() {
      var config = loadConfig(grunt, path.normalize(path.join(__dirname, '../../assets/config.json')));
      expect(config).to.eql({
        user: 'user',
        password: 'password',
        database: 'test',
        port: 0
      });
    });

    it('loads a dynamic configuration', function() {
      var config = loadConfig(grunt, path.normalize(path.join(__dirname, '../../assets/config.js')));
      expect(config).to.eql({
        user: 'user',
        password: 'password',
        database: 'db',
        dialect: 'postgres'
      });
    });

  });
});
