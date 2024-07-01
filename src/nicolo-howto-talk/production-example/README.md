## Example of Execution of the production plugin

### babel.config.json

`➜  babel-learning git:(main) cat src/nicolo-howto-talk/production-example/babel.config.json`
```json
{
  "plugins": ["@babel/plugin-transform-optional-chaining"]
}
```

### Input optional-chaining-input.js

`➜  production-example git:(main) ✗ cat optional-chaining-input.js`
```js
const obj = {
  foo: {
    bar: {
      baz: 42,
    },
  },
};

const baz = obj?.foo?.bar?.baz; // 42

const safe = obj?.qux?.baz; // undefined

// Optional chaining and normal chaining can be intermixed
obj?.foo.bar?.baz; // Only access `foo` if `obj` exists, and `baz` if
// `bar` exists

// Example usage with bracket notation:
obj?.["foo"]?.bar?.baz; // 42
```

### Output of the production plugin

Notice the declaration of auxiliar variables `_obj$foo`, `_obj$qux`, `_obj$foo$bar`, `_obj$foo2` in the output.

`➜  production-example git:(main) ✗ npx babel optional-chaining-input.js`
```js
var _obj$foo, _obj$qux, _obj$foo$bar, _obj$foo2;
const obj = {
  foo: {
    bar: {
      baz: 42
    }
  }
};
const baz = obj === null || obj === void 0 || (_obj$foo = obj.foo) === null || _obj$foo === void 0 || (_obj$foo = _obj$foo.bar) === null || _obj$foo === void 0 ? void 0 : _obj$foo.baz; // 42

const safe = obj === null || obj === void 0 || (_obj$qux = obj.qux) === null || _obj$qux === void 0 ? void 0 : _obj$qux.baz; // undefined

// Optional chaining and normal chaining can be intermixed
obj === null || obj === void 0 || (_obj$foo$bar = obj.foo.bar) === null || _obj$foo$bar === void 0 || _obj$foo$bar.baz; // Only access `foo` if `obj` exists, and `baz` if
// `bar` exists

// Example usage with bracket notation:
obj === null || obj === void 0 || (_obj$foo2 = obj["foo"]) === null || _obj$foo2 === void 0 || (_obj$foo2 = _obj$foo2.bar) === null || _obj$foo2 === void 0 ? void 0 : _obj$foo2.baz; // 42
```

Then notice the translation of:

```js
const baz = obj?.foo?.bar?.baz; // 42
```

onto 

```js
const baz = obj === null                       ||  // check for null
            obj === void 0                     ||  // check for "safe" undefined
            (_obj$foo = obj.foo) === null      ||  // check for obj.foo null and assign to _obj$foo
            _obj$foo === void 0                ||  // check for obj.foo undefined
            (_obj$foo = _obj$foo.bar) === null ||  // check for obj.foo.bar null and assign to _obj$foo
            _obj$foo === void 0 ? void 0       :   // check for obj.foo.bar undefined
                            _obj$foo.baz;          // 42
```

You can also run it with: `npx babel --plugins @babel/plugin-transform-optional-chaining script.js`

You can also test this example using the [Babel repl](https://babeljs.io/repl) playground

[![Babel repl](/images/babel-repl-optional-chaining-example.png)](https://babeljs.io/repl#?browsers=defaults%2C%20not%20ie%2011%2C%20not%20ie_mob%2011&build=&builtIns=false&corejs=3.21&spec=false&loose=false&code_lz=PTAEFEA8EMFsAcA2BTUBBAxh5BnHBLAOwHNQATZZJAT1ENwBdkzR4AnAe3mTYf11AAoEKAAWDBvBwAuEACNoc5IgBWOAHT4OwMhww5gCpYgC0SAK7EiJhm2iEcAMw5tYJrnw6FopjKOhERMQAxNBYuAQkJhRUiNQm9DhMZGac3Lz8OMJgAErmhKD4DKAA7kWi0nTwkKBGyqAmZoiWRDigAAJ1iMAWVoQ2dg7Oru7wnt6-_oEkoDgYbPhj6mqCGF5JoBxyKqAAvKAA3oKgoM4clUcnJwpsF8dX19AAXpUALABMADT3JwC-339vr8ANyCVbrYoKJ57TbbAD86jOCJuyOewNAIg-YLWDmKOGgjlQ-y2KgRAEdzJBUU90SJ8hRHERmGCRAB5MZaCagPwBQhBUD2FiEFywHzcqZ8mYYey1VBEJiufCQZkkhFndQojVojFgVmEOIC8J4UAAAzOJsKjlNJItyEg-CSOE-AsILBNUIt-Ec2VNN1t9sdLLAUDgSFQ5nxxFQZQYolqdgwAGtkMVhQxoONpIJVeoANoAIjO-YAuqi2NTaWAsUA&debug=false&forceAllTransforms=false&modules=false&shippedProposals=false&circleciRepo=&evaluate=false&fileSize=false&timeTravel=false&sourceType=script&lineWrap=true&presets=&prettier=false&targets=&version=7.24.7&externalPlugins=%40babel%2Fplugin-transform-optional-chaining%407.24.7&assumptions=%7B%7D)

## [Go to Nicolo's talk @babel/how-to](/doc/nicolo-howto-talk/README.md)