## Introduction to the  `--env-name` flag and `path.scope.hasBinding`

See 

- The config file [babel.config.js](./babel.config.js)
- The test [input.js](./input.js)
- The plugin [nondeclared.mjs](./nondeclared.mjs)

## Executions

### Using --env-name development

```
➜  non-declared git:(main) npx babel input.js  --env-name development

Variable "m" not declared at line 3. Declared variables: [ 'n' ]
let n = 4;
m = 9;
n = n * m;
```

### Using --env-name custom

```
➜  non-declared git:(main) ✗ npx babel input.js  --env-name custom     

Variable "n" declared at line 1.
let n = 4;
m = 9;
n = n * m;
```