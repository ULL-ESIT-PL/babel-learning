# manipulateOptions

In the package `@babel/core`, the `manipulateOptions` methods of all the plugins are used to manipulate the options.
Inside the [src/transformation/normalize-opts.js](https://github.com/ULL-ESIT-PL/babel-tanhauhau/blob/master/packages/babel-core/src/transformation/normalize-opts.js#L61-L67) file  of the `@babel/core`package we can see this hook code:

```js
// @flow

import path from "path";
import type { ResolvedConfig } from "../config";

export default function normalizeOptions(config: ResolvedConfig): {} {
  const { ... } = config.options;

  const opts = config.options;

  const options = { ... },

  for (const plugins of config.passes) {
    for (const plugin of plugins) {
      if (plugin.manipulateOptions) {
        plugin.manipulateOptions(options, options.parserOpts);
      }
    }
  }

  return options;
}
```

The `manipulateOptions` plugin methods are called before the parser is initialized and can be used to modify the parser options.


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