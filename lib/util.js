'use strict';

var utils = exports;
var path = require('path');
var _ = require('lodash');

utils.lastMigrationId = function (migrator) {
  return migrator.findOrCreateSequelizeMetaDAO()
    .then(function (Meta) {
      return Meta.find({ order: 'id DESC' });
    })
    .then(function (meta) {
      return meta ? meta.to : null;
    });
};

utils.pad = function (n) {
  return n < 10 ? '0' + n : n;
};

utils.ts = function () {
  var date = new Date();

  return date.getFullYear().toString() +
    utils.pad(date.getMonth() + 1).toString() +
    utils.pad(date.getDate()).toString() +
    utils.pad(date.getHours()).toString() +
    utils.pad(date.getMinutes()).toString() +
    utils.pad(date.getSeconds()).toString();
};

utils.optsProvider = function (grunt) {
  return function (baseDbPath) {
    return _.defaults(grunt.config.get('sequelize.options'), {
      config: path.join(baseDbPath, 'config.json'),
      migrations: path.join(baseDbPath, 'migrations')
    });
  };
};
