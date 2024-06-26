# Manipulating AST with JavaScript by Tan Liu Hau

## Tan Li Hau Summary
Link: https://youtu.be/5z28bsbJJ3w?si=7UMZyXpNG5AdfWCE 

Disclaimer: This video was recorded in 2021. The information presented may no longer be accurate or up-to-date. Viewers are advised to verify any details or facts before making decisions based on the content.

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


## Tags

Git Tags:

- initial-transform: section first step
- second-transform: See section second step


## First step: tag initial-transform

See tag `initial-transform` in this repo https://github.com/ULL-ESIT-PL/babel-learning. 

Given the [/src/manipulating-ast-with-js/example-input.js](/src/manipulating-ast-with-js/example-input.js) 

```js
// https://youtu.be/5z28bsbJJ3w?si=7UMZyXpNG5AdfWCE Manipulating AST with JavaScript by Tan Liu Hau
import { t } from 'i18n';

function App() {
  console.log(t('label_hello'));
}

const str = t('label_bye');
alert(str);
```

and the initial transform code [example-transform.js](/src/manipulating-ast-with-js/example-transform.js):

`/src/manipulating-ast-with-js/example-transform.js`
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
// https://youtu.be/5z28bsbJJ3w?si=7UMZyXpNG5AdfWCE Manipulating AST with JavaScript by Tan Li Hau
import { t } from 'i18n';
function ppA() {
  elosnoc.gol(t('label_hello'));
}
const rts = t('label_bye');
trela(rts);
```

## Second step: tag second-transform

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
// https://youtu.be/5z28bsbJJ3w?si=7UMZyXpNG5AdfWCE Manipulating AST with JavaScript by Tan Li Hau
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
const result = babel.transform(code, { // See https://babeljs.io/docs/babel-core#transform
  plugins: [transform]
});
console.log(result.code);
```

which gives the same output as before.


## Babel Templates

At 29:25 we can see a call to `babel.template` but it is not explained and it does not work with the current version I'm working with.

The `babel.template` function is  in the `@babel/template` package. 
You build the template with a string 
```js
let buildRequire = template(`
  var %%importName%% = require(%%source%%);
`);
```
and then you call it with an object that has the placeholders wich are trees.
```js
let ast = buildRequire({
  importName: t.identifier("myModule"),
  source: t.stringLiteral("my-module"),
});
```

Here is the full example:

```js
const template = require("@babel/template").default;
const generate =  require("@babel/generator").default;
const t =  require("@babel/types");

let buildRequire = template(`
  var %%importName%% = require(%%source%%);
`);

let ast = buildRequire({
  importName: t.identifier("myModule"),
  source: t.stringLiteral("my-module"),
});

console.log("syntactic placeholders: ", generate(ast).code);

buildRequire = template(`
  var IMPORT_NAME = require(SOURCE);
`);

ast = buildRequire({
  IMPORT_NAME: t.identifier("myModule"),
  SOURCE: t.stringLiteral("my-module"),
});

console.log("identifier placeholders: ",generate(ast).code);
```

The output is:

```js
➜  manipulating-ast-with-js git:(main) ✗ node babel-template-example.js 
syntactic placeholders:  var myModule = require("my-module");
identifier placeholders:  var myModule = require("my-module");
```

*I found that to generate a AST, a babel template is often simpler than 
to build it with the constructors (since they are much harder work) 
and also than to use the `parse` function (since the produced AST
contains excessive information)*.

## replaceWith

I have lots of trouble with `replaceWith` as used in minute 29. Example
[src/manipulating-ast-with-js/parse-transform-generate.js](src/manipulating-ast-with-js/parse-transform-generate.js)
shows how to use `replaceWith` to replace a node with another node.

```js
const traverse = require("@babel/traverse").default;
const template = require("@babel/template").default;
const parser = require('@babel/parser');
const t = require('@babel/types');
const generate = require('@babel/generator').default;
const fs = require('fs');
const path = require('path');
const code = fs.readFileSync(path.resolve(__dirname, 'example-input.js'), 'utf8');

const ast = parser.parse(code, {
  sourceType: 'module',
  //tokens: true, 
});
//console.log(ast.tokens[0]); // CommentLine

const translations = {
  "label_hello": "Hello world!",
  "label_bye": "Bye! Nice to meet you!",
};
const labels = Object.keys(translations);

traverse(ast, {
  CallExpression(path) {
    let node = path.node;
    let callee = node.callee.name;
    let arg = node.arguments[0];
    if (callee == "t" &&
      arg.type == "StringLiteral" &&
      labels.includes(arg.value)) {
      path.replaceWith(t.stringLiteral(translations[arg.value]));
    }
  }
});

//console.log(JSON.stringify(ast, null, 2))
const result = generate(ast);
console.log(result.code);
```

the `replaceWith` seems in this case to be equivalent to:

```js
node.type = "StringLiteral"; 
node.value = translations[node.arguments[0].value]; 
delete node.arguments; delete node.callee;
```

## replaceWithMultiple

There is also a `replaceWithMultiple` that replaces a node with multiple nodes.
The method `path.replaceWithMultiple` should be used when the parent node of the path expects multiple child nodes. It is generally used in contexts where multiple statements or expressions can exist, such as within a block statement, program body, or an array. The example [/src/manipulating-ast-with-js/replace-multiple.js](src/manipulating-ast-with-js/replace-multiple.js) shows how to use it. The example shows also how
to visit multiple node types by separating their types with a `|`:

```js
const traverse = require("@babel/traverse").default;
const template = require("@babel/template").default;
const parser = require('@babel/parser');
const t = require('@babel/types');
const generate = require('@babel/generator').default;
const fs = require('fs');
const path = require('path');
const code = fs.readFileSync(path.resolve(__dirname, 'example-input.js'), 'utf8');

const ast = parser.parse(code, {
  sourceType: 'module',
  //tokens: true, 
});
//console.log(ast.tokens[0]); // CommentLine

let buildCons = template(`console.log("hello world");`);

traverse(ast, {
  "ImportDeclaration|FunctionDeclaration|VariableDeclaration"(path) {
    let node = path.node;
    path.replaceWithMultiple([node, buildCons()]); 
  }
});

//console.log(JSON.stringify(ast, null, 2));
const result = generate(ast);
console.log(result.code);

```

Here is the output:

```js
➜  manipulating-ast-with-js git:(main) ✗ node replace-multiple.js
// https://youtu.be/5z28bsbJJ3w?si=7UMZyXpNG5AdfWCE Manipulating AST with JavaScript by Tan Li Hau
import { t } from 'i18n';
console.log("hello world");
function App() {
  console.log(t('label_hello'));
}
console.log("hello world");
const str = t('label_bye');
console.log("hello world");
alert(str);
```

## babel.transform: Transforming the code without calling babel from the command line

The method `babel.transform` can be used to transform the code without calling babel from the command line. The example [/src/manipulating-ast-with-js/parsing-and-transform.js](/src/manipulating-ast-with-js/parsing-and-transform.js) shows how: 

```js
➜  manipulating-ast-with-js git:(main) ✗ cat parsing-and-transform.js 
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

We can also use the method `babel.transformSync` and `babel.transformAsync` and the methods `babel.transformFile` to transform the code in a file

```js
➜  manipulating-ast-with-js git:(main) ✗ cat parsing-and-transformfile.js 
const transform = require('./example-transform');
const babel = require('@babel/core');
const fs = require('fs');
const path = require('path');
const result = babel.transformFileSync(path.resolve(__dirname, 'example-input.js'), {
  plugins: [transform]
});
console.log(result.code);
```


## Scope

See 

- Section [/doc/scope.md](/doc/scope.md).
- Tan starts to talk about scope at [38:40](https://www.youtube.com/watch?v=5z28bsbJJ3w&list=PLoKaNN3BjQX0fEhzfpU9xHNWdxhIkP-hy&index=1&t=2320s)
- See also the question at Stack StackOverflow [How do I traverse the scope of a Path in a babel plugin](https://stackoverflow.com/questions/44309639/how-do-i-traverse-the-scope-of-a-path-in-a-babel-plugin)
