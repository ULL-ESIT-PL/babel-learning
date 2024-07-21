# Implicit Return

The plugin https://github.com/miraks/babel-plugin-implicit-return transforms last statement in a function block to a return statement.

## Execution

```js 
➜  implicit-return git:(main) ✗ cat input.js
function Pi() {
  3.14;
}
console.log(Pi());
```

Is transformed to:

```js
➜  implicit-return git:(main) ✗ npx babel input.js --plugins implicit-return -o salida.js
➜  implicit-return git:(main) ✗ cat salida.js 
function Pi() {
  return 3.14;
}
console.log(Pi());
➜  implicit-return git:(main) ✗ node salida.js                                           
3.14
```

```js
➜  implicit-return git:(main) cat input2.js 
function abs(n) {
  if (n > 0) {
    1;
  } else if (n < 0) {
    -1;
  } else {
    0;
  }
}
```

Transformed to:

```js
➜  implicit-return git:(main) ✗ npx babel input2.js --plugins implicit-return
function abs(n) {
  if (n > 0) {
    return 1;
  } else if (n < 0) {
    return -1;
  } else {
    return 0;
  }
}
```
