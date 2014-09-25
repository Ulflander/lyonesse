Jessy
=====

Convert Jessy files or strings to Sass and/or JS.

See also [gulp-jessy](https://github.com/Ulflander/gulp-jessy) to use Jessy in
your gulp build process.

If you use Sublime Text, download [sublime-jessy](https://github.com/Ulflander/sublime-jessy) syntax definition file, it provides code highlighting.

- [Jessy file specs](#jessy-file-specs)
- [Functions](#jessy-functions)
- [Available options](#options)
- [Run tests](#run-tests)
- [Changelog](#changelog)

Released under MIT License.


## Install

```
npm install --save jessy
```


## Why Jessy

When developing front-ends, it's often the case that a color may be used both
in the CSS files and in Javascript (with Canvas, SVG...).

Jessy goal is to let you have a centralized file for this kind of variable.

Most notably, having a unique file for all the colors used in your web 
application will ease any future redesign.

See [here](SPEC.md) the specifications of Jessy file.


## Jessy functions

Callback takes two arguments: `err` in case of errors, and `result` for compiled string.

##### `jessy.fromString(str, [options], callback)`

Parse a Jessy string and call back with Js or Sass compiled string.

##### `jessy.fromFile(filepath, [options], callback)`

Parse a Jessy file and call back with Js or Sass compiled string.

##### `jessy.parse(str)`

Returns a Jessy object from a Jessy string.

##### `jessy.toSass(obj, options)`

Returns a Sass string from a Jessy object, using given options.

##### `jessy.toJs(obj, options)`

Returns a Js string from a Jessy object, using given options.

#### Example

```js
var jessy = require('jessy');

jessy.fromString('color: #000', function (err, result) {
    if (!!err) {
        return;
    }

    console.log(result); // var color = '#000';
});
```

## Options

- `symbol`: default `'$'` - Specifies prefix of Sass variables
- `target`: `'scss'` or `'js'`, default `'js'` - Specifies compilation target when using `fromFile` and `fromString` functions
- `namespace`: default `null`
- `closure`: default `false` - For JS only, enclose result in a closure (nested namespaces only)

## Run tests

Requires mocha (`npm install -g mocha`), then in command line:

```
$ mocha
```

## Changelog

- 0.1.0: First version
- 0.1.1: Add closure option