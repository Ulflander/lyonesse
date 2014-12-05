Lyonesse
=====

[![Build Status](https://travis-ci.org/Ulflander/lyonesse.svg?branch=master)](https://travis-ci.org/Ulflander/lyonesse)


## Why Lyonesse

When developing front-ends, it's often the case that a color may be used both
in the CSS files and in Javascript (with Canvas, SVG...).

Lyonesse goal is to let you have a centralized file for this kind of variable.

Most notably, having a unique file for all the colors used in your web 
application will ease any future redesign.

See [here](SPEC.md) the specifications of Lyonesse file.

See also [gulp-lyonesse](https://github.com/Ulflander/gulp-lyonesse) to use Lyonesse in your gulp build process.

If you use Sublime Text, download [sublime-lyonesse](https://github.com/Ulflander/sublime-lyonesse) syntax definition file, it provides code highlighting.

- [Functions](#lyonesse-functions)
- [Available options](#options)
- [Run tests](#run-tests)
- [Changelog](#changelog)

Released under MIT License.

## Install

```
npm install --save lyonesse
```

## Lyonesse functions

Callback takes two arguments: `err` in case of errors, and `result` for compiled string.

##### `lyonesse.fromString(str, [options], callback)`

Parse a Lyonesse string and call back with Js or Scss compiled string.

##### `lyonesse.fromFile(filepath, [options], callback)`

Parse a Lyonesse file and call back with Js or Scss compiled string.

##### `lyonesse.parse(str)`

Returns a Lyonesse object from a Lyonesse string.

##### `lyonesse.solve(obj, options)`

Solve variables inside the Lyonesse file.

##### `lyonesse.toScss(obj, options)`

Returns a Scss string from a Lyonesse object, using given options.

##### `lyonesse.toJs(obj, options)`

Returns a Js string from a Lyonesse object, using given options.

#### Example

```js
var lyonesse = require('lyonesse');

lyonesse.fromString('color: #000', function (err, result) {
    if (!!err) {
        return;
    }

    console.log(result); 
    // var color = '#000';
});
```

#### Variables in Lyonesse

Since Lyonesse 0.1.2, variables inside Lyonesse are now supported. For example, given this Lyonesse file:

```
myColor: #234567
otherColor: $myColor
```

when parsed and solve, the variable `otherColor` will get the value of 
`myColor` so `otherColor` value is now `#234567`.

Use the `solve` option to deactivate this behaviour.

#### Namespaces

Since Lyonesse 0.1.3, you can use namespaces in Lyonesse files:

```
my:
    namespace:
        color: #000
    inside: #f00
global: #fff
```

This will produce the following JavaScript: 
```js
var my = {
        namespace: {
            color: '#000'
        },
        inside: '#f00'
    }, 
    global = '#fff';
```

and the following Scss:
```scss
$my-namespace-color: #000;
$my-inside: #f00;
$global: #fff;
```

## Options

- `symbol`: default `'$'` - Specifies prefix of Scss variables
- `target`: `'scss'` or `'js'`, default `'js'` - Specifies compilation target when using `fromFile` and `fromString` functions
- `namespace`: default `null`
- `closure`: default `false` - For JS only, enclose result in a closure (nested namespaces only)
- `solve`: default `true` - Solve or not the variables inside the lyonesse file

## Run tests

Requires mocha (`npm install -g mocha`), then in command line:

```
$ mocha
```

## Changelog

- 0.1.0: First version
- 0.1.1: Add closure option
- 0.1.2: Variable replacement!
- 0.1.3: Namespaces!
- 0.2.0: It's Scss, not Sass dumb
    + Breaking change: rename `toSass` method to `toScss`
- 0.2.1: Fix variables inside namespaces
- 0.3.0: Rebranding to Lyonesse!
