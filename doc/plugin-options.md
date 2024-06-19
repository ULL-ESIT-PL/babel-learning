## Options and State in a Babel Plugin

In a Babel plugin, the `state` parameter is an object that is passed to visitor methods during the traversal of the Abstract Syntax Tree (AST). This `state` object is used to store and share information across different visitor methods and parts of the plugin. It can hold any kind of data that the plugin might need to maintain state across different nodes of the AST.

The example at [/src/state/hello-state-plugin.cjs](/src/state/hello-state-plugin.cjs) demonstrates how to use the `state` object to keep track of the number of times a specific identifier is used in the code. The plugin counts the occurrences of the target identifier and both logs a message at the end of the program with the total count and inserts the message at the end of the source code.

```js
module.exports = function (babel) {
  const { template, types: t } = babel;
  let sneak = template(`console.log("Identifier '"+VAR + "' was used " + COUNT + " times")`);

  return {
    name: "hello-state-plugin", 
    visitor: {
      Identifier(path, state) {
        if (path.node.name === state.opts.targetIdentifier) {
          state.identifierCount = state.identifierCount+1 || 1;
        }
      },
      Program: {
        exit(path, state) {
          path.node.body.push(
            sneak({ 
              VAR: t.StringLiteral(state.opts.targetIdentifier),
              COUNT: t.NumericLiteral(state.identifierCount || 0) 
            })
          );
          console.error(`Identifier "${state.opts.targetIdentifier}" was used ${state.identifierCount} times.`);
        }
      }
    }
  };
};
```

The `targetIdentifier` is passed as an option to the plugin:

`➜  state git:(main) ✗ cat babel.config.json`
```json
{
  "plugins": [["./hello-state-plugin.cjs", { "targetIdentifier": "myVar" }]]
}
```
Given the input code:

`➜  state git:(main) ✗ cat hello-state-input.js`
```js
function example() {
  var myVar = 1;
  myVar += 2;
  console.log(myVar);
}

example();
```

Here is the result of running the plugin:
```
➜  state git:(main) ✗ npx babel hello-state-input.js  --config-file ./babel.config.json       
Identifier "myVar" was used 3 times.
```
```js
function example() {
  var myVar = 1;
  myVar += 2;
  console.log(myVar);
}
example();
console.log("Identifier '" + "myVar" + "' was used " + 3 + " times");
```