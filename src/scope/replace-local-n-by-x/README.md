# Example of path.scope.hasOwnBinding

See [input.js](input.js) and [localreplace.mjs](localreplace.mjs).
Execution:

`➜  replace-local-n-by-x git:(main) ✗ VARNAME="n" REPLACE="p" npx babel input.js --plugins=./localreplace.mjs`
```
let n = 5;
function square(p) {
  return p * p;
}
n = square(n) * n;
```

We can also use `path.scope.rename` to rename the variable as in the plugin [rename.mjs](rename.mjs).

```js
➜  replace-local-n-by-x git:(main) ✗ VARNAME="n" REPLACE="z" npx babel input.js --plugins=./rename.mjs
let n = 5;
function square(z) {
  return z * z;
}
n = square(n) * n;
```
The global variable `n` is not renamed, only the local variable `n` in the function `square`.