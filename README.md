jessy
=====

Convert Jessy files or strings to CSS, Sass or JS.

View also [gulp-jessy](https://github.com/Ulflander/gulp-jessy) to use Jessy in
your gulp build process.


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


## Jessy methods

- `jessy.fromString(str, [options], callback)`
- `jessy.fromFile(filepath, [options], callback)`
- `jessy.parse(str)`
- `jessy.toSass(obj, options)`
- `jessy.toJs(obj, options)`

