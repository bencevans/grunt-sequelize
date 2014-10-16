'use strict';

var Sequelize = require('sequelize');
var _ = require('lodash');

function MigrateTask(opts) {
  this._migratorOpts = process.env.NODE_ENV === 'test' ?
    { path: opts.migrations } : /* istanbul ignore next */
    { path: opts.migrations, logging: console.log };

  this.db = new Sequelize(opts.database, opts.username, opts.password, opts);
  this.migrator = this.db.getMigrator(this._migratorOpts);
}

MigrateTask.prototype.init = function () {
  return this.db.authenticate();
};

MigrateTask.prototype.up = function () {
  return this.migrator.migrate();
};

MigrateTask.prototype.down = function () {
  return this.migrator.findOrCreateSequelizeMetaDAO()
    .then(function (Meta) {
      return Meta.find({ order: 'id DESC' });
    })
    .then(function (meta) {
      if (!meta) {
        return;
      }

      return this.db.getMigrator(_.extend(meta.dataValues, this._migratorOpts), true)
        .migrate({ method: 'down' });

    }.bind(this));
};

MigrateTask.prototype.redo = function () {
  return this.down()
    .then(this.up.bind(this));
};

module.exports = MigrateTask;
