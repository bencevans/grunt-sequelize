'use strict';

var moment = require('moment');
var _ = require('lodash');
var utils = exports;

utils.lastMigrationId = function (migrator) {
  return migrator.executed()
    .then(_.last)
    .then(function (migration) {
      return migration && migration.file || null;
    });
};

utils.ts = function () {
  return moment().format('YYYYMMDDHHmmss');
};
