See https://github.com/miraks/babel-plugin-implicit-return

## Execution

```js 
➜  implicit-return git:(main) ✗ cat input.js
function Pi() {
  3.14;
}
```

Is transformed to:

```js
➜  implicit-return git:(main) ✗ npx babel input.js --plugins implicit-return         
function Pi() {
  return 3.14;
}
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
