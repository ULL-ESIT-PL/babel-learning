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