# Flow Example

## Execution

```bash 
➜  flow git:(main) ✗ cat hello-flow.js
class A {
  declare foo: string; // Removed
  bar: string; // Initialized to undefined
}
```

```bash
➜  flow git:(main) ✗ npx babel hello-flow.js
class A {
  // Removed
  bar; // Initialized to undefined
}
```