'use strict';

require('./test_dirs');

var path = require('path');
var fs = require('fs');
var mkdirp = require('mkdirp');
var Sequelize = require('sequelize');

before('Create db connection', function () {
  this.dbOptions = {
    dialect: 'sqlite',
    storage: path.join(this.tmpDir, 'db-test.sqlite'),
    logging: false
  };

  this.db = new Sequelize(this.dbOptions.database, this.dbOptions.username, this.dbOptions.password,
    this.dbOptions);

  this.migrations = path.join(this.tmpDir, 'migrations');
  mkdirp.sync(this.migrations);
  this.template = fs.readFileSync(path.join(__dirname, '../../lib/assets/migration.js'));

  this.migrateTo = function (id) {
    return this.db.getMigrator({ path: this.migrations, to: id }, true)
      .migrate();
  };
});

afterEach('Roll back all migrations', function (done) {
  this.db.getMigrator({ path: this.migrations }).findOrCreateSequelizeMetaDAO()
    .then(function (Meta) {
      return Meta.destroy();
    })
    .complete(done);
});

after('Close db connection', function () {
  this.db.close();
});
