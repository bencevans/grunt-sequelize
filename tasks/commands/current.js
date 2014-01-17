'use strict';

// current -> Writes the current migration to console

module.exports = function() {
  return this;
};

module.exports.prototype.default = function() {
  var self = this;

  var done = self.task.async();

  self.getCurrentMigrationId(function(err, serverMigrationId) {
    if(err) {
      return done(err);
    }
    self.grunt.log.writeln('');
    self.grunt.log.writeln('  Current Migration: ', serverMigrationId || 'null - no migrations applied');
    self.grunt.log.writeln('');
    done();
  });


};