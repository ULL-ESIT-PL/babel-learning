## Manipulating AST with JavaScript by Tan Liu Hau

Link: https://youtu.be/5z28bsbJJ3w?si=7UMZyXpNG5AdfWCE 

Disclaimer: This video was recorded in 2021. The information presented may no longer be accurate or up-to-date. Viewers are advised to verify any details or facts before making decisions based on the content.

### Tan Summary 

I'll show you around, how to use the ASTExplorer, how to quickly prototyping a Babel plugin within the ASTExplorer, and then use it within a script. Through this video, you'll be able to write a script to manipulate AST yourself.

### References: 

- ASTExplorer https://astexplorer.net/
- Babel https://babeljs.io/

### Timings

- 00:00 Intro
- 02:16 Prototyping using ASTExplorer
- 07:37 Exploring the AST
- 11:26 Writing the AST transformer
- 25:10 Setting up the codemod
- 38:40 Handling scope in the AST
- 57:37 Ending

## My Summary

### Tags

- initial-transform: section first step
- second-transform: See section second step


### First step: tag initial-transform

See tag `initial-transform`. Given the input and the initial transform code `example-transform.js`:

```js
// transform -> babel7: initial screen
module.exports = function (babel) {
  const { types: t } = babel;
  
  return {
    name: "ast-transform", // not required
    visitor: {
      Identifier(path) {
        path.node.name = path.node.name.split('').reverse().join('');
      }
    }
  };
}
```
When we execute it, we get:

```js
➜  manipulating-ast-with-js git:(main) npx babel example-input.js --plugins=./example-transform.js
// https://youtu.be/5z28bsbJJ3w?si=7UMZyXpNG5AdfWCE Manipulating AST with JavaScript by Tan Liu Hau
import { t } from 'i18n';
function ppA() {
  elosnoc.gol(t('label_hello'));
}
const rts = t('label_bye');
trela(rts);
```

### Second step: tag second-transform

Given the input and the second transform code `example-transform.js`:

```js
// transform -> babel7: initial screen
const translations = {
  "label_hello": "Hello world!",
  "label_bye": "Bye! Nice to meet you!",
};

module.exports = function (babel) {
  const { types: t } = babel;

  return {
    name: "second-transform", // not required
    visitor: {
      CallExpression(path) {
        let node = path.node;
        if (t.isIdentifier(node.callee, { name: "t" })) {
          if (t.isStringLiteral(node.arguments[0])) { // notice StringLiteral, not Literal
            const key = node.arguments[0].value;
            const value = translations[key];
            if (value) {
              console.error(node.callee.name, node.arguments[0].value);
              node.arguments[0] = t.stringLiteral(value);
            }
          }
        }
      },
    }
  }
};
```
Notice:

- We are using `t.isStringLiteral` instead of `t.isLiteral` because we are only interested in string literals. The node is still a `Literal` but we are checking if it is a `StringLiteral`.

- We are using `t.stringLiteral` to create a new `StringLiteral` node. `isStringLiteral` is a check, `stringLiteral` is a creator.

Here is a REPL session example:

```js
> const B = require("@babel/types")
undefined
> n = B.binaryExpression("*", B.identifier("a"), B.identifier("b"));
{
  type: 'BinaryExpression',
  operator: '*',
  left: { type: 'Identifier', name: 'a' },
  right: { type: 'Identifier', name: 'b' }
}
> B.isIdentifier(n.left)
true
```

- See https://babeljs.io/docs/babel-types/  and https://github.com/jamiebuilds/babel-handbook/blob/master/translations/en/plugin-handbook.md#builders for more information.

We can execute it using the `--plugins` option of `babel`:
  
  ```js
➜  manipulating-ast-with-js git:(main) ✗ npx babel example-input.js --plugins=./example-transform.js
t label_hello
t label_bye
// https://youtu.be/5z28bsbJJ3w?si=7UMZyXpNG5AdfWCE Manipulating AST with JavaScript by Tan Liu Hau
import { t } from 'i18n';
function App() {
  console.log(t("Hello world!"));
}
const str = t("Bye! Nice to meet you!");
alert(str);
```

or we can call the transform and the babel parser from our own code as in [src/manipulating-as-with-js/parsing-and-transform.jss](src/manipulating-as-with-js/parsing-and-transform.js).

```js
const transform = require('./example-transform');
const babel = require('@babel/core');
const fs = require('fs');
const path = require('path');
const code = fs.readFileSync(path.resolve(__dirname, 'example-input.js'), 'utf8');
const result = babel.transform(code, {
  plugins: [transform]
});
console.log(result.code);
```

which gives the same output as before.