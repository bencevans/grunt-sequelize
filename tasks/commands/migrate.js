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

};

module.exports.prototype.bottom = function() {

};

module.exports.prototype.up = function() {

};

module.exports.prototype.down = function() {

};


module.exports.prototype.specific = function() {

};

module.exports.prototype.default = function(arg1) {
  if(!arg1) {
    this.top.call(arguments);
  } else {
    this.specific.call(arguments);
  }
};
