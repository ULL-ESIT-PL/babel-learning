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
[**visitor** as specified in the wikipedia](https://en.wikipedia.org/wiki/Visitor_pattern).

Visitors are a pattern used in AST traversal across languages. 
**Simply put they are an object with methods defined for accepting particular node types in a tree**. 

That's a bit abstract so let's look at an example.

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

These calls are all on node **enter**. 
However there is also the possibility of
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

### enter and exit 

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

### The `|` operator

If necessary, you can also apply the same function for multiple visitor nodes by separating them with a `|` in the method name as a string like `Identifier|MemberExpression`.

Example usage in the [flow-comments](https://github.com/babel/babel/blob/2b6ff53459d97218b0cf16f8a51c14a165db1fd2/packages/babel-plugin-transform-flow-comments/src/index.js#L47) plugin

```js
const MyVisitor = {
  "ExportNamedDeclaration|Flow"(path) {}
};
```

### Aliases

You can also use aliases as visitor nodes, as defined in [babel-types](https://babeljs.io/docs/babel-types#node-builders). Source at https://github.com/babel/babel/tree/master/packages/babel-types/src/definitions.

For example,

`Function` is an alias for `FunctionDeclaration`, `FunctionExpression`, `ArrowFunctionExpression`, `ObjectMethod` and `ClassMethod`.

```js
const MyVisitor = {
  Function(path) {}
};
```

## babel-traverse and babel-generator and compact-js-ast

See example [src/traverse/hello-babel-traverse.mjs](/src/traverse/hello-babel-traverse.mjs):

This introductory example traverses the AST for the code:

```js 
function square(n) {
  return n * n;
}
```

renaming all the `n` identifiers to `x`. It also uses the npm module [compact-js-ast](https://github.com/ULL-ESIT-PL/compact-js-ast)
to show a YAML compact version of the AST.

```js
import * as babylon from "@babel/parser";
import _traverse from "@babel/traverse";
const traverse = _traverse.default;
//console.log(traverse)
import _generate from "@babel/generator";
const generate = _generate.default;

import compast from "compact-js-ast"

const code = `function square(n) {
  return n * n;
}`;

const ast = babylon.parse(code);

traverse(ast, {
  enter(path) {
    if (
      path.node.type === "Identifier" &&
      path.node.name === "n"
    ) {
      path.node.name = "x";
    }
  }
});

console.log(compast(ast, {
  parse: false,
  hide: ["directives", "generator", "async"]
}));

const output = generate(
  ast, { // See options https://babel.dev/docs/babel-generator#options
    retainLines: false, // Attempt to use the same line numbers in the output code as in the source code (helps preserve stack traces)
    compact: true, // Set to true to avoid adding whitespace for formatting
    concise: true, // Set to true to avoid adding whitespace for formatting
    quotes: "double",
  },
  code
);
console.log(output.code);


```
- This code uses the `@babel/traverse` package to traverse the AST and change all the `n` identifiers to `x`. 
- It then uses the `@babel/generator` package to generate the code from the modified AST. 
- The `compact-js-ast` package is used to print the AST in a more readable format.

Run it with:

`➜  babel-learning git:(main) ✗ node src/traverse/hello-babel-traverse.mjs`
```yml
type: "File"
program:
  type: "Program"
  body:
    - type: "FunctionDeclaration"
      id:
        type: "Identifier"
        name: "square"
      expression: false
      params:
        - type: "Identifier"
          name: "x"
      body:
        type: "BlockStatement"
        body:
          - type: "ReturnStatement"
            argument:
              type: "BinaryExpression"
              left:
                type: "Identifier"
                name: "x"
              operator: "*"
              right:
                type: "Identifier"
                name: "x"

function square(x){return x*x;}
```

## Second Example

At [src/traverse/example.mjs](src/traverse/example.mjs) is another example of using Babel traverse to analyze and transform JavaScript code. The transformation will:

- Add comments above function declarations
- Log information about different function types
- Convert arrow functions to regular function expressions

For the input:

```js 
function square(n) {
  return n * n;
}

const double = function(n) {
  return n + n;
}

const add = (a, b) => a + b;
```

produces:

```console
➜  babel-learning git:(main) ✗ node src/traverse/example.mjs
Found function declaration: square
Found function expression assigned to: double
Found arrow function assigned to: add
Found function expression assigned to: add

Transformed code:
// Function: square 
function square(n) {
  return n * n;
}
const double = function (n) {
  return n + n;
};
const add = function (a, b) {
  return a + b;
};
```
Here is the code:

```js 
import { parse } from '@babel/parser';
import _traverse from '@babel/traverse';
const traverse = _traverse.default;
import _generate from "@babel/generator";
const generate = _generate.default;
import * as t from '@babel/types';

// Sample code to transform
const code = `
function square(n) {
  return n * n;
}

const double = function(n) {
  return n + n;
}

const add = (a, b) => a + b;
`;

// Parse the code into an AST
const ast = parse(code, {
  sourceType: 'module',
});

// Use traverse to visit and modify nodes
traverse(ast, {
  // Visit function declarations
  FunctionDeclaration(path) {
    console.log(`Found function declaration: ${path.node.id.name}`);
    
    // Add a comment above the function
    path.addComment('leading', ` Function: ${path.node.id.name} `, true);
  },
  
  // Visit function expressions
  FunctionExpression(path) {
    const parentNode = path.parent;
    if (t.isVariableDeclarator(parentNode)) {
      console.log(`Found function expression assigned to: ${parentNode.id.name}`);
    }
  },
  
  // Visit arrow functions
  ArrowFunctionExpression(path) {
    const parentNode = path.parent;
    if (t.isVariableDeclarator(parentNode)) {
      console.log(`Found arrow function assigned to: ${parentNode.id.name}`);
      
      // Transform arrow function to regular function
      const arrowFunc = path.node;
      const regularFunc = t.functionExpression(
        null,
        arrowFunc.params,
        t.blockStatement([
          t.returnStatement(arrowFunc.body)
        ])
      );
      
      path.replaceWith(regularFunc);
    }
  }
});

// Generate code from the modified AST
const output = generate(ast, {}, code);

console.log('\nTransformed code:');
console.log(output.code);
```

## TOC

- [Learning Babel](/#learning-babel)
  - [Babel Configuration](/#babel-configuration)
  - [Babel Help](/#babel-help)
  - [Compile JavaScript with Babel](/#compile-javascript-with-babel)
    - [npx babel src/input.js --out-dir lib --presets=@babel/env](/#npx-babel-srcinputjs---out-dir-lib---presetsbabelenv)
    - [babel.transformSync](/#babeltransformsync)
  - [Babylon](/#babylon)
  - [Traversal](/#traversal)
  - [Writing my first Babel Plugin](/#writing-my-first-babel-plugin)
  - [Visiting the AST in a Babel Plugin](/#visiting-the-ast-in-a-babel-plugin)
  - [Manipulating the AST in a Babel Plugin](/#manipulating-the-ast-in-a-babel-plugin)
  - [Babel Template and Babel Types and Babel Generator](/#babel-template-and-babel-types-and-babel-generator)
  - [Scope](/#scope)
  - [Babel Handbook at jamiebuilds/babel-handbook](/#babel-handbook-at-jamiebuildsbabel-handbook)
    - [Babel Plugin Examples](/#babel-plugin-examples)
  - [The Babel Parser](/#the-babel-parser)
  - [Project "Creating custom JavaScript syntax with Babel"](/#project-creating-custom-javascript-syntax-with-babel)
  - [References](/#references)