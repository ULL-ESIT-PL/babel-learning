## Introduction to the  `--env-name` flag and `path.scope.hasBinding`

Babel CLI allows you to override plugin options using the `--env-name` flag combined with a specific environment configuration in your [Babel config file](./babel.config.js).

See 

- The config file [babel.config.js](./babel.config.js)
- The test [input.js](./input.js)
- The plugin [nondeclared.mjs](./nondeclared.mjs)

## Executions

### Using --env-name development

```
➜  non-declared git:(main) npx babel input.js  --env-name development

Searching for variable "m"
m at 2 is declared.
m at 3 is not declared.
m at 4 is not declared.
```

### Using --env-name custom

```
➜  non-declared git:(main) ✗ npx babel input.js  --env-name custom     

Searching for variable "n"
n at 1 is declared.
n at 2 is declared.
n at 4 is declared
```