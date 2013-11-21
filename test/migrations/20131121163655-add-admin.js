module.exports = {
  up: function(migration, DataTypes, done) {

    migration.addColumn('users', 'admin', DataTypes.BOOLEAN).complete(done);

  },
  down: function(migration, DataTypes, done) {

    migration.removeColumn('users', 'admin').complete(done);

  }
}
