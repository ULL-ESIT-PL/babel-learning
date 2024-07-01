# Reproducing Nicolo Ribaudo  "@babel/how-to" talk at  HolyJS 2019

This chapter contains my attempt to reproduce and learn from Nicolo Ribaudo's talk at HolyJS 2019. 

## Optional Chaining Proposal obj?.prop

The target is to build a Babel plugin that transforms the optional chaining proposal `obj?.prop` (now a part of the JavaScript language) into a sequence of tests and assignments that check if the object and its properties are defined.

See [/src/nicolo-howto-talk/production-example/README.md](/src/nicolo-howto-talk/production-example/README.md) for an input example and the output of the current production plugin.


Nicolo starts using an editor that resembles asttree explorer, but it is not clear which one he is using. I will go with the [AST Explorer](https://astexplorer.net/).

In the returned object it introduces the `manipulateOptions` method that is used to modify the behavior of the parser. A plugin could manipulate Babel options by `manipulateOptions()`

https://babeljs.io/docs/v7-migration-api

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

  > When you try to parse this jsx using your local babel cli, you will get a syntax error. Because the parser does not know anything about the jsx syntax.
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