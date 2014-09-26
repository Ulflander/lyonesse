Jessy file format specifications
================================

## File

* Basically Jessy files are like `ini` files: a simple key/value list
* Jessy files mimetypes: `text/x-jessy` or `text/plain`
* Jessy file extension: `.jessy` or `.jess`


## Line

There three kind of lines:

- A comment, if the line starts with the char `#`
- An empty line
- A key/value pair, the key being the name, and its associated value. 
    - Separator between key and value is char `:`

## Indentation

## Key

- If the key contains a hyphen (`-`) char, it should be converted to underscore `_` when converted to JS

## Value

Here are the detailled specifications:

- A Jessy file is a list of key/value pairs, one per line.


## Example

The following example is a valid Jessy file:

```
# This is a comment
# This also, but not the color on the line below

backgroundColor: #FF5500
titleColor: 10
```

## Best practices

- Use camelCase

