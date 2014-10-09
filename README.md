# grunt-sequelize

### Looking for a new maintainers, please contact @bencevans

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
      migrationsPath: __dirname + '/migrations',
      // The following is the sequelize config you're used to
      dialect:  'postgres',
      username: 'postgres',
      database: '4_r34lly_s3cur3_p455w0rd',
      host:     '127.0.0.1'
    }
  },
})
```

### Options

#### options.migrationsPath
Type: `String`

A string value that is used to location your migration files.

#### options.*
Type: Many

Sequelize options as you would usually use for the Sequelize client.

### Running tasks

Both the migrate and undo tasks have been ported from Sequelize's original CLI.

#### Migrate

You can run the migrations up to the top migration by running:

    $ grunt sequelize:migrate

#### Undo

In order to migrate down the stack, use:

    $ grunt sequelize:undo

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_
