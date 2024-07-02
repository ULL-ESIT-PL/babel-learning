# Reproducing Nicolo Ribaudo  "@babel/how-to" talk at  HolyJS 2019

This chapter contains my attempt to reproduce and learn from Nicolo Ribaudo's talk at HolyJS 2019. 

## Optional Chaining Proposal obj?.prop

The target is to build a Babel plugin that transforms the optional chaining proposal `obj?.prop` (now a part of the JavaScript language) into a sequence of tests and assignments that check if the object and its properties are defined.

See folder
[src/nicolo-howto-talk/production-example](/src/nicolo-howto-talk/production-example/)
and the file
[/src/nicolo-howto-talk/production-example/README.md](/src/nicolo-howto-talk/production-example/README.md) for an input example and the output using the current production plugin (2024).

Nicolo starts using an editor that resembles asttree explorer, but it is not clear which one he is using. I will go with the [AST Explorer](https://astexplorer.net/).

In the returned object it introduces the [manipulateOptions](https://github.com/ULL-ESIT-PL/babel-learning/blob/main/doc/nicolo-howto-talk/README.md#references-to-manipulateoptions) method that is used to modify the behavior of the parser. A plugin could manipulate the parser options using  `manipulateOptions(opts, parserOpts)` and adding plugins to `parserOpts.plugins`. Unfortunately, parser plugins are not real plugins: they are just a way to enable syntax features already implemented in the Babel parser.

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
See section [optional-property.md](/doc/nicolo-howto-talk/optional-property.md) for a Explanation of the `optional` Property in an `OptionalMemberExpression` node in a Babel AST.

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

Notice that you write the code but are interpolating the `object` and `memberExp` variables which contain 
ASTs!


> ... But (the code `template.expression.ast`${object} == null? undefined : ${memberExp}``) it has 
> a few problems. Someone could write this in their code:
> ```js
> var undefined = 2;
> a == null ? undefined : a.b;
> ```
>

We have to cope with this kind of bad code and have access to the original `undefined`.
The expression `void 0` always returns `undefined` and we are going to use it instead. 

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
}```
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

## References

* Watch the talk in Youtube: https://youtu.be/UeVq_U5obnE?si=Vl_A49__5zgITvjx
* See the associated repo at GitHub: https://github.com/nicolo-ribaudo/conf-holyjs-moscow-2019, 
* [Nicolo slides](/pdfs/holyjs-2019-Nicolo_Ribaudo_babelhow-to.pdf)
* [22:07/59:40 Case Study: Optional Chaining Proposal](https://youtu.be/UeVq_U5obnE?t=1325)
* [The plugin babel-plugin-transform-optional-chaining](https://github.com/babel/babel/tree/main/packages/babel-plugin-transform-optional-chaining) at GitHub Babel repo and [the way it is used](https://babeljs.io/docs/babel-plugin-transform-optional-chaining)
* Web site of the HolyJS 2019 conference: https://holyjs.ru/en/archive/2019%20Moscow/


### References to manipulateOptions

* `manipulateOptions` is mentioned in https://babeljs.io/docs/v7-migration-api
  ```js
  export default function() {
   return {
     manipulateOptions(opts, parserOpts) {
       parserOpts.tokens = true;
     },
     ...
   };
  }
  ```
* Tan Li Hau in his article [Codemod with babel](https://lihautan.com/codemod-with-babel/) (2019) mentions the `manipulateOptions` method. He recommends this template to start a babel transformation:

  ```js
  const babel = require('@babel/core');
  const { promisify } = require('util');
  const { writeFile } = promisify(require('fs').writeFile);

  (async function() {
    const { code } = await babel.transformFileAsync(filename, {
      plugins: [
        function() {
          return {
            manipulateOptions(opts, parserOpts) {
              /*
              add to parserOpts.plugins to enable the syntax
              eg: 
                jsx, flow, typescript, objectRestSpread, pipelineOperator, 
                throwExpressions, optionalChaining, nullishCoalescingOperator, 
                exportDefaultFrom, dynamicImport, ...
              */
              parserOpts.plugins.push(
                'classProperties',
                'classPrivateProperties'
              );
            },
            visitor: {
              // fill in a transformer here
            },
          };
        },
      ],
    });
    await writeFile(filename, code, 'utf-8');
  })();
  ```
* [Transpile JSX using your own custom built babel plugin](https://dev.to/pulkitnagpal/transpile-jsx-using-your-own-custom-built-babel-plugin-4888)

  > ... When you try to parse this jsx using your local babel cli, you will get a syntax error. Because the parser does not know anything about the jsx syntax.
  > Thats why we need to add a file which manipulates the parser, name it as jsx-syntax-parser.js
  ```js
  module.exports = function () {
    return {
      manipulateOptions: function manipulateOptions(opts, parserOpts) {
        parserOpts.plugins.push("jsx");
      }
    };
  };
```