
## Jessy file specs

- A Jessy file is a list of key/value pairs, one per line.
- Separator between the key and the value is `:`
- Comments are available if the line starts with `#`
- Convention is to use camelCase for key names
- If keys contains a hyphen (`-`) char, it will be converted to underscore `_` when converting to JS
- You can haz empty linez

The following example is a valid Jessy file:

```
# This is a comment
# This also, but not the color on the line below

color: #FF5500
ten: 10
```
