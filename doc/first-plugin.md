# Writing your first Babel Plugin

Let's tie it together with the plugin API.

Start off with a `function` that gets passed the current `babel` object.

```js
export default function(babel) {
  // plugin contents
}
```

Since you'll be using it so often, you'll likely want to grab just `babel.types`
like so:

```js
export default function({ types: t }) {
  // plugin contents
}
```

Then you return an object with a property `visitor` which is the primary visitor
for the plugin.

```js
export default function({ types: t }) {
  return {
    visitor: {
      // visitor contents
    }
  };
};
```

Let's write a quick plugin to show off how it works. Here's our source code:

```js
foo === bar;
```

Or in AST form:

```js
{
  type: "BinaryExpression",
  operator: "===",
  left: {
    type: "Identifier",
    name: "foo"
  },
  right: {
    type: "Identifier",
    name: "bar"
  }
}
```

We'll start off by adding a `BinaryExpression` visitor method.

```js
export default function({ types: t }) {
  return {
    visitor: {
      BinaryExpression(path) {
        // ...
      }
    }
  };
}
```

Then let's narrow it down to just `BinaryExpression`s that are using the `===`
operator.

```js
visitor: {
  BinaryExpression(path) {
    if (path.node.operator !== "===") {
      return;
    }

    // ...
  }
}
```

Now let's replace the `left` property with a new identifier:

```js
BinaryExpression(path) {
  if (path.node.operator !== "===") {
    return;
  }

  path.node.left = t.identifier("sebmck");
  // ...
}
```

Already if we run this plugin we would get:

```js
sebmck === bar;
```

Now let's just replace the `right` property.

```js
BinaryExpression(path) {
  if (path.node.operator !== "===") {
    return;
  }

  path.node.left = t.identifier("sebmck");
  path.node.right = t.identifier("dork");
}
```

## Running the plugin

See the final code at [src/first-plugin.mjs](/src/first-plugin.mjs).

```js
export default function({ types: t }) {
  return {
    visitor: {
      BinaryExpression(path) {
        if (path.node.operator !== "===") {
          return;
        }
        path.node.left = t.identifier("sebmck");
        path.node.right = t.identifier("dork");
      }
    }
  };
};
```

To run it simply use the `--plugins` flag with `npx babel` like so:

```sh
➜  babel-learning git:(main) ✗ npx babel src/foo.js --plugins=./src/first-plugin.mjs
"use strict";

sebmck === dork;
```

Awesome! Our very first Babel plugin.

## Plugin: Reverse identifiers

See the example [src/hello-plugin.mjs](/src/hello-plugin.mjs).

```js
export default function() {
  return {
    visitor: {
      Identifier(path) {
        const name = path.node.name;
        path.node.name = name
          .split("")
          .reverse()
          .join("");
      },
    },
  };
}
```
that reverses the name of all identifiers:

```sh
➜  babel-learning git:(main) ✗ npx babel src/foo.js --plugins=./src/hello-plugin.mjs
"use strict";

oof === rab;
```

Since we can't have two times the same plugin in the `--plugins` array, let's copy the plugin and run the transformation twice:

```
➜  babel-learning git:(main) ✗ cp src/hello-plugin.mjs src/second-plugin.mjs 
➜  babel-learning git:(main) ✗ npx babel src/foo.js --plugins=./src/hello-plugin.mjs,./src/second-plugin.mjs
"use strict";

foo === bar;
```

We see that we get back the original identifier names.