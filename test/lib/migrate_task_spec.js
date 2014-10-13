'use strict';

require('../helpers/db');

var fs = require('fs');
var path = require('path');
var _ = require('lodash');
var shared = require('shared-examples-for');
var tk = require('timekeeper');
var utils = require('../../lib/util');
var MigrateTask = require('../../lib/migrate_task');

describe('Migrate task', function () {
  before(function () {
    var now = new Date();
    this.ids = ['example1', 'example2', 'example3', 'example4'].map(function (name) {
      now.setSeconds(now.getSeconds() + 10);
      // travel in time to generate migration id without collisions
      tk.travel(now);
      var id = utils.ts();
      fs.writeFileSync(path.join(this.migrations, id + '-' + name + '.js'), this.template);
      return id;
    }, this);

    tk.reset();
  });

  describe('instance methods', function () {
    beforeEach(function () {
      this.task = new MigrateTask(_.extend({
        migrations: this.migrations
      }, this.dbOptions));
    });

    shared.examplesFor('migrate to', function (direction) {
      it('should migrate ' + direction + ' to a specific id', function () {
        return expect(utils.lastMigrationId(this.task.migrator))
          .to.eventually.eq(this.currentMigrationId);
      });
    });

    describe('#up()', function () {
      beforeEach(function (done) {
        this.currentMigrationId = _.last(this.ids);
        this.task.up().complete(done);
      });

      context('when there are no performed migrations', function () {
        shared.shouldBehaveLike('migrate to', 'up');
      });

      context('when there are performed migrations', function () {
        before(function (done) {
          this.migrateTo(this.ids[2]).complete(done);
        });
        shared.shouldBehaveLike('migrate to', 'up');
      });
    });

    describe('#down()', function () {
      beforeEach(function (done) {
        this.currentMigrationId = null;
        this.task.down().complete(done);
      });

      context('where there are no performed migrations', function () {
        shared.shouldBehaveLike('migrate to', 'down');
      });

      context('when there are some performed migrations', function () {
        before(function (done) {
          this.migrateTo(this.ids[3]).complete(done);
        });
        shared.shouldBehaveLike('migrate to', 'down');
      });
    });

    describe('#redo()', function () {
      beforeEach(function (done) {
        this.currentMigrationId = _.last(this.ids);
        this.task.redo().complete(done);
      });
      context('when no performed migrations', function () {
        shared.shouldBehaveLike('migrate to', 'up');
      });

      context('when there are performed migrations', function () {
        before(function (done) {
          this.migrateTo(this.ids[2]).complete(done);
        });
        shared.shouldBehaveLike('migrate to', 'up');
      });
    });
  });
});
