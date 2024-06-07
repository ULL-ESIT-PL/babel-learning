# Manipulation

See section in file [//doc/tan-liu-article.md](//doc/tan-liu-article.md) describing my experience reproducing [Tan Li Hau lessons in youtube video "Manipulating AST with JavaScript"](https://youtu.be/5z28bsbJJ3w?si=-65NxcFhTM8wpGLX).

Many of the examples here are explained in the video [Q&A Is there other ways to manipulate ast nodes besides replaceWith?](https://youtu.be/ouXuJAzcyHo?si=85hlkM_DDzpBfYw3) by Tan Li Hau (陈立豪) (2021). Do not miss it.

## Replacing a node

`➜  babel-learning git:(main) ✗ cat src/manipulation/replacewith-plugin.cjs`
```js
module.exports = function (babel) {
  const { types: t } = babel;

  return {
    name: "ast-transform", // not required
    visitor: {
      BinaryExpression(path) {
        const { node } = path;
        if (node.operator == "*" && node.left.name == node.right.name) {
          path.replaceWith(t.binaryExpression("**", path.node.left, t.numericLiteral(2)));
          path.stop;
        }
      }
    }
  };
}
```

Here is the execution:

`babel-learning git:(main) ✗ cat src/manipulation/square.js`
```js
let square = n => n * n
```
`➜  babel-learning git:(main) ✗ npx babel src/manipulation/square.js --plugins=./src/manipulation/replacewith-plugin.cjs`
```js
"use strict";

let square = n => n ** 2;
```

See section
[/src/manipulating-ast-with-js/README.md](/src/manipulating-ast-with-js/README.md#replacewith)
for a complete example.

### Returned value

When you call `path.replaceWith`, you replace the node at the current path with a new node. This method returns an **array** of `NodePath` objects representing the paths of the newly inserted nodes.

## Replacing a node with multiple nodes

The following plugin replaces the `return` statement with two statements: a `let` statement and a `return` statement.

`➜  babel-learning git:(main) cat src/manipulation/replacewithmultiple-plugin.cjs`
```js
module.exports = function (babel) {
  return {
    name: "ast-transform2", // not required
    visitor: {
      ReturnStatement(path) {
        if (path.node.argument.type == "BinaryExpression" && path.node.argument.left.name  == "n") {
          path.replaceWithMultiple([
            babel.template(`let a = N`)({N: path.node.argument.left }),
            babel.template(`return 4*a`)()
          ])
        }
      }
    }
  };
}
```

When executed with input:

```js
➜  babel-learning git:(main) cat src/manipulation/square2.js
let square = n => { return n * n; }
```

We get:

`➜  babel-learning git:(main) npx babel src/manipulation/square2.js --plugins=./src/manipulation/replacewithmultiple-plugin.cjs`
```js
"use strict";

let square = n => {
  let a = n;
  return 4 * a;
};
```


> **Note:** When replacing an expression with multiple nodes, they must be
> statements. This is because Babel uses heuristics extensively when replacing
> nodes which means that you can do some pretty crazy transformations that would
> be extremely verbose otherwise.

See section `replacewithmultiple`at file [/src/manipulating-ast-with-js/README.md](/src/manipulating-ast-with-js/README.md#replacewithmultiple)


## Replacing a node with a source string

```js
FunctionDeclaration(path) {
  path.replaceWithSourceString(`function add(a, b) {
    return a + b;
  }`);
}
```

```diff
- function square(n) {
-   return n * n;
+ function add(a, b) {
+   return a + b;
  }
```

> **Note:** It's not recommended to use this API unless you're dealing with
> dynamic source strings, otherwise it's more efficient to parse the code
> outside of the visitor.

## Inserting a sibling node

```js
FunctionDeclaration(path) {
  path.insertBefore(t.expressionStatement(t.stringLiteral("Because I'm easy come, easy go.")));
  path.insertAfter(t.expressionStatement(t.stringLiteral("A little high, little low.")));
}
```

```diff
+ "Because I'm easy come, easy go.";
  function square(n) {
    return n * n;
  }
+ "A little high, little low.";
```

> **Note:** This should always be a statement or an array of statements. This
> uses the same heuristics mentioned in
> [Replacing a node with multiple nodes](#replacing-a-node-with-multiple-nodes).

## Inserting into a container

If you want to insert into an AST node that is an array like `body`.
Similar to `insertBefore`/`insertAfter`, except that you have to specify the `listKey`, which is usually `body`.

```js
ClassMethod(path) {
  path.get('body').unshiftContainer('body', t.expressionStatement(t.stringLiteral('before')));
  path.get('body').pushContainer('body', t.expressionStatement(t.stringLiteral('after')));
}
```

```diff
 class A {
  constructor() {
+   "before"
    var a = 'middle';
+   "after"
  }
 }
```

## Removing a node

```js
FunctionDeclaration(path) {
  path.remove();
}
```

```diff
- function square(n) {
-   return n * n;
- }
```

## Replacing a parent

Just call `replaceWith` with the parentPath: `path.parentPath`

```js
BinaryExpression(path) {
  path.parentPath.replaceWith(
    t.expressionStatement(t.stringLiteral("Anyway the wind blows, doesn't really matter to me, to me."))
  );
}
```

```diff
  function square(n) {
-   return n * n;
+   "Anyway the wind blows, doesn't really matter to me, to me.";
  }
```

## Removing a parent

```js
BinaryExpression(path) {
  path.parentPath.remove();
}
```

```diff
  function square(n) {
-   return n * n;
  }
```

## What are the differences between function declaration and function expressions?

### t.toExpression

In the Babel AST (Abstract Syntax Tree), expressions are nodes that represent values and can appear on the right-hand side of an assignment, as arguments to functions, and in various other places. 

The `toExpression` method in the `@babel/types` package is used to convert a given AST node into an expression if it is not already one. This can be particularly useful when working with Babel transformations where you need to ensure that a node conforms to the syntax rules that expect expressions.

Here is an example of how to use the `toExpression` method in a Babel plugin:

`➜  manipulation git:(main) ✗ cat fun-declaration-to-expression-plugin.cjs`
```js
module.exports = function(babel) {
  const { types: t } = babel;

  return {
    name: "learning-toExpression", // nombre del plugin
    visitor: {
      FunctionDeclaration(path) {
        let node = path.node;
        let name = node.id.name;
        node.id = null;
        let r = path.replaceWith(
          t.assignmentExpression(
            "=",
            t.identifier(name),
            t.toExpression(node)
          ))
          idPath = null;
        //console.log(r[0].node.left.name); 
      } 
    }
  }
};
```

Given the input program:

```js
➜  manipulation git:(main) ✗ cat a-function-declaration.js 
function foo() {}
```                                                                                                           

When we use the former plugin we get:

`➜  manipulation git:(main) ✗ npx babel  a-function-declaration.js --plugins=./fun-declaration-to-expression-plugin.cjs`
```js
foo = function () {};
```

See

- Tan Li Hau's video [What are the differences between function declaration and function expressions?](https://youtu.be/UNGvM9KFhvc?si=CSxumS57Hh9ORSLF)
- Gist [Hopefully will be documentation of unclear methods available for Babel Types](https://gist.github.com/joshblack/5f2bf75038e23fdf80ac) where the following `toMethods` appear:
  - toComputedKey
  - toSequenceExpression
  - toKeyAlias
  - toIdentifier
  - toBindingIdentifierName
  - toStatement
  - toExpression
  - toBlock
