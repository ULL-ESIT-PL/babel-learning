See

- [/doc/scope.md#pushing-a-variable-declaration](/doc/scope.md#pushing-a-variable-declaration)
- [/doc/scope.md#pushing-a-variable-declaration-to-a-parent-scope](/doc/scope.md#pushing-a-variable-declaration-to-a-parent-scope)


```js
➜  scopepush git:(main) npx babel --plugins=./scopepush.cjs input.js 
function tutu(x) {
  const newVar = 42;
  return newVar;
}

➜  scopepush git:(main) npx babel --plugins=./scopeparentpush.cjs input.js 
var _tutu = function tutu(x) {
  return newVar;
};
```