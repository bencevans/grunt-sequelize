'use strict';

// Commands:
//
// migrate:top (default)       -> Migrates to the top migration
// migrate:botom               -> Migrates to the bottom migration
// migrate:up                  -> Migrates to the above migration
// migrate:down = migrate:undo -> Migrates to the below migration
// migrate:{migration_time}    -> Migrates to a specific migration (keeping the target migration applied to db)
//

module.exports = function() {
  return this;
};

module.exports.prototype.top = function() {
  console.log('top');
};

module.exports.prototype.bottom = function() {
  console.log('bottom');
};

module.exports.prototype.up = function() {
  console.log('up');
};

module.exports.prototype.down = function() {

  var done = this.task.async();

  this.getCurrentMigration(function(err, currentMigration) {
    if(err) return done(err);
    if(!currentMigration) return done(new Error('Unable to migrate down, there\'re no migrations in database'));

  });

};


module.exports.prototype.specific = function(targetMigration) {
  var done = this.task.async();
  this.migrateTo(targetMigration, done);
};

module.exports.prototype.default = function(arg1) {
  if(!arg1) {
    this.top.apply(this, arguments);
  } else {
    this.specific.apply(this, arguments);
  }
};

module.exports.prototype.migrateTo = function(targetMigrationId, callback) {
  var self = this;

  self.getCurrentMigrationId(function(err, currentMigrationId) {
    if(err) return callback(err);

    if(currentMigrationId === targetMigrationId) {
      console.log('There are no pending migrations.');
      return callback();
    }

    var migratorOptions = self.migratorOptions;
    migratorOptions.to = targetMigrationId;
    migratorOptions.from = currentMigrationId;
    migratorOptions.method = (parseInt(migratorOptions.to, 10) >= parseInt(migratorOptions.from, 10)) ? 'up' : 'down';
    self.sequelize.getMigrator(migratorOptions);

    self.sequelize.migrate(migratorOptions).done(callback);

  });
};