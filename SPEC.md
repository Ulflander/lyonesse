Lyonesse file format specifications
================================

## File

* Basically Lyonesse files are like `ini` files: a simple key/value list
* Lyonesse files mimetypes: `text/x-lyonesse` or `text/plain`
* Lyonesse file extension: `.lyonesse` or `.lyon`


## Line

There are three kind of lines:

- Empty lines (zero or more spaces/tabs)
- A comment, if the line starts with the char `#` (even with spaces before the `#`)
- A key/value pair, the key being the name, and its associated value. 
    - Separator between key and value is char `:`

## Key

- Authorized chars for keys are `[a-zA-Z0-9\-_]`
- If the key contains a hyphen (`-`) char, it should be converted to underscore `_` when converted to JS

## Value

- Value can be anything
- It should be copied as is in Scss
- For JS, it should be converted in case it's a number. A number is anything that contains only chars `[0-9\.]`
- Value can be a reference to a previous key, then value should be replaced by the value corresponding to this other key


## Example

The following example is a valid Lyonesse file:

```
# This is a comment
# This also, but not the color on the line below

backgroundColor: #FF5500
titleMargin: 10px
lineHeight: 1.1
lineHeightAlias: $lineHeight
```

The following is the conversion into Scss:

```
$backgroundColor: #FF5500;
$titleMargin: 10px;
$lineHeight: 1.1;
$lineHeightAlias: 1.1;
```

The following is the conversion into JS (with no namespace):

```
var backgroundColor = '#FF5500',
    titleMargin = '10px',
    lineHeight = 1.1,
    lineHeightAlias = 1.1;
```

## Best practices

- Use `lowerCamelCase` for key names

