'use strict';

var tmp = require('tmp');

before('Create temp directory', function (done) {
  tmp.dir({ mode: 755 }, function (err, path) {
    this.tmpDir = path;
    done(err);

  }.bind(this));
});
