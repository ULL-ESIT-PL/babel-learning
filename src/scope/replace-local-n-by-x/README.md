# Example of path.scope.hasOwnBinding

See [input.js](input.js) and [localreplace.mjs](localreplace.mjs).
Execution:

`➜  replace-local-n-by-x git:(develop) npx babel input.js --plugins=./localreplace.mjs`
```
let n = 5;
function square(x) {
  return x * x;
}
n = square(n) * n;
```