# Visiting

## Differences between `traverse` and `visitor:` methods in Babel.js

In Babel.js, the `traverse` method from the `babel-traverse` package and the `visitor` methods provided within Babel plugins both serve the purpose of walking through and manipulating the Abstract Syntax Tree (AST). However, they are used in slightly different contexts and have some differences in how they are typically utilized.

- **`traverse` Method**:
  - Directly calls for AST traversal and manipulation.
  - Can be used outside of the Babel plugin context.
  - Offers more control and flexibility for one-off transformations.

- **`visitor:` Methods**:
  - Part of the Babel plugin system.
  - Automatically integrated into the Babel transformation pipeline.
  - More convenient for defining transformations as part of the Babel configuration.

In essence, `traverse` provides a lower-level API for AST manipulation, while `visitor` methods within plugins offer a higher-level, more convenient way to apply transformations within the Babel ecosystem.

## Get the Path of Sub-Node

To access an AST node's property you normally access the node and then the property. `path.node.property`

```js
// the BinaryExpression AST node has properties: `left`, `right`, `operator`
BinaryExpression(path) {
  path.node.left;
  path.node.right;
  path.node.operator;
}
```

If you need to access the `path` of that property instead, use the `get` method of a path, passing in the string to the property.

```js
BinaryExpression(path) {
  path.get('left'); 
}
Program(path) {
  path.get('body.0');
}
```

You can't current use `get` on a Container (the `body` array of a `BlockStatement`), but you chain the dot syntax instead.

```js
export default function f() {
  return bar;
}
```

For the example above, if you wanted to get the path corresponding to the `return`, you could chain the various properties, using a number as the index when traversing the array.

```js
ExportDefaultDeclaration(path) {
  path.get("declaration.body.body.0");
}
```

## Check if a node is a certain type

If you want to check what the type of a node is, the preferred way to do so is:

```js
BinaryExpression(path) {
  if (t.isIdentifier(path.node.left)) {
    // ...
  }
}
```

You can also do a shallow check for properties on that node:

```js
BinaryExpression(path) {
  if (t.isIdentifier(path.node.left, { name: "n" })) {
    // ...
  }
}
```

This is functionally equivalent to:

```js
BinaryExpression(path) {
  if (
    path.node.left != null &&
    path.node.left.type === "Identifier" &&
    path.node.left.name === "n"
  ) {
    // ...
  }
}
```

## Check if a path is a certain type

A path has the same methods for checking the type of a node:

```js
BinaryExpression(path) {
  if (path.get('left').isIdentifier({ name: "n" })) {
    // ...
  }
}
```

is equivalent to doing:

```js
BinaryExpression(path) {
  if (t.isIdentifier(path.node.left, { name: "n" })) {
    // ...
  }
}
```

## Check if an identifier is referenced

```js
Identifier(path) {
  if (path.isReferencedIdentifier()) {
    // ...
  }
}
```

See the example at [src/visiting/input-isreferenced-example.js](/src/visiting/input-isreferenced-example.js) 

`➜  babel-learning git:(main) ✗ cat src/visiting/input-isreferenced-example.js`
```js
let x = 1, y = 2, z = 3;
function f(a,b)  { let c; return a+b; }
f(x,y);
```
and the corresponding plugin [src/visiting/plugin-isreferenced-example.cjs](/src/visiting/plugin-isreferenced-example.cjs):

```
➜  babel-learning git:(main) ✗ npx babel src/visiting/input-isreferenced-example.js  --plugins=./src/visiting/plugin-isreferenced-example.cjs -o  /dev/null
declared  x  at line  1  col  4
declared  y  at line  1  col  11
declared  z  at line  1  col  18
declared  f  at line  2  col  9
declared  a  at line  2  col  11
declared  b  at line  2  col  13
declared  c  at line  2  col  23
referenced  a  at line  2  col  33
referenced  b  at line  2  col  35
referenced  f  at line  3  col  0
referenced  x  at line  3  col  2
referenced  y  at line  3  col  4
```

Alternatively:

```js
Identifier(path) {
  if (t.isReferenced(path.node, path.parent)) {
    // ...
  }
}
```

## Find a specific parent path

Sometimes you will need to traverse the tree upwards from a path until a condition is satisfied.


### path.findParent

```js
path.findParent((path) => path.isObjectExpression());
```

Call the provided `callback` with the `NodePath`s of all the parents.
When the `callback` returns a **truthy** value, we return that `NodePath`.

See the example at [src/visiting/input-getfunctionparent-example.js](/src/visiting/input-getfunctionparent-example.js) and the corresponding plugin [src/visiting/plugin-getoperator-example.cjs](/src/visiting/plugin-getoperator-example.cjs):

```
➜  babel-learning git:(main) ✗ npx babel src/visiting/input-getfunctionparent-example.js --plugins=./src/visiting/plugin-getoperator-example.cjs -o /dev/null
2  surrounded by  +  in  2 + 3  at line  1  col  23
3  surrounded by  +  in  2 + 3  at line  1  col  25
4  surrounded by  *  in  4 * 5  at line  2  col  0
5  surrounded by  *  in  4 * 5  at line  2  col  2
```

### path.find

If the current path should be included as well:

```js
path.find((path) => path.isObjectExpression());
```

Find the closest parent function or program:

### path.getFunctionParent();

```js
path.getFunctionParent();
```

Walk up the tree until we hit a parent node path in a list. See the example at [src/visiting/input-getfunctionparent-example.js](/src/visiting/input-getfunctionparent-example.js) and the plugin [src/visiting/plugin-getfunctionparent-example.cjs](/src/visiting/plugin-getfunctionparent-example.cjs):

```
➜  babel-learning git:(main) ✗ npx babel src/visiting/input-getfunctionparent-example.js --plugins=./src/visiting/plugin-getfunctionparent-example.cjs -o /dev/null  
function  f  surrounds  2 + 3
no surrounding function for *
```

### path.getStatementParent();

```js
path.getStatementParent();
```

Stops at the first parent that is a statement.

See the example at [src/visiting/input-getfunctionparent-example.js](/src/visiting/input-getfunctionparent-example.js) and the plugin [src/visiting/plugin-getstatement-example.cjs](/src/visiting/plugin-getstatement-example.cjs):

```
➜  babel-learning git:(main) ✗ npx babel src/visiting/input-getfunctionparent-example.js --plugins=./src/visiting/plugin-getstatement-example.cjs -o /dev/null
statement  ReturnStatement  surrounds  2 + 3
statement  ExpressionStatement  surrounds  4 * 5
```

## Get Sibling Paths

If a path is in a list like in the body of a `Function`/`Program`, it will have "siblings".

- Check if a path is part of a list with `path.inList`
- You can get the surrounding siblings with `path.getSibling(index)`,
- The current path's index in the container with `path.key`,
- The path's container (an array of all sibling nodes) with `path.container`
- Get the name of the key of the list container with `path.listKey`

See the example at [src/get-sibling-path.mjs](/src/get-sibling-path.mjs)

```js
import * as babylon from "babylon";
import _traverse from "@babel/traverse";
const traverse = _traverse.default;

const code = `
var a = 1; // pathA, path.key = 0
var b = 2; // pathB, path.key = 1
var c = 3; // pathC, path.key = 2
`;

const ast = babylon.parse(code);

traverse(ast, {
  enter(path) {
    if (path.node.type === "VariableDeclaration") {
      console.error(
        path.inList, // true
        path.listKey, // 
        path.key, // 0
        path.getSibling(path.key).node.declarations[0].id.name, // 
        path.getSibling((path.key + 1)%3).node.declarations[0].id.name, //
        path.container.length, // 3
        path.getPrevSibling().node?.declarations[0].id.name, // 
        path.getNextSibling().node?.declarations[0].id.name, // 
        path.getAllPrevSiblings().length,  // 
        path.getAllNextSiblings().length   // 
      );
    }
  }
});

```

Run the script:

```sh
➜  babel-learning git:(main) ✗ node src/get-sibling-path.mjs
true body 0 a b 3 undefined b 0 2
true body 1 b c 3 a c 1 1
true body 2 c a 3 b undefined 2 0
```

> These APIs are used in the [transform-merge-sibling-variables](https://github.com/babel/babili/blob/master/packages/babel-plugin-transform-merge-sibling-variables/src/index.js) plugin used in [babel-minify](https://github.com/babel/babili).


* `path(undefined)` is a `NodePath` where the `path.node === undefined`

## Stopping Traversal

If your plugin needs to not run in a certain situation, the simpliest thing to do is to write an early return.

```js
BinaryExpression(path) {
  if (path.node.operator !== '**') return;
}
```

If you are doing a sub-traversal in a top level path, you can use 2 provided API methods:

`path.skip()` skips traversing the children of the current path.
`path.stop()` stops traversal entirely.

```js
outerPath.traverse({
  Function(innerPath) {
    innerPath.skip(); // if checking the children is irrelevant
  },
  ReferencedIdentifier(innerPath, state) {
    state.iife = true;
    innerPath.stop(); // if you want to save some state and then stop traversal, or deopt
  }
});
```


