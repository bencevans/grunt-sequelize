
'use strict';

module.exports = {
  up: function (migration, DataTypes, done) {

    migration.createTable('users', {
      name: DataTypes.STRING
    }).complete(done);

  },
  down: function (migration, DataTypes, done) {

    migration.dropTable('nameOfTheExistingTable').complete(done);

  }
};
