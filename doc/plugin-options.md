# Plugin Options

If you would like to let your users customize the behavior of your Babel plugin
you can accept plugin specific options which users can specify like in the file [/src/state/babel.config2.json](/src/state/babel.config2.json):

`➜  state git:(main) ✗ cat babel.config2.json`
```js
{
  "plugins": [
    [
      "./hello-options-plugin.cjs",
      {
        "option1": true,
        "option2": false
      }
    ]
  ]
}
```

These options then get passed into a plugin like  the one at [/src/state/hello-options-plugin.cjs](/src/state/hello-options-plugin.cjs) 
using the `state` argument passed to the `visitor` methods:

```js
➜  state git:(main) ✗ cat hello-options-plugin.cjs 
module.exports = function({ types: t }) {
  return {
    visitor: {
      FunctionDeclaration(path, state) {
        console.log(state.opts);
        // { option1: true, option2: false }
      }
    }
  }
}
```

These options are plugin-specific and you cannot access options from other
plugins. **Curiously enough**, when you run the plugin redirecting the output to `/dev/null`
you can still see the options printed to the console:

```
➜  state git:(main) ✗ npx babel hello-state-input.js  --config-file ./babel.config2.json  -o /dev/null
{ option1: true, option2: false }
```

## Pre and Post in Plugins

Plugins can have functions that are run before or after plugins.
They can be used for setup or cleanup/analysis purposes. See example at 
[/src/state/hello-prepost-plugin.cjs](/src/state/hello-prepost-plugin.cjs):

`➜  state git:(main) ✗ cat hello-prepost-plugin.cjs`
```js
module.exports = function({ types: t }) {
  return {
    pre(state) {
      this.numbers = new Set();
    },
    visitor: {
      NumericLiteral(path) {
        this.numbers.add(path.node.value);
      }
    },
    post(state) {
      console.log(this.numbers);
    }
  };
}
```

When you run the plugin, you can see the set with the numbers in the input program 
printed to the console:

```
➜  state git:(main) ✗ npx babel hello-state-input.js --plugins=./hello-prepost-plugin.cjs --config-file ./babel.config3.json --env-name test3 -o /dev/null
Set(2) { 1, 2 }
```

The configuration file [/src/state/babel.config3.json](/src/state/babel.config3.json) has the environment `test3` with the plugin `hello-prepost-plugin.cjs`:

`➜  state git:(main) ✗ jq '.env.test3'  ./babel.config3.json`
```json
{
  "plugins": [
    [
      "./hello-prepost-plugin.cjs"
    ]
  ]
}
```

## <a id="toc-enabling-syntax-in-plugins"></a> Enabling Syntax in Plugins

Babel plugins themselves can enable [parser plugins](https://babeljs.io/docs/en/babel-parser#plugins) so that users don't need to
install/enable them. This prevents a parsing error without inheriting the syntax plugin.

```js
export default function({ types: t }) {
  return {
    inherits: require("babel-plugin-syntax-jsx")
  };
}
```

## <a id="toc-throwing-a-syntax-error"></a> Throwing a Syntax Error

If you want to throw an error with babel-code-frame and a message:

```js
export default function({ types: t }) {
  return {
    visitor: {
      StringLiteral(path) {
        throw path.buildCodeFrameError("Error message here");
      }
    }
  };
}
```

The error looks like:

```
file.js: Error message here
   7 |
   8 | let tips = [
>  9 |   "Click on any AST node with a '+' to expand it",
     |   ^
  10 |
  11 |   "Hovering over a node highlights the \
  12 |    corresponding part in the source code",
```

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

The `targetIdentifier` is passed as an option to the plugin in  the configuration file [/src/state/babel.config.json](/src/state/babel.config.json):

`➜  state git:(main) ✗ cat babel.config.json`
```json
{
  "plugins": [["./hello-state-plugin.cjs", { "targetIdentifier": "myVar" }]]
}
```
Given the input code at [/src/state/hello-state-input.js](/src/state/hello-state-input.js):

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

## Conditionally Disabling plugins 

See the configuration file [/src/state/babel.config3.json](/src/state/babel.config3.json) which has two environments `test1` and `test2` with different plugins:


`➜  state git:(main) cat babel.config3.json`
```json
{
  "env": {
    "test1": {
      "plugins": [
        ["./hello-options-plugin.cjs", { "option1": true, "option2": false }]
      ]
    },
    "test2": {
      "plugins": [
        ["./hello-state-plugin.cjs", { "targetIdentifier": "myVar" }]
      ]
    }
  }
}
```

Here are three executions, one with `test1`, one with `test2` and one without specifying an environment: 

```js
➜  state git:(main) npx babel hello-state-input.js  --config-file ./babel.config3.json  --env-name test1
{ option1: true, option2: false }
function example() {
  var myVar = 1;
  myVar += 2;
  console.log(myVar);
}
example();

➜  state git:(main) ✗ npx babel hello-state-input.js  --config-file ./babel.config3.json  --env-name test2
Identifier "myVar" was used 3 times.
function example() {
  var myVar = 1;
  myVar += 2;
  console.log(myVar);
}
example();
console.log("Identifier '" + "myVar" + "' was used " + 3 + " times");

➜  state git:(main) ✗ npx babel hello-state-input.js  --config-file ./babel.config3.json                  
function example() {
  var myVar = 1;
  myVar += 2;
  console.log(myVar);
}
example();
```