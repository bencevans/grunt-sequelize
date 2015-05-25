'use strict';

require('../helpers/db');

var fs = require('fs');
var path = require('path');
var _ = require('lodash');
var shared = require('shared-examples-for');
var tk = require('timekeeper');

var chai = require('chai');
chai.use(require('chai-as-promised'));

var expect = chai.expect;

var utils = require('../../lib/util');
var createMigrateTask = require('../../lib/migrate_task');

describe('Migrate task', function () {
  before(function () {
    var now = new Date();
    this.ids = ['example1', 'example2', 'example3', 'example4'].map(function (name) {
      now.setSeconds(now.getSeconds() + 10);
      // travel in time to generate migration id without collisions
      tk.travel(now);
      var id = utils.ts() + '-' + name + '.js';
      fs.writeFileSync(path.join(this.opts.migrationsPath, id), this.template);
      return id;
    }, this);

    tk.reset();
  });

  describe('instance methods', function () {
    beforeEach(function () {
      this.task = createMigrateTask(this.opts);
    });

    shared.examplesFor('migrate to', function (direction) {
      it('should migrate ' + direction + ' to a specific id', function () {
        return expect(utils.lastMigrationId(this.task))
          .to.eventually.eq(this.currentMigrationId);
      });
    });

    describe('#up()', function () {
      beforeEach(function () {
        this.currentMigrationId = _.last(this.ids);
        return this.task.up();
      });

      context('when there are no performed migrations', function () {
        shared.shouldBehaveLike('migrate to', 'up');
      });

      context('when there are performed migrations', function () {
        before(function () {
          return this.migrateTo(this.ids[2]);
        });
        shared.shouldBehaveLike('migrate to', 'up');
      });
    });

    describe('#down()', function () {
      beforeEach(function () {
        return this.task.down();
      });

      context('where there are no performed migrations', function () {
        beforeEach(function () {
          this.currentMigrationId = null;
        });
        shared.shouldBehaveLike('migrate to', 'down');
      });

      context('when there are some performed migrations', function () {
        before(function () {
          this.currentMigrationId = this.ids[2];
          return this.migrateTo(this.ids[3]);
        });
        shared.shouldBehaveLike('migrate to', 'down');
      });
    });

    describe('#redo()', function () {
      beforeEach(function () {
        this.currentMigrationId = _.last(this.ids);
        return this.task.redo();
      });
      context('when no performed migrations', function () {
        shared.shouldBehaveLike('migrate to', 'up');
      });

      context('when there are performed migrations', function () {
        before(function () {
          return this.migrateTo(this.ids[2]);
        });
        shared.shouldBehaveLike('migrate to', 'up');
      });
    });
  });
});
