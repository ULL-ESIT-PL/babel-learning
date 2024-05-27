# Traversal

When you want to transform an AST you have to
[traverse the tree](https://en.wikipedia.org/wiki/Tree_traversal) recursively.

Say we have the type `FunctionDeclaration`. It has a few properties: 

- `id`,
- `params`, and 
- `body`. 

Each of them have nested nodes.

```js
{
  type: "FunctionDeclaration",
  id: {
    type: "Identifier",
    name: "square"
  },
  params: [{
    type: "Identifier",
    name: "n"
  }],
  body: {
    type: "BlockStatement",
    body: [{
      type: "ReturnStatement",
      argument: {
        type: "BinaryExpression",
        operator: "*",
        left: {
          type: "Identifier",
          name: "n"
        },
        right: {
          type: "Identifier",
          name: "n"
        }
      }
    }]
  }
}
```

So we start at the `FunctionDeclaration` and we know its internal properties so
we visit each of them and their children in order.

Next we go to `id` which is an `Identifier`. `Identifier`s don't have any child
node properties so we move on.

After that is `params` which is an array of nodes so we visit each of them. In
this case it's a single node which is also an `Identifier` so we move on.

Then we hit `body` which is a `BlockStatement` with a property `body` that is an
array of Nodes so we go to each of them.

The only item here is a `ReturnStatement` node which has an `argument`, we go to
the `argument` and find a `BinaryExpression`.

The `BinaryExpression` has an `operator`, a `left`, and a `right`. The operator
isn't a node, just a value, so we don't go to it, and instead just visit `left`
and `right`.

This traversal process happens throughout the Babel transform stage.

## Visitors

When we talk about "going" to a node, we actually mean we are **visiting** them.
The reason we use that term is because there is this concept of a
[**visitor**](https://en.wikipedia.org/wiki/Visitor_pattern).

Visitors are a pattern used in AST traversal across languages. Simply put they
are an object with methods defined for accepting particular node types in a
tree. That's a bit abstract so let's look at an example.

```js
const MyVisitor = {
  Identifier() {
    console.log("Called!");
  }
};

// You can also create a visitor and add methods on it later
let visitor = {};
visitor.MemberExpression = function() {};
visitor.FunctionDeclaration = function() {}
```

> **Note:** `Identifier() { ... }` is shorthand for
> `Identifier: { enter() { ... } }`.

This is a basic visitor that when used during a traversal will call the
`Identifier()` method for every `Identifier` in the tree.

So with this code the `Identifier()` method will be called four times with each
`Identifier` (including `square`).

```js
function square(n) {
  return n * n;
}
```
```js
path.traverse(MyVisitor);
Called!
Called!
Called!
Called!
```

These calls are all on node **enter**. However there is also the possibility of
calling a visitor method when on **exit**.

Imagine we have this tree structure:

```js
- FunctionDeclaration
  - Identifier (id)
  - Identifier (params[0])
  - BlockStatement (body)
    - ReturnStatement (body)
      - BinaryExpression (argument)
        - Identifier (left)
        - Identifier (right)
```

As we traverse down each branch of the tree we eventually hit dead ends where we
need to traverse back up the tree to get to the next node. Going down the tree
we **enter** each node, then going back up we **exit** each node.

Let's _walk_ through what this process looks like for the above tree.

- Enter `FunctionDeclaration`
  - Enter `Identifier (id)`
    - Hit dead end
  - Exit `Identifier (id)`
  - Enter `Identifier (params[0])`
    - Hit dead end
  - Exit `Identifier (params[0])`
  - Enter `BlockStatement (body)`
    - Enter `ReturnStatement (body)`
      - Enter `BinaryExpression (argument)`
        - Enter `Identifier (left)`
          - Hit dead end
        - Exit `Identifier (left)`
        - Enter `Identifier (right)`
          - Hit dead end
        - Exit `Identifier (right)`
      - Exit `BinaryExpression (argument)`
    - Exit `ReturnStatement (body)`
  - Exit `BlockStatement (body)`
- Exit `FunctionDeclaration`

So when creating a visitor you have two opportunities to visit a node.

```js
const MyVisitor = {
  Identifier: {
    enter() {
      console.log("Entered!");
    },
    exit() {
      console.log("Exited!");
    }
  }
};
```

If necessary, you can also apply the same function for multiple visitor nodes by separating them with a `|` in the method name as a string like `Identifier|MemberExpression`.

Example usage in the [flow-comments](https://github.com/babel/babel/blob/2b6ff53459d97218b0cf16f8a51c14a165db1fd2/packages/babel-plugin-transform-flow-comments/src/index.js#L47) plugin

```js
const MyVisitor = {
  "ExportNamedDeclaration|Flow"(path) {}
};
```

You can also use aliases as visitor nodes (as defined in [babel-types](https://github.com/babel/babel/tree/master/packages/babel-types/src/definitions)).

For example,

`Function` is an alias for `FunctionDeclaration`, `FunctionExpression`, `ArrowFunctionExpression`, `ObjectMethod` and `ClassMethod`.

```js
const MyVisitor = {
  Function(path) {}
};
```

## babel-traverse and babel-generator and compact-js-ast

See example [play/hello-babel-traverse.mjs](/play/hello-babel-traverse.mjs).
