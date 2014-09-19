Jessy
=====

Convert Jessy files or strings to CSS, Sass or JS.

View also [gulp-jessy](https://github.com/Ulflander/gulp-jessy) to use Jessy in
your gulp build process.

- [Jessy fie specs](#jessy-file-specs)
- [Functions](#jessy-functions)
- [Available options](#options)


## Why Jessy

When developing front-ends, it's often the case that a color may be used both
in the CSS files and in Javascript (with Canvas, SVG...).

Jessy goal is to let you have a centralized file for this kind of variable.

Most notably, having a unique file for all the colors used in your web 
application will ease any future redesign.


## Jessy files specs

- A Jessy file is a list of key/value pairs, one per line.
- Separator between the key and the value is `:`
- Comments are available if the line starts with `#`
- Convention is to use CamelCase for key names
- If keys contains a hyphen (`-`) char, it will be converted to underscore `_` when converting to JS
- You can haz empty linez

The following example is a valid Jessy file:

```
# This is a comment
# This also, but not the color on the line below

color: #FF5500
ten: 10
```


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
- `target`: `'sass'` or `'js'`, default `'js'` - Specifies compilation target when using `fromFile` and `fromString` functions
- `namespace`: default `null`