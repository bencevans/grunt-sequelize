# grunt-sequelize

[![Build](https://travis-ci.org/bencevans/grunt-sequelize.svg?branch=master)](https://travis-ci.org/bencevans/grunt-sequelize)
[![Coverage Status](https://coveralls.io/repos/bencevans/grunt-sequelize/badge.png?branch=master)](https://coveralls.io/r/bencevans/grunt-sequelize?branch=master)

[![Dependency Status](https://david-dm.org/bencevans/grunt-sequelize.svg)](https://david-dm.org/bencevans/grunt-sequelize)
[![devDependency Status](https://david-dm.org/bencevans/grunt-sequelize/dev-status.svg)](https://david-dm.org/bencevans/grunt-sequelize#info=devDependencies)

> Sequelize migrations from Grunt

## Getting Started
This plugin requires Grunt `~0.4.1`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-sequelize --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-sequelize');
```

## The "sequelize" task

### Overview
In your project's Gruntfile, add a section named `sequelize` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  sequelize: {
    options: {
      migrationsPath: 'db/migrations',
      config: 'db/config.json'
    }
  }
})
```

### Options

#### options.migrationsPath
Type: `String`

A string value that is used to location your migration files.

#### options.config
Type: `String`

A string value that is used to locate your sequelize db config.

##### Example of config.json

```js
{
  "development": {
    "username": "user",
    "password": "pwd",
    "database": "my_cool_db"
  }
}
```

### Running tasks

Both the migrate and undo tasks have been ported from Sequelize's original CLI.

#### Migrate

You can run the migrations up to the top migration by running:

    $ grunt sequelize:migrate

or

    $ grunt sequelize:migrate:up

#### Undo

In order to migrate down the latest migration, use:

    $ grunt sequelize:migrate:undo

#### Redo

Also you can redo latest migration by running:

    $ grunt sequelize:migrate:redo

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style.
Add unit tests for any new or changed functionality. Validate and test your code by running

    $ npm run lint

## Release History
_(Nothing yet)_
