# Reproducing Nicolo Ribaudo  "@babel/how-to" talk at  HolyJS 2019

This chapter contains my attempt to reproduce and learn from[ Nicolo Ribaudo's talk at HolyJS 2019](https://youtu.be/UeVq_U5obnE?si=Vl_A49__5zgITvjx). 

## Optional Chaining Proposal obj?.prop

The target is to build a Babel plugin that transforms the optional chaining proposal `obj?.prop` (now a part of the JavaScript language) into a sequence of tests and assignments that check if the object and its properties are defined.

See folder
[src/nicolo-howto-talk/production-example](/src/nicolo-howto-talk/production-example/)
and the file
[/src/nicolo-howto-talk/production-example/README.md](/src/nicolo-howto-talk/production-example/README.md) for an input example and the output using the current production plugin (2024).

[Nicolo starts using an editor](https://youtu.be/UeVq_U5obnE?si=Vl_A49__5zgITvjx) that resembles https://astexplorer.net, but it is not clear which one he is using. I will initially go with the [AST Explorer](https://astexplorer.net/) and later with VSCode (see folder [/src/nicolo-howto-talk](/src/nicolo-howto-talk)).

## manipulateOptions: sending options to the parser

In the returned object it introduces the [manipulateOptions](/doc/nicolo-howto-talk/manipulate-options.md) method that is used to modify the behavior of the parser. A plugin could manipulate the parser options using  `manipulateOptions(opts, parserOpts)` and adding plugins to `parserOpts.plugins`. Unfortunately, parser plugins are not real plugins: [they are just a way to enable syntax features already implemented in the Babel parser](/doc/parser/optional-chaining-in-the-parser.md). It is almost impossible to
create a JavaScript parser that adheres to the Open-Closed Principle.

At [26:44](https://youtu.be/UeVq_U5obnE) Nicolo has this preliminary code for the plugin:

```js
module.exports = function myPlugin({types: t, template}, options) {
  return {
    name: "optional-chaining-plugin",
    manipulateOptions(opts) {
      opts.parserOpts.plugins.push("OptionalChaining")
    },
    visitor: {
      OptionalMemberExpression(path) {
      } 
    }
  }
}
```

At this point we need to review the properties of an `OptionalMemberExpression` node: `object`, `property`, `computed` and  `optional`.

## Differences between Babel and Espree ASTs with Optional Chaining

See section [optional-property.md](/doc/nicolo-howto-talk/optional-property.md) for a Explanation of the `optional` Property in an `OptionalMemberExpression` node in a Babel AST. In section [optional-chain.md](/doc/nicolo-howto-talk/optional-chain.md) we compare the Babel and Espree ASTs for `obj?.foo.bar`.

## template.expression.ast 

At minute [29:40](https://youtu.be/UeVq_U5obnE?t=1775) he has filled the `OptionalMemberExpression` visitor with the following code:


```js
module.exports = function myPlugin({types: t, template}, options) {
  return {
    name: "optional-chaining-plugin",
    manipulateOptions(opts) {
      opts.parserOpts.plugins.push("OptionalChaining")
    },
    visitor: {
      OptionalMemberExpression(path) {
        let { object, property} = path.node;
        let memberExp = t.memberExpression(object, property);
        path.replaceWith(
          template.expression.ast`${object} == null? undefined : ${memberExp}`
        )
      } 
    }
  }
}
```
that for an input like `obj?.foo` will produce the output:

```js
obj == null ? undefined : obj.foo;
```

The `template.expression`, `template.statements`, are variants of the 
[`template` function](https://babeljs.io/docs/babel-template). 
By default `@babel/template` returns a function which is invoked with an optional object of replacements, but when using `.ast` as in this example, the AST is returned directly.

**Notice that you write the code but are interpolating the `object` and `memberExp` variables which contain 
ASTs using ordinary JS backquotes!** 


## The `undefined` problem

> ... But (the code `template.expression.ast`${object} == null? undefined : ${memberExp}``) it has 
> a few problems. Someone could write this in their code:
>

`➜  nicolo-howto-talk git:(main) ✗ cat redefine-undefined.cjs`
```js
var undefined = 42;
console.log(undefined); // 42                                                                                                                     
➜  nicolo-howto-talk git:(main) ✗ node redefine-undefined.cjs 
42
```

We have to cope with this kind of bad code and have access to the original `undefined`.
The expression [void 0](/doc/nicolo-howto-talk/void.md) always returns `undefined` and we are going to use it instead. 
Let us switch from [astexplorer](https://astexplorer.net/#/gist/e48001e11fe9ad94b5e90a24bb4c4340/b51a7d45d97647ea9580c04de28dc08583806aa4) to VSCode:

`➜  nicolo-howto-talk git:(main) cat `[input.js](/src/nicolo-howto-talk/input.js)
```js
a?.b
```
`➜  nicolo-howto-talk git:(main) cat babel.config.json`
```json
{
  "plugins": [
    "./optionalchaining-plugin.cjs"
  ]
}
```
`➜  nicolo-howto-talk git:(main) cat `[optionalchaining-plugin.cjs](/src/nicolo-howto-talk/optionalchaining-plugin.cjs)
```js
module.exports = function myPlugin(babel, options) {
  const {types: t, template } = babel;
  return {
    name: "optional-chaining-plugin",
    manipulateOptions(opts) {
      opts.parserOpts.plugins.push("OptionalChaining")
    },
    visitor: {
      OptionalMemberExpression(path) {
        let { object, property} = path.node;
        let memberExp = t.memberExpression(object, property);
        let undef = path.scope.buildUndefinedNode();
        path.replaceWith(
          template.expression.ast`
             ${object} == null? ${undef} :
             ${memberExp}
          `
        )
      } 
    }
  }
}
```

## Computed properties 

At minute [31.14](https://youtu.be/UeVq_U5obnE?t=1867) Nicolo considers the more general case of accessing a computed property like in:

`➜  nicolo-howto-talk git:(main) ✗ cat input-array.js`
```js 
a?.[0]
```
When we feed this input to the plugin we get the output:

```
➜  nicolo-howto-talk git:(main) ✗ npx babel input-array.js
TypeError: /Users/casianorodriguezleon/campus-virtual/2324/learning/babel-learning/src/nicolo-howto-talk/input-array.js:
Property property of MemberExpression expected node to be 
of a type ["Identifier","PrivateName"] but instead got "NumericLiteral"
```
This is because the `property` of the `OptionalMemberExpression` is in this case a `NumericLiteral`:

`➜  nicolo-howto-talk git:(main) compast -blp 'a?.[0]' | yq '.program.body[0]'`
```json 
{
  "type": "ExpressionStatement",
  "expression": {
    "type": "OptionalMemberExpression",
    "object": {
      "type": "Identifier",
      "name": "a"
    },
    "computed": true,
    "property": {
      "type": "NumericLiteral",
      "extra": {
        "rawValue": 0,
        "raw": "0"
      },
      "value": 0
    },
    "optional": true
  }
}
```
The error is caused due to the fact that by default value for `MemberExpression`s the `computed` property is `false`
and since in the previous code we haven't specified it, it is assumed to be `false`. The consequence being that the `property` 
is expected to be an `Identifier` or a [PrivateName](privatename.md) and not a `NumericLiteral`. 

To avoid the error we take the `computed` property of the node and pass it to the `t.memberExpression` we build
for the replacement:

`➜  babel-learning git:(main) ✗ cat src/nicolo-howto-talk/optionalchaining-plugin.cjs`
```js
//const generate = require('@babel/generator').default;
module.exports = function myPlugin(babel, options) {
  const {types: t, template } = babel;
  return {
    name: "optional-chaining-plugin",
    manipulateOptions(opts) {
      opts.parserOpts.plugins.push("OptionalChaining")
    },
    visitor: {
      OptionalMemberExpression(path) {
        let { object, propert, computed} = path.node;
        let memberExp = t.memberExpression(object, property, computed);
        let undef = path.scope.buildUndefinedNode();
        path.replaceWith(
          template.expression.ast`
             ${object} == null? ${undef} :
             ${memberExp}
          `
        )
      } 
    }
  }
}
```
Now the plugin works for both cases `a?.b` and `a?.[0]`:

`➜  babel-learning git:(31m14s) npx babel src/nicolo-howto-talk/input-array.js --plugins=./src/nicolo-howto-talk/`
```js
optionalchaining-plugin.cjs


"use strict";

a == null ? void 0 : a[0];
```

## Be sure `undefined`  is `undefined`

A source of errors is that `undefined` can be redefined. Here is an example:

`➜  babel-learning git:(main) cat src/nicolo-howto-talk/redefine-undefined.cjs`
```js
var undefined = 42;
console.log(undefined); // 42
```
```sh
➜  babel-learning git:(main) node src/nicolo-howto-talk/redefine-undefined.cjs 
42
```

At minute [29:47](https://youtu.be/UeVq_U5obnE?t=1785) Nicolo uses `path.scope.buildUndefined()`to produce `void 0` to ensure that `undefined` is `undefined`:

```js
➜  babel-learning git:(main) cat src/nicolo-howto-talk/optionalchaining-plugin.cjs 
//const generate = require('@babel/generator').default;
module.exports = function myPlugin(babel, options) {
  const {types: t, template } = babel;
  return {
    name: "optional-chaining-plugin",
    manipulateOptions(opts) {
      opts.parserOpts.plugins.push("OptionalChaining")
    },
    visitor: {
      OptionalMemberExpression(path) {
        let { object, propert, computed} = path.node;
        let memberExp = t.memberExpression(object, property, computed);
        let undef = path.scope.buildUndefinedNode(); // Create a "void 0" nodes
        path.replaceWith(
          template.expression.ast`
             ${object} == null? ${undef} : // Use the "void 0" node
             ${memberExp}
          `
        )
      } 
    }
  }
}
```
When we execute it we get:

`➜  babel-learning git:(main) npx babel src/nicolo-howto-talk/input-array.js`
```js
"use strict";

var _a;
(_a = a) === null || _a === void 0 ? void 0 : _a[0];
```
`➜  babel-learning git:(main) npx babel src/nicolo-howto-talk/input.js`
```js
"use strict";

var _a;
(_a = a) === null || _a === void 0 ? void 0 : _a.b;
```

## References

* Watch the talk in Youtube: https://youtu.be/UeVq_U5obnE?si=Vl_A49__5zgITvjx
  * [22:07/59:40 Case Study: Optional Chaining Proposal](https://youtu.be/UeVq_U5obnE?t=1325)
* See the associated repo at GitHub: https://github.com/nicolo-ribaudo/conf-holyjs-moscow-2019, 
* [Nicolo slides](/pdfs/holyjs-2019-Nicolo_Ribaudo_babelhow-to.pdf)
* [The plugin babel-plugin-transform-optional-chaining](https://github.com/babel/babel/tree/main/packages/babel-plugin-transform-optional-chaining) at GitHub Babel repo and [the way it is used](https://babeljs.io/docs/babel-plugin-transform-optional-chaining)
* Web site of the HolyJS 2019 conference: https://holyjs.ru/en/archive/2019%20Moscow/


