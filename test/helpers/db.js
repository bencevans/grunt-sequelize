'use strict';

require('./test_dirs');

var path = require('path');
var fs = require('fs');
var mkdirp = require('mkdirp');
var _ = require('lodash');
var createMigrator = require('../../lib/migrate_task').createMigrator;

before('Create db connection', function () {
  this.opts = {
    dialect: 'sqlite',
    storage: path.join(this.tmpDir, 'db-test.sqlite'),
    migrationsPath: path.join(this.tmpDir, 'migrations'),
    logging: false
  };

  this.migrator = createMigrator(this.opts);

  mkdirp.sync(this.opts.migrationsPath);

  this.template = fs.readFileSync(path.join(__dirname, '../../assets/migration.tpl'));

  this.migrateTo = function (id) {
    return this.migrator.up({ to: id });
  };
});

afterEach('Roll back all migrations', function () {
  return this.migrator.executed()
    .bind(this.migrator)
    .then(function (executed) {
      return this.down(_.pluck(executed, 'file'));
    });
});

after('Close db connection', function () {
  this.migrator.options.storageOptions.sequelize.close();
});
